import { createMemoryStore } from "./memory-store";
import { createNeonStore } from "./neon-store";
import type { WaitlistSignup } from "./validate";

export interface WaitlistStore {
  /**
   * Idempotently record a signup: one contact per normalized email, one interest per
   * (contact, interest). Re-submitting never duplicates, never overwrites an existing first name,
   * never revives an unsubscribed interest.
   */
  upsert(signup: WaitlistSignup): Promise<void>;
}

export { isWaitlistEnabled } from "./config";

let memory: WaitlistStore | null = null;

/**
 * Resolve the storage backend from the environment. Returns `null` when nothing is configured
 * (the handler then answers 503). The in-memory store is dev-only and is never used in production.
 */
export function resolveWaitlistStore(env: NodeJS.ProcessEnv = process.env): WaitlistStore | null {
  if (env.DATABASE_URL) return createNeonStore(env.DATABASE_URL);
  if (env.NODE_ENV !== "production") return (memory ??= createMemoryStore());
  return null;
}
