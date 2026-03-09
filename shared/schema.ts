import { pgTable, text, serial, integer, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Required re-exports for auth and chat integrations
export * from "./models/auth";
export * from "./models/chat";

import { users } from "./models/auth";

import { LOCALE_CONFIGS } from "./locales";

export const PROBLEM_CATEGORIES = {
  education: { label: "Education & Learning", icon: "GraduationCap" },
  law: { label: "Law & Legal", icon: "Scale" },
  health: { label: "Health & Medical", icon: "HeartPulse" },
  finance: { label: "Finance & Business", icon: "Banknote" },
  career: { label: "Career & Employment", icon: "Briefcase" },
  family: { label: "Family & Relationships", icon: "Users" },
  technology: { label: "Technology & IT", icon: "Cpu" },
  government: { label: "Government & Public Services", icon: "Building2" },
  housing: { label: "Housing & Property", icon: "Home" },
  mental_wellness: { label: "Mental Wellness", icon: "Brain" },
  other: { label: "Other / General", icon: "HelpCircle" },
} as const;

export type ProblemCategory = keyof typeof PROBLEM_CATEGORIES;

const ALL_CATEGORY_KEYS = Object.keys(PROBLEM_CATEGORIES) as [string, ...string[]];
export const problemCategorySchema = z.enum(ALL_CATEGORY_KEYS as [ProblemCategory, ...ProblemCategory[]]);

export const SUPPORTED_LANGUAGES = {
  english: { label: "English", nativeLabel: "English", greeting: "Hello" },
  hindi: { label: "Hindi", nativeLabel: "हिन्दी", greeting: "नमस्ते" },
  hinglish: { label: "Hinglish", nativeLabel: "Hinglish", greeting: "Namaste" },
  tamil: { label: "Tamil", nativeLabel: "தமிழ்", greeting: "வணக்கம்" },
  telugu: { label: "Telugu", nativeLabel: "తెలుగు", greeting: "నమస్కారం" },
  bengali: { label: "Bengali", nativeLabel: "বাংলা", greeting: "নমস্কার" },
  marathi: { label: "Marathi", nativeLabel: "मराठी", greeting: "नमस्कार" },
  gujarati: { label: "Gujarati", nativeLabel: "ગુજરાતી", greeting: "નમસ્તે" },
  kannada: { label: "Kannada", nativeLabel: "ಕನ್ನಡ", greeting: "ನಮಸ್ಕಾರ" },
  malayalam: { label: "Malayalam", nativeLabel: "മലയാളം", greeting: "നമസ്കാരം" },
  punjabi: { label: "Punjabi", nativeLabel: "ਪੰਜਾਬੀ", greeting: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ" },
  odia: { label: "Odia", nativeLabel: "ଓଡ଼ିଆ", greeting: "ନମସ୍କାର" },
  mandarin: { label: "Mandarin", nativeLabel: "中文", greeting: "你好" },
  mandarin_simplified: { label: "Mandarin (Simplified)", nativeLabel: "简体中文", greeting: "你好" },
  malay: { label: "Malay", nativeLabel: "Bahasa Melayu", greeting: "Selamat" },
  singlish: { label: "Singlish", nativeLabel: "Singlish", greeting: "Eh hello lah" },
  cantonese: { label: "Cantonese", nativeLabel: "廣東話", greeting: "你好" },
  japanese: { label: "Japanese", nativeLabel: "日本語", greeting: "こんにちは" },
  korean: { label: "Korean", nativeLabel: "한국어", greeting: "안녕하세요" },
  spanish: { label: "Spanish", nativeLabel: "Español", greeting: "Hola" },
  arabic: { label: "Arabic", nativeLabel: "العربية", greeting: "مرحبا" },
  german: { label: "German", nativeLabel: "Deutsch", greeting: "Hallo" },
  portuguese: { label: "Portuguese", nativeLabel: "Português", greeting: "Olá" },
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

const ALL_LANGUAGE_KEYS = Object.keys(SUPPORTED_LANGUAGES) as [string, ...string[]];

export const supportedLanguageSchema = z.enum(ALL_LANGUAGE_KEYS as [SupportedLanguage, ...SupportedLanguage[]]);

export function getLanguagesForLocale(localeCode: string): Record<string, typeof SUPPORTED_LANGUAGES[SupportedLanguage]> {
  const localeConfig = LOCALE_CONFIGS[localeCode as keyof typeof LOCALE_CONFIGS];
  if (!localeConfig) return SUPPORTED_LANGUAGES;
  const result: Record<string, typeof SUPPORTED_LANGUAGES[SupportedLanguage]> = {};
  for (const key of Object.keys(localeConfig.languages)) {
    if (key in SUPPORTED_LANGUAGES) {
      result[key] = SUPPORTED_LANGUAGES[key as SupportedLanguage];
    }
  }
  return result;
}

export const problems = pgTable("problems", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  language: text("language").default("english").notNull(),
  category: text("category").default("other").notNull(),
  solution: text("solution"),
  status: text("status").default('pending').notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).unique().notNull(),
  subscriptionStatus: text("subscription_status").default('trial').notNull(), // trial, active, expired
  trialStartDate: timestamp("trial_start_date").defaultNow().notNull(),
  referralCode: text("referral_code").notNull().unique(),
  referredBy: varchar("referred_by"), // The referral code of the person who referred them
  freeMonthsEarned: integer("free_months_earned").default(0).notNull(),
  accessStatus: text("access_status").default('active').notNull(), // active, suspended (admin control)
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description").default(""),
  status: text("status").default("todo").notNull(), // todo, in_progress, done
  priority: text("priority").default("medium").notNull(), // low, medium, high
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const discussionMessages = pgTable("discussion_messages", {
  id: serial("id").primaryKey(),
  problemId: integer("problem_id").references(() => problems.id, { onDelete: "cascade" }).notNull(),
  role: text("role").notNull(), // 'user' | 'assistant'
  content: text("content").notNull(),
  attachments: text("attachments"), // JSON array of { filename, originalName, mimeType, size, url }
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(),
  category: text("category").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pageViews = pgTable("page_views", {
  id: serial("id").primaryKey(),
  path: text("path").notNull(),
  userId: varchar("user_id").references(() => users.id),
  country: varchar("country", { length: 2 }),
  region: text("region"),
  city: text("city"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type PageView = typeof pageViews.$inferSelect;

export const contactRequests = pgTable("contact_requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  userId: varchar("user_id").references(() => users.id),
  status: text("status").default("pending").notNull(),
  adminResponse: text("admin_response"),
  respondedAt: timestamp("responded_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContactRequestSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Valid email is required"),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
});

export type ContactRequest = typeof contactRequests.$inferSelect;
export type InsertContactRequest = z.infer<typeof insertContactRequestSchema>;

export const insertFeedbackSchema = createInsertSchema(feedback).pick({
  rating: true,
  category: true,
  message: true,
}).extend({
  rating: z.number().min(1, "Please select a rating").max(5),
  category: z.enum(["general", "bug", "feature", "improvement", "other"], {
    required_error: "Please select a category",
  }),
  message: z.string().min(10, "Feedback must be at least 10 characters").max(2000),
});

export type Feedback = typeof feedback.$inferSelect;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;

export const insertProblemSchema = createInsertSchema(problems).pick({
  title: true,
  description: true,
  language: true,
  category: true,
}).extend({
  language: supportedLanguageSchema.default("english"),
  category: problemCategorySchema.default("other"),
});

export const attachmentSchema = z.object({
  filename: z.string(),
  originalName: z.string(),
  mimeType: z.string(),
  size: z.number(),
  url: z.string(),
});

export type Attachment = z.infer<typeof attachmentSchema>;

export const insertDiscussionMessageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty"),
});

export const insertDiscussionMessageWithAttachmentsSchema = z.object({
  content: z.string().default(""),
  attachments: z.array(attachmentSchema).optional(),
}).refine(
  (data) => data.content.trim().length > 0 || (data.attachments && data.attachments.length > 0),
  { message: "Message must have text or at least one attachment" }
);

export type Problem = typeof problems.$inferSelect;
export type InsertProblem = z.infer<typeof insertProblemSchema>;
export type DiscussionMessage = typeof discussionMessages.$inferSelect;
export type InsertDiscussionMessage = z.infer<typeof insertDiscussionMessageSchema>;

export type UserProfile = typeof userProfiles.$inferSelect;

export type Task = typeof tasks.$inferSelect;
export const insertTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().default(""),
  status: z.enum(["todo", "in_progress", "done"]).default("todo"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});
export type InsertTask = z.infer<typeof insertTaskSchema>;

export const updateTaskSchema = insertTaskSchema.partial();
export type UpdateTask = z.infer<typeof updateTaskSchema>;

export type CreateProblemRequest = InsertProblem;
