import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import MemoryStore from "memorystore";
import { authStorage } from "./storage";
import { logger } from "../../utils/logger";

const isDevMode = process.env.NODE_ENV !== "production";
const isUsingDatabase = !!process.env.DATABASE_URL;

const DEV_USER_ID = "dev-user-001";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const secret = process.env.SESSION_SECRET;

  if (!secret && !isDevMode) {
    logger.error("[security] SESSION_SECRET is not set! This is a critical security risk in production.");
    process.exit(1);
  }

  let store: session.Store;
  if (isUsingDatabase) {
    const pgStore = connectPg(session);
    store = new pgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: false,
      ttl: sessionTtl,
      tableName: "sessions",
    });
  } else {
    const MemStore = MemoryStore(session);
    store = new MemStore({ checkPeriod: sessionTtl });
  }

  return session({
    secret: secret || "dev-secret-local-only",
    name: "__bsai_sid",
    store,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: !isDevMode,
      sameSite: isDevMode ? "lax" : "strict",
      maxAge: sessionTtl,
      path: "/",
    },
  });
}

async function setupSimpleAuth(app: Express) {
  await authStorage.upsertUser({
    id: DEV_USER_ID,
    email: "dev@bharatsolve.local",
    firstName: "Dev",
    lastName: "User",
    profileImageUrl: null,
  });

  app.get("/api/login", async (req, res) => {
    const devUser = {
      claims: {
        sub: DEV_USER_ID,
        email: "dev@bharatsolve.local",
        first_name: "Dev",
        last_name: "User",
      },
      expires_at: Math.floor(Date.now() / 1000) + 7 * 24 * 3600,
    };
    (req as any).login(devUser, () => {
      res.redirect("/");
    });
  });

  app.get("/api/callback", (_req, res) => res.redirect("/"));

  app.get("/api/logout", (req, res) => {
    req.logout(() => res.redirect("/"));
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user: any, cb) => {
    cb(null, { sub: user.claims?.sub, expires_at: user.expires_at });
  });
  passport.deserializeUser((serialized: any, cb) => {
    cb(null, { claims: { sub: serialized.sub }, expires_at: serialized.expires_at });
  });

  logger.info("[auth] Using simple login — /api/login to authenticate");
  await setupSimpleAuth(app);
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated() || !user?.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  return res.status(401).json({ message: "Unauthorized" });
};
