import { handleIntakeRequest } from "@/lib/intake/handler";
import { isIntakeEnabled, resolveIntakeStore } from "@/lib/intake/store";
import { authDeps } from "@/lib/auth/runtime";
import { resolvePlanStore } from "@/lib/plans/store";
import { createMemoryRateLimiter } from "@/lib/waitlist/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 5 attempts per client per 10 minutes (per instance — see lib/waitlist/rate-limit.ts).
const rateLimiter = createMemoryRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

export async function POST(req: Request) {
  const auth = authDeps();
  return handleIntakeRequest(req, { enabled: isIntakeEnabled(), store: resolveIntakeStore(), plans: resolvePlanStore(), rateLimiter, findSession: async (token) => auth.store?.findSession(token) ?? null });
}
