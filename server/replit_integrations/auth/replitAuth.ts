import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import MemoryStore from "memorystore";
import { authStorage } from "./storage";
import { logger } from "../../utils/logger";

const isDevMode = process.env.NODE_ENV !== "production";
const isUsingDatabase = !!process.env.DATABASE_URL;

const DEV_USER_ID = "dev-user-001";

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

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

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(claims: any) {
  await authStorage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

async function setupDevAuth(app: Express) {
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

async function setupOidcAuth(app: Express) {
  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };

  const registeredStrategies = new Set<string>();

  const ensureStrategy = (domain: string) => {
    const strategyName = `replitauth:${domain}`;
    if (!registeredStrategies.has(strategyName)) {
      const strategy = new Strategy(
        {
          name: strategyName,
          config,
          scope: "openid email profile offline_access",
          callbackURL: `https://${domain}/api/callback`,
        },
        verify
      );
      passport.use(strategy);
      registeredStrategies.add(strategyName);
    }
  };

  app.get("/api/login", (req, res, next) => {
    ensureStrategy(req.hostname);
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    ensureStrategy(req.hostname);
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
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

  if (isDevMode) {
    logger.info("[auth] Running in DEV mode — auto-login via /api/login");
    await setupDevAuth(app);
  } else {
    await setupOidcAuth(app);
  }
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  if (isDevMode) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
