import express from "express";
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import OpenAI from "openai";
import { SUPPORTED_LANGUAGES, type SupportedLanguage, type Attachment } from "@shared/schema";
import { sanitizeString } from "./middleware/security";
import multer from "multer";
import path from "path";
import { existsSync, mkdirSync } from "fs";
import { randomUUID } from "crypto";

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

function getSystemPrompt(language: SupportedLanguage): string {
  const langInfo = SUPPORTED_LANGUAGES[language];
  const base =
    "You are an empathetic Indian expert problem solver. Understand the cultural nuances, family dynamics, and social context of India. Provide clear, actionable, and emotionally resonant solutions that respect Indian values while being modern and practical.";

  if (language === "english") {
    return base;
  }

  if (language === "hinglish") {
    return `${base}\n\nIMPORTANT: You MUST respond in Hinglish — a natural mix of Hindi and English as spoken in everyday Indian conversations. Use Romanized Hindi mixed with English words (e.g., "Bhai, tension mat le, sab sort ho jayega"). Use Devanagari script only for proverbs or emphasis. Keep the tone casual, warm, and relatable.`;
  }

  return `${base}\n\nIMPORTANT: You MUST respond entirely in ${langInfo.label} (${langInfo.nativeLabel}). Use the native script of ${langInfo.label}. The user is most comfortable in ${langInfo.label}, so provide your complete response — including headings, explanations, action steps, and cultural wisdom — in ${langInfo.label}. Only use English for technical terms that have no common ${langInfo.label} equivalent.`;
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

function getDiscussionSystemPrompt(language: SupportedLanguage): string {
  const langInfo = SUPPORTED_LANGUAGES[language];
  const base =
    "You are an empathetic Indian expert problem solver continuing a discussion. The user has already received an initial solution and now wants to discuss further. Maintain context of the original problem and all previous messages. Be conversational, supportive, and provide specific, actionable advice. Understand Indian cultural nuances, family dynamics, and social context. Keep your responses focused and helpful.";

  if (language === "english") return base;
  if (language === "hinglish") {
    return `${base}\n\nIMPORTANT: Continue responding in Hinglish — a natural mix of Hindi and English as spoken in everyday Indian conversations. Use Romanized Hindi mixed with English words. Keep the tone casual and warm.`;
  }
  return `${base}\n\nIMPORTANT: Continue responding entirely in ${langInfo.label} (${langInfo.nativeLabel}) using its native script.`;
}

async function getAISolution(title: string, description: string, language: SupportedLanguage = "english"): Promise<string> {
  if (!openai) {
    return generateMockSolution(title, description, language);
  }

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [
      { role: "system", content: getSystemPrompt(language) },
      { role: "user", content: `Title: ${title}\nDescription: ${description}` },
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
  problem: { title: string; description: string; solution: string | null; language: string },
  previousMessages: { role: string; content: string }[],
  newMessage: string
): Promise<string> {
  const language = (problem.language || "english") as SupportedLanguage;
  if (!openai) {
    return generateMockDiscussionReply(newMessage);
  }

  const contextMessages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: getDiscussionSystemPrompt(language) },
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

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: contextMessages,
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
      if (profile.subscriptionStatus === 'trial' && trialDays > 30 && profile.freeMonthsEarned === 0) {
        return res.status(403).json({ message: "Trial expired. Please subscribe." });
      }

      const input = api.problems.create.input.parse(req.body);
      const sanitizedInput = {
        ...input,
        title: sanitizeString(input.title),
        description: sanitizeString(input.description),
      };
      const problem = await storage.createProblem(userId, sanitizedInput);

      const aiSolution = await getAISolution(sanitizedInput.title, sanitizedInput.description, input.language as SupportedLanguage);
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
    const problem = await storage.getProblem(Number(req.params.id));
    if (!problem) return res.status(404).json({ message: "Not found" });
    if (problem.userId !== userId) return res.status(401).json({ message: "Unauthorized" });
    
    res.status(200).json(problem);
  });

  // Discussion messages for a problem
  app.get(api.problems.listMessages.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const problemId = Number(req.params.id);
    const problem = await storage.getProblem(problemId);
    if (!problem) return res.status(404).json({ message: "Problem not found" });
    if (problem.userId !== userId) return res.status(401).json({ message: "Unauthorized" });

    const messages = await storage.getDiscussionMessages(problemId);
    res.status(200).json(messages);
  });

  app.post(api.problems.sendMessage.path, isAuthenticated, upload.array("files", 5), async (req: any, res) => {
    const userId = req.user.claims.sub;
    const problemId = Number(req.params.id);

    try {
      const problem = await storage.getProblem(problemId);
      if (!problem) return res.status(404).json({ message: "Problem not found" });
      if (problem.userId !== userId) return res.status(401).json({ message: "Unauthorized" });

      const content = (req.body.content || "").trim();
      const files = (req.files as Express.Multer.File[]) || [];

      if (!content && files.length === 0) {
        return res.status(400).json({ message: "Message must have text or at least one attachment" });
      }

      const attachments: Attachment[] = files.map((f) => ({
        filename: f.filename,
        originalName: f.originalname,
        mimeType: f.mimetype,
        size: f.size,
        url: `/uploads/${f.filename}`,
      }));

      const sanitizedContent = content ? sanitizeString(content) : "";
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

  app.use("/uploads", express.static(UPLOADS_DIR));

  return httpServer;
}
