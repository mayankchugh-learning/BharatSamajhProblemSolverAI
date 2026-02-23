import { randomUUID } from "crypto";
import type { Request, Response, NextFunction } from "express";
import { child } from "../utils/logger";

declare global {
  namespace Express {
    interface Request {
      id?: string;
      log: ReturnType<typeof child>;
    }
  }
}

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const id = randomUUID();
  req.id = id;
  req.log = child({ requestId: id });

  res.setHeader("X-Request-ID", id);

  const start = Date.now();
  req.log.info(
    { method: req.method, path: req.path, userAgent: req.get("user-agent")?.slice(0, 100) },
    "request start"
  );

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (req.path.startsWith("/api")) {
      req.log.info(
        { method: req.method, path: req.path, statusCode: res.statusCode, duration_ms: duration },
        "request complete"
      );
    }
  });

  next();
}
