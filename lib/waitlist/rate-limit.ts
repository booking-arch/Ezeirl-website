/**
 * Sliding-window limiter, in-process.
 *
 * Honest limitation: on Vercel each serverless instance keeps its own map, so this is a speed bump
 * that stops naive floods from one client, not a hard global limit. The DB's UNIQUE constraints keep
 * data correct regardless. Upgrade path when real traffic arrives: swap `RateLimiter` for a shared
 * store (Upstash/Vercel KV) — the handler only depends on this interface.
 */
export interface RateLimiter {
  check(key: string): { allowed: boolean; retryAfterSeconds: number };
}

export function createMemoryRateLimiter(opts: { limit: number; windowMs: number; now?: () => number }): RateLimiter {
  const hits = new Map<string, number[]>();
  const now = opts.now ?? Date.now;
  let lastSweep = now();

  return {
    check(key) {
      const t = now();
      const cutoff = t - opts.windowMs;

      // Occasionally drop idle keys so the map cannot grow without bound.
      if (t - lastSweep > opts.windowMs) {
        for (const [k, arr] of hits) if (arr[arr.length - 1] <= cutoff) hits.delete(k);
        lastSweep = t;
      }

      const recent = (hits.get(key) ?? []).filter((x) => x > cutoff);
      if (recent.length >= opts.limit) {
        hits.set(key, recent);
        return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((recent[0] + opts.windowMs - t) / 1000)) };
      }
      recent.push(t);
      hits.set(key, recent);
      return { allowed: true, retryAfterSeconds: 0 };
    },
  };
}
