import geoip from "geoip-lite";
import type { Request } from "express";
import { getClientIp, getCountryFromHeaders } from "./client-ip";

export interface GeoResult {
  country: string | null;
  region: string | null;
  city: string | null;
}

function isLocalIp(ip: string): boolean {
  if (!ip) return true;
  const normalized = ip.replace(/^::ffff:/i, "");
  return (
    normalized === "::1" ||
    normalized === "127.0.0.1" ||
    normalized.startsWith("127.") ||
    normalized === "localhost"
  );
}

export function lookupIp(ip: string | undefined | null, countryFromHeader?: string | null): GeoResult {
  // Prefer country from Cloudflare/Vercel headers when available
  if (countryFromHeader) {
    try {
      const result = ip && !isLocalIp(ip) ? geoip.lookup(ip) : null;
      return {
        country: countryFromHeader,
        region: result?.region ?? null,
        city: result?.city ?? null,
      };
    } catch {
      return { country: countryFromHeader, region: null, city: null };
    }
  }

  if (!ip || isLocalIp(ip)) {
    return { country: null, region: null, city: null };
  }
  try {
    const result = geoip.lookup(ip);
    if (!result) return { country: null, region: null, city: null };
    return {
      country: result.country ?? null,
      region: result.region ?? null,
      city: result.city ?? null,
    };
  } catch {
    return { country: null, region: null, city: null };
  }
}

/** Resolve location from the request (IP + platform headers). */
export function resolveLocationFromRequest(req: Request): GeoResult {
  const ip = getClientIp(req);
  const countryFromHeader = getCountryFromHeaders(req);
  return lookupIp(ip, countryFromHeader);
}
