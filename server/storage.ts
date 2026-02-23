import { isUsingDatabase, db } from "./db";
import { 
  problems, 
  userProfiles,
  discussionMessages,
  feedback,
  tasks,
  type Problem,
  type InsertProblem,
  type UserProfile,
  type DiscussionMessage,
  type Feedback,
  type InsertFeedback,
  type Task,
  type InsertTask,
  type UpdateTask,
} from "@shared/schema";
import { eq, desc, sql, and, or, ilike } from "drizzle-orm";
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
  getProblemsFiltered(
    userId: string,
    filters: { search?: string; category?: string; status?: string; page?: number; limit?: number }
  ): Promise<{ problems: Problem[]; total: number }>;
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

  // Tasks
  getTasks(userId: string): Promise<Task[]>;
  getTask(id: number, userId: string): Promise<Task | undefined>;
  createTask(userId: string, data: InsertTask): Promise<Task>;
  updateTask(id: number, userId: string, data: UpdateTask): Promise<Task>;
  deleteTask(id: number, userId: string): Promise<void>;

  // Admin
  getAdminStats(): Promise<{ users: number; problems: number; trial: number; active: number; expired: number; feedback: number }>;
  updateUserAccess(userId: string, accessStatus: "active" | "suspended"): Promise<UserProfile | null>;
  getAllProfiles(): Promise<UserProfile[]>;
}

// ── In-Memory Storage (development / no PostgreSQL) ──

