import express from "express";
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { registerChatRoutes } from "./replit_integrations/chat";
import { registerAudioRoutes } from "./replit_integrations/audio";
import { registerImageRoutes } from "./replit_integrations/image";
import { batchProcess } from "./replit_integrations/batch";
import OpenAI from "openai";
import { SUPPORTED_LANGUAGES, type SupportedLanguage, type ProblemCategory, type Attachment } from "@shared/schema";
import { LOCALE_CONFIGS, type LocaleCode, getLocaleConfig } from "@shared/locales";
import { searchWeb, buildSearchQuery, formatSearchResultsForPrompt } from "./utils/web-search";
// sanitizeString removed from input storage — use output escaping instead (13.03)
import multer from "multer";
import path from "path";
import { existsSync, mkdirSync } from "fs";
import { unlink } from "fs/promises";
import { randomUUID } from "crypto";
import { scanUploadedFiles } from "./utils/file-scanner";
import { scrubPii, scrubMessagesForAI } from "./utils/pii-guard";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!existsSync(UPLOADS_DIR)) {
  mkdirSync(UPLOADS_DIR, { recursive: true });
}

const uploadStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || "";
    cb(null, `${randomUUID()}${ext}`);
  },
});

const ALLOWED_MIME_TYPES = [
  "image/jpeg", "image/png", "image/gif", "image/webp", "image/heic", "image/heif",
  "application/pdf",
  "text/plain", "text/csv",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const upload = multer({
  storage: uploadStorage,
  limits: { fileSize: 10 * 1024 * 1024, files: 5 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} is not supported`));
    }
  },
});

function getSystemPrompt(language: SupportedLanguage, localeCode?: string): string {
  const langInfo = SUPPORTED_LANGUAGES[language];
  const locale = getLocaleConfig((localeCode as LocaleCode) || "IN");
  const base = locale.culturalAIContext;

  if (language === "english") {
    return base;
  }

  if (language === "hinglish") {
    return `${base}\n\nIMPORTANT: You MUST respond in Hinglish — a natural mix of Hindi and English as spoken in everyday Indian conversations. Use Romanized Hindi mixed with English words (e.g., "Bhai, tension mat le, sab sort ho jayega"). Use Devanagari script only for proverbs or emphasis. Keep the tone casual, warm, and relatable.`;
  }

  if (language === "singlish") {
    return `${base}\n\nIMPORTANT: You MUST respond in Singlish — the informal English-based creole spoken in Singapore. Mix English with Hokkien, Malay, and Mandarin words naturally (e.g., "Aiyah, don't worry lah, sure can one!"). Keep the tone casual, warm, and very Singaporean.`;
  }

  return `${base}\n\nIMPORTANT: You MUST respond entirely in ${langInfo.label} (${langInfo.nativeLabel}). Use the native script of ${langInfo.label}. The user is most comfortable in ${langInfo.label}, so provide your complete response — including headings, explanations, action steps, and cultural wisdom — in ${langInfo.label}. Only use English for technical terms that have no common ${langInfo.label} equivalent.`;
}

const CATEGORY_EXPERT_PROMPTS: Record<ProblemCategory, string> = {
  education: "You are also an EDUCATION SPECIALIST. Draw on pedagogy, academic counseling, study techniques, exam preparation strategies, school/university admission processes, scholarship guidance, and educational policy knowledge. Reference relevant educational frameworks, curricula standards, and learning methodologies. Provide specific, actionable study plans or educational paths when applicable.",

  law: "You are also a LEGAL EXPERT. Provide information based on relevant laws, acts, and legal precedents. Reference specific sections of applicable legislation when possible. ALWAYS clarify that this is educational information and NOT legal advice — recommend consulting a licensed lawyer for specific cases. Cover rights, procedures, timelines, and available legal remedies.",

  health: "You are also a HEALTH & MEDICAL ADVISOR. Provide evidence-based health information referencing medical guidelines and trusted health sources. ALWAYS include a disclaimer to consult a qualified healthcare professional for diagnosis and treatment. Cover preventive measures, symptom understanding, when to seek emergency care, and general wellness practices.",

  finance: "You are also a FINANCIAL ADVISOR. Provide practical financial guidance including budgeting, saving, investing, tax planning, and business strategy. Reference relevant financial regulations and instruments. Note this is educational information and recommend consulting a certified financial planner for personalized advice.",

  career: "You are also a CAREER COUNSELOR & HR EXPERT. Provide guidance on job searching, resume building, interview preparation, salary negotiation, workplace dynamics, career transitions, and professional development. Reference industry best practices and labor laws.",

  family: "You are also a FAMILY & RELATIONSHIP COUNSELOR. Provide empathetic, balanced advice on family dynamics, relationship challenges, parenting, eldercare, and interpersonal communication. Draw on established counseling frameworks while remaining culturally sensitive.",

  technology: "You are also a TECHNOLOGY & IT EXPERT. Provide technical guidance on software, hardware, digital tools, cybersecurity, troubleshooting, and technology adoption. Explain concepts clearly for non-technical users while being thorough for technical ones.",

  government: "You are also a PUBLIC POLICY & GOVERNMENT SERVICES EXPERT. Provide guidance on navigating government processes, public services, permits, licenses, welfare schemes, and civic participation. Reference specific government programs, eligibility criteria, and application processes.",

  housing: "You are also a HOUSING & REAL ESTATE EXPERT. Provide guidance on buying, renting, property disputes, home improvement, tenant rights, landlord responsibilities, and real estate market understanding. Reference relevant housing laws and regulations.",

  mental_wellness: "You are also a MENTAL WELLNESS GUIDE. Provide supportive, evidence-based guidance on stress management, anxiety, emotional well-being, mindfulness, and self-care. ALWAYS recommend professional help for serious mental health concerns. Include crisis helpline numbers when appropriate.",

  other: "Provide comprehensive, well-rounded guidance drawing on multiple disciplines as needed for this problem.",
};

function getCategoryPrompt(category: ProblemCategory): string {
  return CATEGORY_EXPERT_PROMPTS[category] || CATEGORY_EXPERT_PROMPTS.other;
}

const apiKey =
  process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY;

const hasLLM = !!apiKey;

const openai = hasLLM
  ? new OpenAI({
      apiKey,
      ...(process.env.AI_INTEGRATIONS_OPENAI_BASE_URL && {
        baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
      }),
    })
  : null;

const MOCK_SOLUTIONS: Record<string, (title: string, desc: string) => string> = {
  english: (title, desc) => [
    `## Understanding Your Concern: "${title}"`,
    "",
    "Namaste! I understand this is weighing on your mind. Here is a thoughtful approach to address your situation:",
    "",
    "### Step 1: Reflect & Acknowledge",
    `Based on what you've shared — *"${desc.slice(0, 120)}${desc.length > 120 ? "..." : ""}"* — the first step is to take a moment to breathe and acknowledge your feelings. Every challenge has a solution.`,
    "",
    "### Step 2: Practical Action Plan",
    "- **Talk it out** — Share your concerns with a trusted family member or friend who understands your situation.",
    "- **Break it down** — Divide this challenge into smaller, manageable steps instead of tackling everything at once.",
    "- **Seek guidance** — Consider consulting a professional or mentor who has experience with similar situations.",
    "",
    "### Step 3: Cultural Wisdom",
    '*"Karm karo, phal ki chinta mat karo"* — Focus on taking the right actions and trust that good outcomes will follow.',
    "",
    "### Important Note",
    "This is a **mock AI response** for development purposes. Connect a real LLM (OpenAI, Ollama, etc.) by setting `OPENAI_API_KEY` in your `.env` file to get personalised, in-depth solutions.",
    "",
    "---",
    "*Wishing you strength and clarity. You've got this!*",
  ].join("\n"),

  hindi: (title, desc) => [
    `## आपकी चिंता को समझना: "${title}"`,
    "",
    "नमस्ते! मैं समझता/समझती हूँ कि यह आपके मन पर भारी है। आपकी स्थिति के लिए एक विचारशील दृष्टिकोण यहाँ है:",
    "",
    "### चरण 1: चिंतन और स्वीकृति",
    `आपने जो बताया — *"${desc.slice(0, 120)}${desc.length > 120 ? "..." : ""}"* — पहला कदम है गहरी साँस लें और अपनी भावनाओं को स्वीकार करें। हर समस्या का समाधान होता है।`,
    "",
    "### चरण 2: व्यावहारिक कार्य योजना",
    "- **बात करें** — अपने परिवार के किसी विश्वसनीय सदस्य या मित्र से अपनी चिंताएँ साझा करें।",
    "- **छोटे कदम उठाएँ** — इस चुनौती को छोटे-छोटे कदमों में बाँटें।",
    "- **मार्गदर्शन लें** — किसी अनुभवी व्यक्ति या पेशेवर से सलाह लें।",
    "",
    "### चरण 3: सांस्कृतिक ज्ञान",
    '*"कर्म करो, फल की चिंता मत करो"* — सही कदम उठाते रहें और विश्वास रखें कि अच्छे परिणाम आएँगे।',
    "",
    "### महत्वपूर्ण सूचना",
    "यह विकास के उद्देश्य से एक **मॉक AI प्रतिक्रिया** है। व्यक्तिगत समाधान प्राप्त करने के लिए `OPENAI_API_KEY` सेट करें।",
    "",
    "---",
    "*आपको शक्ति और स्पष्टता की शुभकामनाएँ!*",
  ].join("\n"),

  hinglish: (title, desc) => [
    `## Aapki Concern Samajh Raha Hoon: "${title}"`,
    "",
    "Namaste! Main samajhta/samajhti hoon ki yeh aapke mind pe heavy hai. Yahan ek solid approach hai:",
    "",
    "### Step 1: Pehle Sochein Aur Accept Karein",
    `Aapne jo bataya — *"${desc.slice(0, 120)}${desc.length > 120 ? "..." : ""}"* — pehla step hai deep breath lo aur apni feelings ko accept karo. Har problem ka solution hota hai, bhai!`,
    "",
    "### Step 2: Practical Action Plan",
    "- **Baat karo** — Apne ghar mein ya kisi trusted friend se apni concerns share karo.",
    "- **Chhote steps lo** — Sab ek saath solve karne ki jagah, chhote-chhote steps mein todo.",
    "- **Guidance lo** — Kisi experienced person ya mentor se milke baat karo.",
    "",
    "### Step 3: Desi Wisdom",
    '*"Karm karo, phal ki chinta mat karo"* — Sahi kaam karte raho, result apne aap aayega!',
    "",
    "### Important Note",
    "Yeh ek **mock AI response** hai development ke liye. Real personalised solutions ke liye `OPENAI_API_KEY` set karein.",
    "",
    "---",
    "*Aapko himmat aur clarity ki shubhkamnayein. You've got this!*",
  ].join("\n"),

  tamil: (title, desc) => [
    `## உங்கள் கவலையை புரிந்துகொள்ளுதல்: "${title}"`,
    "",
    "வணக்கம்! இது உங்கள் மனதில் பாரமாக இருப்பது எனக்கு புரிகிறது.",
    "",
    "### படி 1: சிந்தித்து ஏற்றுக்கொள்ளுங்கள்",
    `நீங்கள் பகிர்ந்தது — *"${desc.slice(0, 80)}..."* — முதல் படி ஆழமான மூச்சு எடுத்து உங்கள் உணர்வுகளை ஏற்றுக்கொள்வது.`,
    "",
    "### படி 2: செயல் திட்டம்",
    "- **பேசுங்கள்** — நம்பகமான குடும்பத்தினர் அல்லது நண்பரிடம் பேசுங்கள்.",
    "- **சிறிய படிகள்** — சவாலை சிறிய படிகளாக பிரியுங்கள்.",
    "",
    "### முக்கிய குறிப்பு",
    "இது **mock AI பதில்**. தனிப்பயனாக்கப்பட்ட தீர்வுகளுக்கு `OPENAI_API_KEY` அமைக்கவும்.",
  ].join("\n"),
};

function generateMockSolution(title: string, description: string, language: SupportedLanguage): string {
  const generator = MOCK_SOLUTIONS[language] || MOCK_SOLUTIONS.english;
  return generator(title, description);
}

function getDiscussionSystemPrompt(language: SupportedLanguage, localeCode?: string): string {
  const langInfo = SUPPORTED_LANGUAGES[language];
  const locale = getLocaleConfig((localeCode as LocaleCode) || "IN");
  const base = `${locale.culturalAIContext} You are continuing a discussion. The user has already received an initial solution and now wants to discuss further. Maintain context of the original problem and all previous messages. Be conversational, supportive, and provide specific, actionable advice. Keep your responses focused and helpful.`;

  if (language === "english") return base;
  if (language === "hinglish") {
    return `${base}\n\nIMPORTANT: Continue responding in Hinglish — a natural mix of Hindi and English as spoken in everyday Indian conversations. Use Romanized Hindi mixed with English words. Keep the tone casual and warm.`;
  }
  if (language === "singlish") {
    return `${base}\n\nIMPORTANT: Continue responding in Singlish — the informal English-based creole spoken in Singapore. Keep the tone casual and warm.`;
  }
  return `${base}\n\nIMPORTANT: Continue responding entirely in ${langInfo.label} (${langInfo.nativeLabel}) using its native script.`;
}

async function getAISolution(
  title: string,
  description: string,
  language: SupportedLanguage = "english",
  category: ProblemCategory = "other"
): Promise<string> {
  if (!openai) {
    return generateMockSolution(title, description, language);
  }

  const scrubbedTitle = scrubPii(title).text;
  const scrubbedDesc = scrubPii(description).text;

  const baseSystemPrompt = getSystemPrompt(language);
  const categoryPrompt = getCategoryPrompt(category);
  const systemPrompt = `${baseSystemPrompt}\n\n${categoryPrompt}`;

  let webContext = "";
  try {
    const searchQuery = buildSearchQuery(scrubbedTitle, category);
    const searchResult = await searchWeb(searchQuery);
    webContext = formatSearchResultsForPrompt(searchResult);
  } catch (err) {
    console.error("[ai-solution] Web search failed, proceeding without:", err);
  }

  const userContent = webContext
    ? `Title: ${scrubbedTitle}\nDescription: ${scrubbedDesc}\n${webContext}`
    : `Title: ${scrubbedTitle}\nDescription: ${scrubbedDesc}`;

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ],
  });
  return response.choices[0]?.message?.content || "No solution generated.";
}

