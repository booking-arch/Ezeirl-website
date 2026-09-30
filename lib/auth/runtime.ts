import { createMemoryRateLimiter } from "@/lib/waitlist/rate-limit";
import { resolveAuthStore } from "./store";
import type { AuthDeps } from "./handler";

const rateLimiter = createMemoryRateLimiter({ limit: 8, windowMs: 10 * 60 * 1000 });

export function authDeps(): AuthDeps {
  return { store: resolveAuthStore(), rateLimiter };
}