export class MemoryStorage implements IStorage {
  private profiles: Map<string, UserProfile> = new Map();
  private problemsList: Problem[] = [];
  private messagesList: DiscussionMessage[] = [];
  private feedbackList: Feedback[] = [];
  private tasksList: Task[] = [];
  private nextProfileId = 1;
  private nextProblemId = 1;
  private nextMessageId = 1;
  private nextFeedbackId = 1;
  private nextTaskId = 1;

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
      accessStatus: "active",
    } as UserProfile;
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

  async getProblemsFiltered(
    userId: string,
    filters: { search?: string; category?: string; status?: string; page?: number; limit?: number }
  ): Promise<{ problems: Problem[]; total: number }> {
    let list = this.problemsList
      .filter((p) => p.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));

    if (filters.search?.trim()) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          (p.title || "").toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
      );
    }
    if (filters.category?.trim()) {
      list = list.filter((p) => (p.category || "other") === filters.category);
    }
    if (filters.status?.trim()) {
      list = list.filter((p) => (p.status || "pending") === filters.status);
    }

    const total = list.length;
    const page = Math.max(1, filters.page ?? 1);
    const limit = Math.min(50, Math.max(1, filters.limit ?? 12));
    const offset = (page - 1) * limit;
    const problems = list.slice(offset, offset + limit);
    return { problems, total };
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
    this.tasksList = this.tasksList.filter((t) => t.userId !== userId);
    this.profiles.delete(userId);
  }

  async getTasks(userId: string): Promise<Task[]> {
    return this.tasksList
      .filter((t) => t.userId === userId)
      .sort((a, b) => (b.updatedAt?.getTime() ?? b.createdAt?.getTime() ?? 0) - (a.updatedAt?.getTime() ?? a.createdAt?.getTime() ?? 0));
  }

  async getTask(id: number, userId: string): Promise<Task | undefined> {
    const t = this.tasksList.find((x) => x.id === id);
    return t?.userId === userId ? t : undefined;
  }

  async createTask(userId: string, data: InsertTask): Promise<Task> {
    const task: Task = {
      id: this.nextTaskId++,
      userId,
      title: data.title,
      description: data.description ?? "",
      status: data.status ?? "todo",
      priority: data.priority ?? "medium",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Task;
    this.tasksList.push(task);
    return task;
  }

  async updateTask(id: number, userId: string, data: UpdateTask): Promise<Task> {
    const task = this.tasksList.find((t) => t.id === id && t.userId === userId);
    if (!task) throw new Error("Task not found");
    if (data.title !== undefined) task.title = data.title;
    if (data.description !== undefined) task.description = data.description;
    if (data.status !== undefined) task.status = data.status;
    if (data.priority !== undefined) task.priority = data.priority;
    (task as any).updatedAt = new Date();
    return task;
  }

  async deleteTask(id: number, userId: string): Promise<void> {
    this.tasksList = this.tasksList.filter((t) => !(t.id === id && t.userId === userId));
  }

  async getAdminStats(): Promise<{ users: number; problems: number; trial: number; active: number; expired: number; feedback: number }> {
    const profiles = Array.from(this.profiles.values());
    const trial = profiles.filter((p) => p.subscriptionStatus === "trial").length;
    const active = profiles.filter((p) => p.subscriptionStatus === "active").length;
    const expired = profiles.filter((p) => p.subscriptionStatus === "expired").length;
    return {
      users: profiles.length,
      problems: this.problemsList.length,
      trial,
      active,
      expired,
      feedback: this.feedbackList.length,
    };
  }

  async updateUserAccess(userId: string, accessStatus: "active" | "suspended"): Promise<UserProfile | null> {
    const profile = this.profiles.get(userId);
    if (!profile) return null;
    (profile as any).accessStatus = accessStatus;
    return profile;
  }

  async getAllProfiles(): Promise<UserProfile[]> {
    return Array.from(this.profiles.values());
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
      accessStatus: 'active',
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

  async getProblemsFiltered(
    userId: string,
    filters: { search?: string; category?: string; status?: string; page?: number; limit?: number }
  ): Promise<{ problems: Problem[]; total: number }> {
    const conditions = [eq(problems.userId, userId)];

    if (filters.search?.trim()) {
      const q = `%${filters.search.trim().replace(/%/g, "\\%")}%`;
      conditions.push(
        or(
          ilike(problems.title, q),
          ilike(problems.description, q)
        )!
      );
    }
    if (filters.category?.trim()) {
      conditions.push(eq(problems.category, filters.category));
    }
    if (filters.status?.trim()) {
      conditions.push(eq(problems.status, filters.status));
    }

    const whereClause = and(...conditions);
    const baseQuery = db.select().from(problems).where(whereClause).orderBy(desc(problems.createdAt));

    const [countResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(problems)
      .where(whereClause);

    const total = countResult?.count ?? 0;
    const page = Math.max(1, filters.page ?? 1);
    const limit = Math.min(50, Math.max(1, filters.limit ?? 12));
    const offset = (page - 1) * limit;
    const problemsList = await baseQuery.limit(limit).offset(offset);
    return { problems: problemsList, total };
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
      await tx.delete(tasks).where(eq(tasks.userId, userId));
      await tx.delete(userProfiles).where(eq(userProfiles.userId, userId));
    });
  }

  async getTasks(userId: string): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.userId, userId)).orderBy(desc(tasks.updatedAt), desc(tasks.createdAt));
  }

  async getTask(id: number, userId: string): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task?.userId === userId ? task : undefined;
  }

  async createTask(userId: string, data: InsertTask): Promise<Task> {
    const [task] = await db.insert(tasks).values({
      userId,
      title: data.title,
      description: data.description ?? "",
      status: data.status ?? "todo",
      priority: data.priority ?? "medium",
      updatedAt: new Date(),
    }).returning();
    return task;
  }

  async updateTask(id: number, userId: string, data: UpdateTask): Promise<Task> {
    const [task] = await db.update(tasks)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();
    if (!task) throw new Error("Task not found");
    return task;
  }

  async deleteTask(id: number, userId: string): Promise<void> {
    await db.delete(tasks).where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
  }

  async getAdminStats(): Promise<{ users: number; problems: number; trial: number; active: number; expired: number; feedback: number }> {
    const [[u], [p], [trial], [active], [expired], [fb]] = await Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(userProfiles),
      db.select({ count: sql<number>`count(*)::int` }).from(problems),
      db.select({ count: sql<number>`count(*)::int` }).from(userProfiles).where(eq(userProfiles.subscriptionStatus, "trial")),
      db.select({ count: sql<number>`count(*)::int` }).from(userProfiles).where(eq(userProfiles.subscriptionStatus, "active")),
      db.select({ count: sql<number>`count(*)::int` }).from(userProfiles).where(eq(userProfiles.subscriptionStatus, "expired")),
      db.select({ count: sql<number>`count(*)::int` }).from(feedback),
    ]);
    return {
      users: u?.count ?? 0,
      problems: p?.count ?? 0,
      trial: trial?.count ?? 0,
      active: active?.count ?? 0,
      expired: expired?.count ?? 0,
      feedback: fb?.count ?? 0,
    };
  }

  async updateUserAccess(userId: string, accessStatus: "active" | "suspended"): Promise<UserProfile | null> {
    const [profile] = await db.update(userProfiles)
      .set({ accessStatus })
      .where(eq(userProfiles.userId, userId))
      .returning();
    return profile ?? null;
  }

  async getAllProfiles(): Promise<UserProfile[]> {
    return await db.select().from(userProfiles).orderBy(desc(userProfiles.trialStartDate));
  }
}

export const storage: IStorage = isUsingDatabase
  ? new DatabaseStorage()
  : new MemoryStorage();
