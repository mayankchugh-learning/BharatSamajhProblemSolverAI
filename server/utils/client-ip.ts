import type { Request } from "express";

/**
 * Extracts the real client IP from the request.
 * Checks proxy headers used by Vercel, Cloudflare, Railway, etc.
 */
export function getClientIp(req: Request): string | null {
  const h = req.headers;

  // Cloudflare (most reliable when using CF)
  const cfIp = h["cf-connecting-ip"];
  if (typeof cfIp === "string" && cfIp.trim()) return cfIp.trim();

  // X-Real-IP (Nginx, many proxies)
  const realIp = h["x-real-ip"];
  if (typeof realIp === "string" && realIp.trim()) return realIp.trim();

  // X-Forwarded-For: "client, proxy1, proxy2" — leftmost is the client
  const forwarded = h["x-forwarded-for"];
  if (typeof forwarded === "string") {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  if (Array.isArray(forwarded) && forwarded[0]) {
    const first = String(forwarded[0]).trim();
    if (first) return first;
  }

  // Express req.ip (requires trust proxy)
  if (req.ip) return req.ip;

  // Socket fallback
  const socketIp = req.socket?.remoteAddress;
  if (socketIp) return socketIp;

  return null;
}

/**
 * Gets country from platform headers when available (Cloudflare, Vercel).
 * More reliable than GeoIP when behind these proxies.
 */
export function getCountryFromHeaders(req: Request): string | null {
  const h = req.headers;

  // Cloudflare
  const cfCountry = h["cf-ipcountry"];
  if (typeof cfCountry === "string" && cfCountry.trim() && cfCountry !== "XX") {
    return cfCountry.trim();
  }

  // Vercel
  const vercelCountry = h["x-vercel-ip-country"];
  if (typeof vercelCountry === "string" && vercelCountry.trim()) {
    return vercelCountry.trim();
  }

  return null;
}
