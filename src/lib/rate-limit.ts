import "server-only";

import { headers } from "next/headers";

/**
 * Simple in-memory sliding-window rate limiter.
 *
 * Good enough for a single-instance dev/preview deployment. For production
 * behind multiple instances, swap the Map for a shared store (Upstash/Redis).
 */

type Hit = { count: number; resetAt: number };

const buckets = new Map<string, Hit>();

export type RateLimitResult = { ok: boolean; retryAfterSec: number };

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const hit = buckets.get(key);

  if (!hit || hit.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }

  if (hit.count >= limit) {
    return { ok: false, retryAfterSec: Math.ceil((hit.resetAt - now) / 1000) };
  }

  hit.count += 1;
  return { ok: true, retryAfterSec: 0 };
}

/** Best-effort client IP from proxy headers; falls back to "local". */
export async function clientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return h.get("x-real-ip") ?? "local";
}
