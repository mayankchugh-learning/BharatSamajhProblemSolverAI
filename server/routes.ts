import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);

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
      const problem = await storage.createProblem(userId, input);

      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [
          { role: "system", content: "You are a helpful expert problem solver. Provide a clear, actionable solution to the user's problem." },
          { role: "user", content: `Title: ${input.title}\nDescription: ${input.description}` }
        ]
      });
      const aiSolution = response.choices[0]?.message?.content || "No solution generated.";
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

  return httpServer;
}