function generateMockDiscussionReply(userMessage: string): string {
  return [
    "Thank you for sharing more details. Let me think about this further...",
    "",
    `Regarding your point — *"${userMessage.slice(0, 80)}${userMessage.length > 80 ? "..." : ""}"* — here are my thoughts:`,
    "",
    "- **Consider the broader picture** — Every challenge has multiple angles. Think about how this affects everyone involved.",
    "- **Take small steps** — Rather than trying to solve everything at once, focus on one manageable action today.",
    "- **Stay positive** — As we say, *\"Himmat rakhiye, sab theek hoga.\"*",
    "",
    "*Feel free to keep discussing — I'm here for you!*",
    "",
    "---",
    "*Note: This is a mock AI response. Connect a real LLM for personalised follow-up advice.*",
  ].join("\n");
}

async function getAIDiscussionReply(
  problem: { title: string; description: string; solution: string | null; language: string; category: string },
  previousMessages: { role: string; content: string }[],
  newMessage: string
): Promise<string> {
  const language = (problem.language || "english") as SupportedLanguage;
  const category = (problem.category || "other") as ProblemCategory;
  if (!openai) {
    return generateMockDiscussionReply(newMessage);
  }

  const categoryPrompt = getCategoryPrompt(category);
  const discussionBase = getDiscussionSystemPrompt(language);

  const contextMessages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: `${discussionBase}\n\n${categoryPrompt}` },
    {
      role: "user",
      content: `Original Problem:\nTitle: ${problem.title}\nDescription: ${problem.description}`,
    },
  ];

  if (problem.solution) {
    contextMessages.push({ role: "assistant", content: problem.solution });
  }

  for (const msg of previousMessages) {
    contextMessages.push({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    });
  }

  contextMessages.push({ role: "user", content: newMessage });

  const { messages: scrubbedMessages } = scrubMessagesForAI(contextMessages);

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: scrubbedMessages as typeof contextMessages,
  });

  return response.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // Wire scaffolded feature modules
  registerChatRoutes(app, isAuthenticated);
  registerAudioRoutes(app, isAuthenticated);
  registerImageRoutes(app, isAuthenticated);

  // --- Health Check (8.01) ---
  app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // --- SEO: Dynamic Sitemap ---
  app.get("/sitemap.xml", (_req, res) => {
    const baseUrl = process.env.BASE_URL || "https://bharatsolve.ai";
    const now = new Date().toISOString().split("T")[0];

    const urls = [
      { loc: "/", priority: "1.0", changefreq: "weekly" },
    ];

    const urlEntries = urls
      .map(
        (u) => `  <url>
    <loc>${baseUrl}${u.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
      )
      .join("\n");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlEntries}
</urlset>`;

    res.set("Content-Type", "application/xml");
    res.set("Cache-Control", "public, max-age=3600");
    res.send(sitemap);
  });

  // Helper to ensure profile exists
  async function ensureProfile(userId: string) {
    let profile = await storage.getUserProfile(userId);
    if (!profile) {
      profile = await storage.createUserProfile(userId);
    }
    return profile;
  }

  app.get(api.userProfiles.get.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const profile = await ensureProfile(userId);
    res.status(200).json(profile);
  });

  app.post(api.userProfiles.submitReferral.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    try {
      const input = api.userProfiles.submitReferral.input.parse(req.body);
      const profile = await storage.applyReferral(userId, input.referralCode);
      res.status(200).json(profile);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(400).json({ message: err.message });
    }
  });

  app.post(api.userProfiles.subscribe.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const profile = await storage.updateSubscription(userId, 'active');
    res.status(200).json(profile);
  });

  app.get(api.problems.list.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const problemsList = await storage.getProblems(userId);
    res.status(200).json(problemsList);
  });

  app.post(api.problems.create.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    try {
      const profile = await ensureProfile(userId);
      
      // Basic check: if trial expired and not active, maybe reject? 
      // Trial is 30 days.
      const trialDays = (new Date().getTime() - new Date(profile.trialStartDate).getTime()) / (1000 * 3600 * 24);
      const trialExpired = profile.subscriptionStatus === 'trial' && trialDays > 30;
      const hasFreeDays = profile.freeMonthsEarned > 0;
      if (trialExpired && !hasFreeDays && profile.subscriptionStatus !== 'active') {
        return res.status(403).json({ message: "Trial expired. Please subscribe." });
      }

      const input = api.problems.create.input.parse(req.body);
      const problem = await storage.createProblem(userId, input);

      let aiSolution: string;
      try {
        aiSolution = await getAISolution(
          input.title,
          input.description,
          input.language as SupportedLanguage,
          (input.category || "other") as ProblemCategory
        );
      } catch (aiErr) {
        await storage.deleteProblem(problem.id);
        throw aiErr;
      }
      const updatedProblem = await storage.updateProblemSolution(problem.id, aiSolution);

      res.status(201).json(updatedProblem);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: err.message });
    }
  });

  app.get(api.problems.get.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const problemId = parseInt(req.params.id, 10);
    if (isNaN(problemId)) return res.status(400).json({ message: "Invalid problem ID" });
    const problem = await storage.getProblem(problemId);
    if (!problem) return res.status(404).json({ message: "Not found" });
    if (problem.userId !== userId) return res.status(403).json({ message: "Forbidden" });
    
    res.status(200).json(problem);
  });

  // Discussion messages for a problem
  app.get(api.problems.listMessages.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const problemId = parseInt(req.params.id, 10);
    if (isNaN(problemId)) return res.status(400).json({ message: "Invalid problem ID" });
    const problem = await storage.getProblem(problemId);
    if (!problem) return res.status(404).json({ message: "Problem not found" });
    if (problem.userId !== userId) return res.status(403).json({ message: "Forbidden" });

    const messages = await storage.getDiscussionMessages(problemId);
    res.status(200).json(messages);
  });

  app.post(api.problems.sendMessage.path, isAuthenticated, upload.array("files", 5), async (req: any, res) => {
    const userId = req.user.claims.sub;
    const problemId = parseInt(req.params.id, 10);
    if (isNaN(problemId)) return res.status(400).json({ message: "Invalid problem ID" });

    try {
      const problem = await storage.getProblem(problemId);
      if (!problem) return res.status(404).json({ message: "Problem not found" });
      if (problem.userId !== userId) return res.status(401).json({ message: "Unauthorized" });

      const content = (req.body.content || "").trim();
      const files = (req.files as Express.Multer.File[]) || [];

      if (!content && files.length === 0) {
        return res.status(400).json({ message: "Message must have text or at least one attachment" });
      }

      if (files.length > 0) {
        const scanResult = await scanUploadedFiles(files);
        if (!scanResult.passed) {
          for (const f of files) {
            try { await unlink(f.path); } catch { /* already removed by scanner */ }
          }
          return res.status(400).json({
            message: `File "${scanResult.failedFile}" was rejected: ${scanResult.result?.reason}`,
          });
        }
      }

      const attachments: Attachment[] = files.map((f) => ({
        filename: f.filename,
        originalName: f.originalname,
        mimeType: f.mimetype,
        size: f.size,
        url: `/uploads/${f.filename}`,
      }));

      const sanitizedContent = content || "";
      const attachmentsJson = attachments.length > 0 ? JSON.stringify(attachments) : null;

      const userMessage = await storage.addDiscussionMessage(problemId, "user", sanitizedContent, attachmentsJson);

      const previousMessages = await storage.getDiscussionMessages(problemId);
      const history = previousMessages.filter((m) => m.id !== userMessage.id);

      let messageForAI = sanitizedContent;
      if (attachments.length > 0) {
        const attachmentDescriptions = attachments
          .map((a) => `[Attached file: ${a.originalName} (${a.mimeType})]`)
          .join("\n");
        messageForAI = messageForAI
          ? `${messageForAI}\n\n${attachmentDescriptions}`
          : attachmentDescriptions;
      }

      const aiReply = await getAIDiscussionReply(
        problem,
        history.map((m) => ({ role: m.role, content: m.content })),
        messageForAI
      );

      const aiMessage = await storage.addDiscussionMessage(problemId, "assistant", aiReply);

      res.status(201).json({ userMessage, aiMessage });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      if (err instanceof multer.MulterError) {
        const msg = err.code === "LIMIT_FILE_SIZE"
          ? "File too large. Maximum size is 10MB."
          : err.code === "LIMIT_FILE_COUNT"
            ? "Too many files. Maximum is 5."
            : err.message;
        return res.status(400).json({ message: msg });
      }
      res.status(500).json({ message: err.message });
    }
  });

  // Feedback submission
  app.post(api.feedback.submit.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    try {
      const input = api.feedback.submit.input.parse(req.body);
      const entry = await storage.createFeedback(userId, input);
      res.status(201).json(entry);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: err.message });
    }
  });

  // --- Privacy: Data Export (15.07) ---
  app.get("/api/profile/export", isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    try {
      const data = await storage.exportUserData(userId);
      res.setHeader("Content-Disposition", `attachment; filename="my-data-export-${new Date().toISOString().split("T")[0]}.json"`);
      res.status(200).json(data);
    } catch (err: any) {
      res.status(500).json({ message: "Failed to export data." });
    }
  });

  // --- Privacy: Account Deletion (15.06) ---
  app.delete("/api/profile", isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    try {
      await storage.deleteUserData(userId);
      req.logout?.((err: any) => {
        if (err) console.error("[privacy] Logout error during account deletion:", err);
      });
      req.session?.destroy?.((err: any) => {
        if (err) console.error("[privacy] Session destroy error:", err);
      });
      res.status(200).json({ message: "Account and all associated data have been permanently deleted." });
    } catch (err: any) {
      res.status(500).json({ message: "Failed to delete account." });
    }
  });

  app.use("/uploads", isAuthenticated, express.static(UPLOADS_DIR));

  // Batch problem-solving endpoint (processes multiple problems with AI in parallel)
  app.post("/api/problems/batch", isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    try {
      const profile = await ensureProfile(userId);
      const trialDays = (new Date().getTime() - new Date(profile.trialStartDate).getTime()) / (1000 * 3600 * 24);
      if (profile.subscriptionStatus === 'trial' && trialDays > 30 && profile.freeMonthsEarned === 0) {
        return res.status(403).json({ message: "Trial expired. Please subscribe." });
      }

      const schema = z.object({
        problems: z.array(z.object({
          title: z.string().min(1),
          description: z.string().min(1),
          language: z.string().default("english"),
          category: z.string().default("other"),
        })).min(1).max(10),
      });

      const { problems: inputs } = schema.parse(req.body);

      const results = await batchProcess(
        inputs,
        async (item) => {
          const problemInput = {
            title: item.title,
            description: item.description,
            language: item.language as SupportedLanguage,
            category: item.category as ProblemCategory,
          };
          const problem = await storage.createProblem(userId, problemInput);
          const aiSolution = await getAISolution(
            item.title,
            item.description,
            item.language as SupportedLanguage,
            item.category as ProblemCategory
          );
          return storage.updateProblemSolution(problem.id, aiSolution);
        },
        { concurrency: 2 }
      );

      res.status(201).json(results);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: err.message });
    }
  });

  return httpServer;
}
