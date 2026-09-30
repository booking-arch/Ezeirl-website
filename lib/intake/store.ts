import { getCoachingIntake } from "@/config/coaching";
import type { IntakeSubmission } from "./validate";

export interface IntakeStore {
  insert(s: IntakeSubmission): Promise<void>;
}

export { isIntakeEnabled } from "./config";

/** In-memory store: dev/test only, never used in production. */
export function createMemoryIntakeStore(): IntakeStore & { rows: IntakeSubmission[] } {
  const rows: IntakeSubmission[] = [];
  return {
    rows,
    async insert(s) {
      rows.push(s);
    },
  };
}

let memory: ReturnType<typeof createMemoryIntakeStore> | null = null;

export function resolveIntakeStore(env: NodeJS.ProcessEnv = process.env): IntakeStore | null {
  if (env.DATABASE_URL) {
    // Lazy import keeps the Neon driver out of paths that never need it.
    return {
      async insert(s) {
        const { neon } = await import("@neondatabase/serverless");
        const sql = neon(env.DATABASE_URL as string);
        await sql.query(
          `INSERT INTO client_intake_submissions (email_normalized, full_name, answers, consent_at, consent_text_version)
           VALUES ($1, $2, $3::jsonb, now(), $4)`,
          [s.email, s.fullName, JSON.stringify({ ...s.answers, coachingService: s.service }), getCoachingIntake(s.service).consentVersion],
        );
      },
    };
  }
  if (env.NODE_ENV !== "production") return (memory ??= createMemoryIntakeStore());
  return null;
}
