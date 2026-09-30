import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
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

type SqliteStatement = { run(...args: unknown[]): unknown };
type SqliteDatabase = { exec(sql: string): void; prepare(sql: string): SqliteStatement };

const sqlitePools = new Map<string, IntakeStore>();

/** Local file used by `next start` on this computer when Neon is not configured. Not used on Vercel. */
export function createSqliteIntakeStore(file: string): IntakeStore {
  const cached = sqlitePools.get(file);
  if (cached) return cached;
  mkdirSync(path.dirname(file), { recursive: true });
  let insert: Promise<SqliteStatement> | null = null;
  function statement(): Promise<SqliteStatement> {
    insert ??= (async () => {
      const { DatabaseSync } = await import("node:sqlite");
      const db = new DatabaseSync(file) as unknown as SqliteDatabase;
      db.exec(`
        CREATE TABLE IF NOT EXISTS client_intake_submissions (
          id text PRIMARY KEY,
          email_normalized text NOT NULL,
          full_name text NOT NULL,
          answers text NOT NULL,
          consent_text_version text NOT NULL,
          created_at text NOT NULL
        );
      `);
      return db.prepare(
        `INSERT INTO client_intake_submissions
         (id, email_normalized, full_name, answers, consent_text_version, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
      );
    })();
    return insert;
  }
  const store: IntakeStore = {
    async insert(s) {
      (await statement()).run(
        randomUUID(),
        s.email,
        s.fullName,
        JSON.stringify({ ...s.answers, coachingService: s.service }),
        getCoachingIntake(s.service).consentVersion,
        new Date().toISOString(),
      );
    },
  };
  sqlitePools.set(file, store);
  return store;
}

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
  if (env.VERCEL) return null;
  const file = env.INTAKE_SQLITE_PATH || path.join(process.cwd(), "data", "client-intake.sqlite");
  return createSqliteIntakeStore(file);
}
