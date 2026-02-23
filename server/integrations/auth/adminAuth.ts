import type { Request, Response } from "express";
import { createHmac, timingSafeEqual } from "crypto";

const ADMIN_USER_IDS = new Set(
  (process.env.ADMIN_USER_IDS || "").split(",").map((id) => id.trim()).filter(Boolean)
);

export function isAdminUser(userId: string): boolean {
  return ADMIN_USER_IDS.has(userId);
}

const ADMIN_COOKIE_NAME = "__bsai_admin";
const ADMIN_COOKIE_MAX_AGE = 24 * 60 * 60; // 24 hours

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";

function getSecret(): string {
  const secret = process.env.SESSION_SECRET || "dev-secret-local-only";
  return secret;
}

function signAdminToken(): string {
  const payload = `admin:${Date.now()}`;
  const secret = getSecret();
  const hmac = createHmac("sha256", secret).update(payload).digest("hex");
  return Buffer.from(`${payload}:${hmac}`).toString("base64url");
}

function verifyAdminToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const lastColon = decoded.lastIndexOf(":");
    if (lastColon <= 0) return false;
    const payload = decoded.substring(0, lastColon);
    const sig = decoded.substring(lastColon + 1);
    if (!payload || !sig) return false;
    const [prefix, ts] = payload.split(":");
    if (prefix !== "admin" || !ts) return false;
    const age = Date.now() - parseInt(ts, 10);
    if (age < 0 || age > ADMIN_COOKIE_MAX_AGE * 1000) return false;
    const secret = getSecret();
    const expected = createHmac("sha256", secret).update(payload).digest("hex");
    const a = Buffer.from(sig, "utf8");
    const b = Buffer.from(expected, "utf8");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function setAdminCookie(res: Response): void {
  const token = signAdminToken();
  const isProd = process.env.NODE_ENV === "production";
  res.cookie(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    maxAge: ADMIN_COOKIE_MAX_AGE * 1000,
    path: "/",
  });
}

export function clearAdminCookie(res: Response): void {
  res.clearCookie(ADMIN_COOKIE_NAME, { path: "/" });
}

export function hasValidAdminSession(req: Request): boolean {
  const token = req.cookies?.[ADMIN_COOKIE_NAME];
  return !!token && verifyAdminToken(token);
}

export function isAdmin(req: Request): boolean {
  const user = req.user as { claims?: { sub?: string } } | undefined;
  const userId = user?.claims?.sub;
  if (userId && isAdminUser(userId)) return true;
  return hasValidAdminSession(req);
}

export function checkAdminCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function getDefaultAdminCredentials(): { username: string; password: string } {
  return { username: ADMIN_USERNAME, password: ADMIN_PASSWORD };
}
