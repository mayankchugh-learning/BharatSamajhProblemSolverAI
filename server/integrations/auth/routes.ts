import type { Express } from "express";
import { authStorage } from "./storage";
import { isAuthenticated } from "./auth";
import { isAdminUser } from "./adminAuth";
import { logger } from "../../utils/logger";

// Register auth-specific routes
export function registerAuthRoutes(app: Express): void {
  // Get current authenticated user
  app.get("/api/v1/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await authStorage.getUser(userId);
      const isAdmin = isAdminUser(userId);
      res.json({ ...user, isAdmin });
    } catch (error) {
      req.log?.error({ err: error }, "Error fetching user") ?? logger.error({ err: error }, "Error fetching user");
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
}
