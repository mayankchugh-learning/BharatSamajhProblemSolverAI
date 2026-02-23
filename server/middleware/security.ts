import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import hpp from "hpp";
import type { Express, Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

const isProduction = process.env.NODE_ENV === "production";

export function setupSecurityMiddleware(app: Express): void {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "blob:", "https:"],
          connectSrc: ["'self'", "ws:", "wss:"],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          upgradeInsecureRequests: isProduction ? [] : null,
        },
      },
      crossOriginEmbedderPolicy: false,
      hsts: isProduction
        ? { maxAge: 31536000, includeSubDomains: true, preload: true }
        : false,
    })
  );

  app.use(
    cors({
      origin: isProduction
        ? (req, callback) => {
            const origin = req.headers.origin;
            if (!origin) return callback(null, true);
            const allowedHost = process.env.ALLOWED_ORIGIN;
            if (allowedHost && origin === allowedHost) return callback(null, true);
            // When ALLOWED_ORIGIN not set, allow same-origin (origin matches request host)
            const expectedOrigin = `${req.protocol}://${req.get("host") || ""}`;
            if (origin === expectedOrigin) return callback(null, true);
            callback(new Error("Not allowed by CORS"));
          }
        : true,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
      maxAge: 600,
    })
  );

  app.use(hpp());

  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { message: "Too many requests, please try again later." },
    skip: (req) => !req.path.startsWith("/api"),
  });
  app.use(globalLimiter);

  app.use("/api/login", rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { message: "Too many login attempts. Please try again later." },
  }));

  app.use("/api/v1/problems", rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { message: "Rate limit reached for AI requests. Please slow down." },
    skip: (req) => req.method === "GET",
  }));

  app.disable("x-powered-by");

  app.use(noSniff);
  app.use(validateContentType);
  app.use(blockSuspiciousPayloads);
}

function noSniff(_req: Request, res: Response, next: NextFunction): void {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-DNS-Prefetch-Control", "off");
  res.setHeader("X-Download-Options", "noopen");
  res.setHeader("X-Permitted-Cross-Domain-Policies", "none");
  next();
}

function validateContentType(req: Request, res: Response, next: NextFunction): void {
  if (
    ["POST", "PUT", "PATCH"].includes(req.method) &&
    req.path.startsWith("/api") &&
    !req.path.startsWith("/api/login") &&
    !req.path.startsWith("/api/callback") &&
    !req.path.startsWith("/api/logout")
  ) {
    const contentType = req.headers["content-type"];
    if (contentType && !contentType.includes("application/json") && !contentType.includes("application/x-www-form-urlencoded") && !contentType.includes("multipart/form-data")) {
      res.status(415).json({ message: "Unsupported Media Type" });
      return;
    }
  }
  next();
}

const SUSPICIOUS_PATTERNS = [
  /(<script[\s>])/i,
  /(javascript\s*:)/i,
  /(\.\.\/(\.\.\/)+)/,
  /(\/etc\/passwd)/i,
  /(<iframe[\s>])/i,
];

function blockSuspiciousPayloads(req: Request, res: Response, next: NextFunction): void {
  if (!req.path.startsWith("/api") || req.method === "GET") {
    return next();
  }

  const body = req.body;
  if (body && typeof body === "object") {
    const bodyStr = JSON.stringify(body);
    for (const pattern of SUSPICIOUS_PATTERNS) {
      if (pattern.test(bodyStr)) {
        logger.warn(
          { ip: req.ip, method: req.method, path: req.path },
          "[security] Blocked suspicious payload"
        );
        res.status(400).json({ message: "Request blocked: potentially malicious content detected." });
        return;
      }
    }
  }

  next();
}

export function sanitizeString(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}
