import { db } from "./db";
import { 
  problems, 
  userProfiles,
  type Problem,
  type InsertProblem,
  type UserProfile
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // Profiles
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  createUserProfile(userId: string): Promise<UserProfile>;
  updateSubscription(userId: string, status: string): Promise<UserProfile>;
  applyReferral(userId: string, code: string): Promise<UserProfile>;
  
  // Problems
  getProblems(userId: string): Promise<Problem[]>;
  getProblem(id: number): Promise<Problem | undefined>;
  createProblem(userId: string, problem: InsertProblem): Promise<Problem>;
  updateProblemSolution(id: number, solution: string): Promise<Problem>;
}

export class DatabaseStorage implements IStorage {
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    return profile;
  }

  async createUserProfile(userId: string): Promise<UserProfile> {
    const code = randomUUID().substring(0, 8);
    const [profile] = await db.insert(userProfiles).values({
      userId,
      referralCode: code,
      subscriptionStatus: 'trial',
      trialStartDate: new Date(),
    }).returning();
    return profile;
  }

  async updateSubscription(userId: string, status: string): Promise<UserProfile> {
    const [profile] = await db.update(userProfiles)
      .set({ subscriptionStatus: status })
      .where(eq(userProfiles.userId, userId))
      .returning();
    return profile;
  }

  async applyReferral(userId: string, code: string): Promise<UserProfile> {
    // Find who owns the code
    const [referrer] = await db.select().from(userProfiles).where(eq(userProfiles.referralCode, code));
    if (!referrer) throw new Error("Invalid referral code");
    if (referrer.userId === userId) throw new Error("Cannot refer yourself");

    const profile = await this.getUserProfile(userId);
    if (profile?.referredBy) throw new Error("Already used a referral code");

    // Give referrer a free month
    await db.update(userProfiles)
      .set({ freeMonthsEarned: referrer.freeMonthsEarned + 1 })
      .where(eq(userProfiles.id, referrer.id));

    // Update user
    const [updatedUser] = await db.update(userProfiles)
      .set({ referredBy: code, freeMonthsEarned: (profile?.freeMonthsEarned || 0) + 1 })
      .where(eq(userProfiles.userId, userId))
      .returning();

    return updatedUser;
  }

  async getProblems(userId: string): Promise<Problem[]> {
    return await db.select().from(problems).where(eq(problems.userId, userId)).orderBy(desc(problems.createdAt));
  }

  async getProblem(id: number): Promise<Problem | undefined> {
    const [problem] = await db.select().from(problems).where(eq(problems.id, id));
    return problem;
  }

  async createProblem(userId: string, problemData: InsertProblem): Promise<Problem> {
    const [problem] = await db.insert(problems).values({
      ...problemData,
      userId,
      status: 'pending'
    }).returning();
    return problem;
  }

  async updateProblemSolution(id: number, solution: string): Promise<Problem> {
    const [problem] = await db.update(problems)
      .set({ solution, status: 'solved' })
      .where(eq(problems.id, id))
      .returning();
    return problem;
  }
}

export const storage = new DatabaseStorage();
