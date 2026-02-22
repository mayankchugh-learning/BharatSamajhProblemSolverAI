import { isUsingDatabase, db } from "./db";
import { 
  problems, 
  userProfiles,
  discussionMessages,
  feedback,
  type Problem,
  type InsertProblem,
  type UserProfile,
  type DiscussionMessage,
  type Feedback,
  type InsertFeedback
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface UserDataExport {
  profile: UserProfile | null;
  problems: (Problem & { messages: DiscussionMessage[] })[];
  feedback: Feedback[];
  exportedAt: string;
}

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
  deleteProblem(id: number): Promise<void>;
  updateProblemSolution(id: number, solution: string): Promise<Problem>;

  // Discussion
  getDiscussionMessages(problemId: number): Promise<DiscussionMessage[]>;
  addDiscussionMessage(problemId: number, role: string, content: string, attachments?: string | null): Promise<DiscussionMessage>;

  // Feedback
  createFeedback(userId: string, data: InsertFeedback): Promise<Feedback>;

  // Privacy: data export & deletion
  exportUserData(userId: string): Promise<UserDataExport>;
  deleteUserData(userId: string): Promise<void>;
}

// ── In-Memory Storage (development / no PostgreSQL) ──

export class MemoryStorage implements IStorage {
  private profiles: Map<string, UserProfile> = new Map();
  private problemsList: Problem[] = [];
  private messagesList: DiscussionMessage[] = [];
  private feedbackList: Feedback[] = [];
  private nextProfileId = 1;
  private nextProblemId = 1;
  private nextMessageId = 1;
  private nextFeedbackId = 1;

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
    const referrer = Array.from(this.profiles.values()).find((p) => p.referralCode === code);
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
      category: data.category || "other",
      solution: null,
      status: "pending",
      createdAt: new Date(),
    };
    this.problemsList.push(problem);
    return problem;
  }

  async deleteProblem(id: number): Promise<void> {
    this.problemsList = this.problemsList.filter((p) => p.id !== id);
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

  async createFeedback(userId: string, data: InsertFeedback): Promise<Feedback> {
    const entry: Feedback = {
      id: this.nextFeedbackId++,
      userId,
      rating: data.rating,
      category: data.category,
      message: data.message,
      createdAt: new Date(),
    };
    this.feedbackList.push(entry);
    return entry;
  }

  async exportUserData(userId: string): Promise<UserDataExport> {
    const profile = this.profiles.get(userId) || null;
    const userProblems = this.problemsList.filter((p) => p.userId === userId);
    const problemsWithMessages = userProblems.map((p) => ({
      ...p,
      messages: this.messagesList.filter((m) => m.problemId === p.id),
    }));
    const userFeedback = this.feedbackList.filter((f) => f.userId === userId);
    return { profile, problems: problemsWithMessages, feedback: userFeedback, exportedAt: new Date().toISOString() };
  }

  async deleteUserData(userId: string): Promise<void> {
    const userProblemIds = new Set(this.problemsList.filter((p) => p.userId === userId).map((p) => p.id));
    this.messagesList = this.messagesList.filter((m) => !userProblemIds.has(m.problemId));
    this.problemsList = this.problemsList.filter((p) => p.userId !== userId);
    this.feedbackList = this.feedbackList.filter((f) => f.userId !== userId);
    this.profiles.delete(userId);
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
    if (!profile) throw new Error("Profile not found");
    return profile;
  }

  async applyReferral(userId: string, code: string): Promise<UserProfile> {
    return await db.transaction(async (tx) => {
      const [referrer] = await tx.select().from(userProfiles).where(eq(userProfiles.referralCode, code));
      if (!referrer) throw new Error("Invalid referral code");
      if (referrer.userId === userId) throw new Error("Cannot refer yourself");

      const [profile] = await tx.select().from(userProfiles).where(eq(userProfiles.userId, userId));
      if (!profile) throw new Error("Profile not found");
      if (profile.referredBy) throw new Error("Already used a referral code");

      await tx.update(userProfiles)
        .set({ freeMonthsEarned: referrer.freeMonthsEarned + 1 })
        .where(eq(userProfiles.id, referrer.id));

      const [updatedUser] = await tx.update(userProfiles)
        .set({ referredBy: code, freeMonthsEarned: profile.freeMonthsEarned + 1 })
        .where(eq(userProfiles.userId, userId))
        .returning();

      return updatedUser;
    });
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

  async deleteProblem(id: number): Promise<void> {
    await db.delete(problems).where(eq(problems.id, id));
  }

  async updateProblemSolution(id: number, solution: string): Promise<Problem> {
    const [problem] = await db.update(problems)
      .set({ solution, status: 'solved' })
      .where(eq(problems.id, id))
      .returning();
    if (!problem) throw new Error("Problem not found");
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

  async createFeedback(userId: string, data: InsertFeedback): Promise<Feedback> {
    const [entry] = await db.insert(feedback).values({
      userId,
      rating: data.rating,
      category: data.category,
      message: data.message,
    }).returning();
    return entry;
  }

  async exportUserData(userId: string): Promise<UserDataExport> {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    const userProblems = await db.select().from(problems).where(eq(problems.userId, userId)).orderBy(desc(problems.createdAt));
    const problemsWithMessages = await Promise.all(
      userProblems.map(async (p) => {
        const msgs = await db.select().from(discussionMessages).where(eq(discussionMessages.problemId, p.id)).orderBy(discussionMessages.createdAt);
        return { ...p, messages: msgs };
      })
    );
    const userFeedback = await db.select().from(feedback).where(eq(feedback.userId, userId));
    return { profile: profile || null, problems: problemsWithMessages, feedback: userFeedback, exportedAt: new Date().toISOString() };
  }

  async deleteUserData(userId: string): Promise<void> {
    await db.transaction(async (tx) => {
      const userProblems = await tx.select({ id: problems.id }).from(problems).where(eq(problems.userId, userId));
      for (const p of userProblems) {
        await tx.delete(discussionMessages).where(eq(discussionMessages.problemId, p.id));
      }
      await tx.delete(problems).where(eq(problems.userId, userId));
      await tx.delete(feedback).where(eq(feedback.userId, userId));
      await tx.delete(userProfiles).where(eq(userProfiles.userId, userId));
    });
  }
}

export const storage: IStorage = isUsingDatabase
  ? new DatabaseStorage()
  : new MemoryStorage();
