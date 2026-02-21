import { isUsingDatabase, db } from "./db";
import { 
  problems, 
  userProfiles,
  discussionMessages,
  type Problem,
  type InsertProblem,
  type UserProfile,
  type DiscussionMessage
} from "@shared/schema";
import { eq, desc, asc } from "drizzle-orm";
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

  // Discussion
  getDiscussionMessages(problemId: number): Promise<DiscussionMessage[]>;
  addDiscussionMessage(problemId: number, role: string, content: string, attachments?: string | null): Promise<DiscussionMessage>;
}

// ── In-Memory Storage (development / no PostgreSQL) ──

export class MemoryStorage implements IStorage {
  private profiles: Map<string, UserProfile> = new Map();
  private problemsList: Problem[] = [];
  private messagesList: DiscussionMessage[] = [];
  private nextProfileId = 1;
  private nextProblemId = 1;
  private nextMessageId = 1;

  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    return this.profiles.get(userId);
  }

  async createUserProfile(userId: string): Promise<UserProfile> {
    const profile: UserProfile = {
      id: this.nextProfileId++,
      userId,
      subscriptionStatus: "trial",
      trialStartDate: new Date(),
      referralCode: randomUUID().substring(0, 8),
      referredBy: null,
      freeMonthsEarned: 0,
    };
    this.profiles.set(userId, profile);
    return profile;
  }

  async updateSubscription(userId: string, status: string): Promise<UserProfile> {
    const profile = this.profiles.get(userId);
    if (!profile) throw new Error("Profile not found");
    profile.subscriptionStatus = status;
    return profile;
  }

  async applyReferral(userId: string, code: string): Promise<UserProfile> {
    const referrer = [...this.profiles.values()].find((p) => p.referralCode === code);
    if (!referrer) throw new Error("Invalid referral code");
    if (referrer.userId === userId) throw new Error("Cannot refer yourself");

    const profile = this.profiles.get(userId);
    if (!profile) throw new Error("Profile not found");
    if (profile.referredBy) throw new Error("Already used a referral code");

    referrer.freeMonthsEarned += 1;
    profile.referredBy = code;
    profile.freeMonthsEarned += 1;
    return profile;
  }

  async getProblems(userId: string): Promise<Problem[]> {
    return this.problemsList
      .filter((p) => p.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
  }

  async getProblem(id: number): Promise<Problem | undefined> {
    return this.problemsList.find((p) => p.id === id);
  }

  async createProblem(userId: string, data: InsertProblem): Promise<Problem> {
    const problem: Problem = {
      id: this.nextProblemId++,
      userId,
      title: data.title,
      description: data.description,
      language: data.language || "english",
      solution: null,
      status: "pending",
      createdAt: new Date(),
    };
    this.problemsList.push(problem);
    return problem;
  }

  async updateProblemSolution(id: number, solution: string): Promise<Problem> {
    const problem = this.problemsList.find((p) => p.id === id);
    if (!problem) throw new Error("Problem not found");
    problem.solution = solution;
    problem.status = "solved";
    return problem;
  }

  async getDiscussionMessages(problemId: number): Promise<DiscussionMessage[]> {
    return this.messagesList
      .filter((m) => m.problemId === problemId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async addDiscussionMessage(problemId: number, role: string, content: string, attachments?: string | null): Promise<DiscussionMessage> {
    const message: DiscussionMessage = {
      id: this.nextMessageId++,
      problemId,
      role,
      content,
      attachments: attachments || null,
      createdAt: new Date(),
    };
    this.messagesList.push(message);
    return message;
  }
}

// ── PostgreSQL Storage (production) ──

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
    const [referrer] = await db.select().from(userProfiles).where(eq(userProfiles.referralCode, code));
    if (!referrer) throw new Error("Invalid referral code");
    if (referrer.userId === userId) throw new Error("Cannot refer yourself");

    const profile = await this.getUserProfile(userId);
    if (profile?.referredBy) throw new Error("Already used a referral code");

    await db.update(userProfiles)
      .set({ freeMonthsEarned: referrer.freeMonthsEarned + 1 })
      .where(eq(userProfiles.id, referrer.id));

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

  async getDiscussionMessages(problemId: number): Promise<DiscussionMessage[]> {
    return await db.select()
      .from(discussionMessages)
      .where(eq(discussionMessages.problemId, problemId))
      .orderBy(discussionMessages.createdAt);
  }

  async addDiscussionMessage(problemId: number, role: string, content: string, attachments?: string | null): Promise<DiscussionMessage> {
    const [message] = await db.insert(discussionMessages).values({
      problemId,
      role,
      content,
      attachments: attachments || null,
    }).returning();
    return message;
  }
}

export const storage: IStorage = isUsingDatabase
  ? new DatabaseStorage()
  : new MemoryStorage();
