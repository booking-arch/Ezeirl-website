import { handleWaitlistRequest } from "@/lib/waitlist/handler";
import { createMemoryRateLimiter } from "@/lib/waitlist/rate-limit";
import { isWaitlistEnabled, resolveWaitlistStore } from "@/lib/waitlist/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 5 attempts per client per 10 minutes (per instance — see lib/waitlist/rate-limit.ts).
const rateLimiter = createMemoryRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

export async function POST(req: Request) {
  return handleWaitlistRequest(req, {
    enabled: isWaitlistEnabled(),
    store: resolveWaitlistStore(),
    rateLimiter,
  });
}
