import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Required re-exports for auth and chat integrations
export * from "./models/auth";
export * from "./models/chat";

import { users } from "./models/auth";

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
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

export const supportedLanguageSchema = z.enum([
  "english", "hindi", "hinglish", "tamil", "telugu", "bengali",
  "marathi", "gujarati", "kannada", "malayalam", "punjabi", "odia",
]);

export const problems = pgTable("problems", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  language: text("language").default("english").notNull(),
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
});

export const discussionMessages = pgTable("discussion_messages", {
  id: serial("id").primaryKey(),
  problemId: integer("problem_id").references(() => problems.id, { onDelete: "cascade" }).notNull(),
  role: text("role").notNull(), // 'user' | 'assistant'
  content: text("content").notNull(),
  attachments: text("attachments"), // JSON array of { filename, originalName, mimeType, size, url }
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProblemSchema = createInsertSchema(problems).pick({
  title: true,
  description: true,
  language: true,
}).extend({
  language: supportedLanguageSchema.default("english"),
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

export type CreateProblemRequest = InsertProblem;
