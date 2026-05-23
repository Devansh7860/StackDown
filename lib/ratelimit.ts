// lib/ratelimit.ts
// Upstash Redis sliding window rate limiter — 5 audits per IP per hour.

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Only instantiate if env vars are present — allows local dev without Redis
function createRatelimiter() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  return new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, '1 h'),
    analytics: false,
    prefix: 'spendlens:rl',
  });
}

export const ratelimiter = createRatelimiter();

export async function checkRateLimit(identifier: string): Promise<{
  success: boolean;
  remaining: number;
  reset: number;
}> {
  if (!ratelimiter) {
    // No Redis configured — allow all in dev
    return { success: true, remaining: 99, reset: 0 };
  }

  const result = await ratelimiter.limit(identifier);
  return {
    success: result.success,
    remaining: result.remaining,
    reset: result.reset,
  };
}
