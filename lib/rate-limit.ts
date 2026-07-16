/**
 * lib/rate-limit.ts
 * ---------------------------------------------------------------
 * Server-side rate limiter (token bucket), for use inside Route
 * Handlers (app/api/*). Keyed by whatever string you give it —
 * usually an IP address or a session id.
 *
 * This is in-memory, which is fine for a single-instance deploy
 * (e.g. one Vercel serverless function warm instance) but will NOT
 * share state across multiple server instances/regions. If this
 * app ever scales to multiple instances, swap the Map below for a
 * shared store (Upstash Redis is the standard pairing with Vercel).
 * That swap is isolated to this one file — nothing else in the app
 * needs to know where the bucket state lives.
 */

import { IS_PROD } from "./env";

interface Bucket {
  tokens: number;
  lastRefill: number;
}

const buckets = new Map<string, Bucket>();

interface RateLimitOptions {
  /** Max requests allowed per window. */
  limit: number;
  /** Window size in milliseconds. */
  windowMs: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  retryAfterMs: number;
}

export function checkRateLimit(
  key: string,
  { limit, windowMs }: RateLimitOptions
): RateLimitResult {
  // Dev mode bypasses rate limiting entirely, per the project's
  // dev/prod mode rule — see lib/env.ts.
  if (!IS_PROD) {
    return { success: true, remaining: limit, retryAfterMs: 0 };
  }

  const now = Date.now();
  const refillRate = limit / windowMs; // tokens per ms

  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = { tokens: limit, lastRefill: now };
    buckets.set(key, bucket);
  }

  const elapsed = now - bucket.lastRefill;
  bucket.tokens = Math.min(limit, bucket.tokens + elapsed * refillRate);
  bucket.lastRefill = now;

  if (bucket.tokens < 1) {
    const retryAfterMs = Math.ceil((1 - bucket.tokens) / refillRate);
    return { success: false, remaining: 0, retryAfterMs };
  }

  bucket.tokens -= 1;
  return {
    success: true,
    remaining: Math.floor(bucket.tokens),
    retryAfterMs: 0,
  };
}

/**
 * Call this periodically (or opportunistically on each request) to
 * drop buckets that haven't been touched in a while — otherwise this
 * Map grows forever for a long-running server process. This is the
 * "clean memory after use" rule applied to the rate limiter.
 */
export function pruneStaleBuckets(maxAgeMs = 30 * 60 * 1000) {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (now - bucket.lastRefill > maxAgeMs) {
      buckets.delete(key);
    }
  }
}
