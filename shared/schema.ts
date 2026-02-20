import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Required re-exports for auth and chat integrations
export * from "./models/auth";
export * from "./models/chat";

import { users } from "./models/auth";

export const problems = pgTable("problems", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
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

export const insertProblemSchema = createInsertSchema(problems).pick({
  title: true,
  description: true,
});

export type Problem = typeof problems.$inferSelect;
export type InsertProblem = z.infer<typeof insertProblemSchema>;

export type UserProfile = typeof userProfiles.$inferSelect;

export type CreateProblemRequest = InsertProblem;
