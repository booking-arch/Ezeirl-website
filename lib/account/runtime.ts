import { authDeps } from "@/lib/auth/runtime";
import { resolvePlanStore } from "@/lib/plans/store";
import { createMemoryRateLimiter } from "@/lib/waitlist/rate-limit";
import type { AccountDeps } from "./handler";

// 20 link attempts per account per 10 minutes (per instance — see lib/waitlist/rate-limit.ts).
const rateLimiter = createMemoryRateLimiter({ limit: 20, windowMs: 10 * 60 * 1000 });

export function accountDeps(): AccountDeps {
  const auth = authDeps();
  return { plans: resolvePlanStore(), findSession: async (token) => auth.store?.findSession(token) ?? null, rateLimiter };
}
