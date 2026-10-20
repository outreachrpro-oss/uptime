/**
 * Simple in-memory rate limiter for single-instance / development.
 * Production should use Redis-backed limiting (see worker redis client).
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(
  key: string,
  limit = Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: limit - existing.count,
    resetAt: existing.resetAt,
  };
}

export function rateLimitAuth(ip: string, action: string): RateLimitResult {
  return rateLimit(`auth:${action}:${ip}`, 10, 60_000);
}

export function rateLimitContact(ip: string): RateLimitResult {
  return rateLimit(`contact:${ip}`, 5, 60 * 60 * 1000);
}
