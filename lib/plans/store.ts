import { isEphemeralHost } from "@/lib/runtime-env";
import { randomBytes, randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { isCoachingService } from "@/config/coaching";
import { AGREEMENT_FORMS } from "@/config/agreements";
import type { IntakeAnswer, IntakeSubmission } from "@/lib/intake/validate";
import { describeIntake, draftPlan } from "./draft";
import type { AccountPlanSummary, LinkPlanResult, PlanContent, PlanRecord, PlanStatus, PlanSummary } from "./public";

export interface PlanStore {
  /** `accountId` links a NEW plan to the signed-in account that submitted it; an existing plan is never re-linked here. */
  ensureDraft(submission: IntakeSubmission, submissionId: string, accountId?: string | null): Promise<PlanRecord>;
  listByAccount(accountId: string): Promise<AccountPlanSummary[]>;
  /** Claim a plan by its private link. The first account to claim wins; the same account claiming again is a no-op. */
  linkToAccount(viewToken: string, accountId: string): Promise<LinkPlanResult>;
  list(): Promise<PlanSummary[]>;
  get(id: string): Promise<PlanRecord | null>;
  getByToken(token: string): Promise<PlanRecord | null>;
  save(id: string, content: PlanContent, status: PlanStatus, agreementSelection?: string[]): Promise<PlanRecord | null>;
}

type StoredPlan = PlanRecord;

function newToken(): string {
  return randomBytes(24).toString("base64url");
}

function buildRecord(submission: IntakeSubmission, submissionId: string, existing?: StoredPlan, accountId: string | null = null): StoredPlan {
  const draft = draftPlan(submission);
  const now = new Date().toISOString();
  if (existing) return { ...existing, intake: describeIntake(submission), needsReview: draft.needsReview };
  return {
    id: randomUUID(),
    submissionId,
    viewToken: newToken(),
    status: "draft",
    service: submission.service,
    clientName: submission.fullName,
    email: submission.email,
    needsReview: draft.needsReview,
    intake: describeIntake(submission),
    goals: draft.goals,
    idealOutcome: draft.idealOutcome,
    fitnessPlan: draft.fitnessPlan,
    meals: draft.meals,
    schedule: draft.schedule,
    coachNotes: draft.coachNotes,
    createdAt: now,
    updatedAt: now,
    publishedAt: null,
    agreementSelection: [],
    accountId,
  };
}

function toAccountSummary(plan: StoredPlan): AccountPlanSummary {
  return { viewToken: plan.viewToken, service: plan.service, status: plan.status, createdAt: plan.createdAt, publishedAt: plan.publishedAt };
}

export function createMemoryPlanStore(): PlanStore {
  const plans = new Map<string, StoredPlan>();
  return {
    async ensureDraft(submission, submissionId, accountId = null) {
      const found = [...plans.values()].find((plan) => plan.submissionId === submissionId);
      if (found) return buildRecord(submission, submissionId, found);
      const created = buildRecord(submission, submissionId, undefined, accountId);
      plans.set(created.id, created);
      return created;
    },
    async listByAccount(accountId) {
      return [...plans.values()].filter((p) => p.accountId === accountId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(toAccountSummary);
    },
    async linkToAccount(viewToken, accountId) {
      const plan = [...plans.values()].find((p) => p.viewToken === viewToken);
      if (!plan) return "missing";
      if (plan.accountId === accountId) return "already";
      if (plan.accountId) return "taken";
      plan.accountId = accountId;
      return "linked";
    },
    async list() {
      return [...plans.values()]
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .map(summarize);
    },
    async get(id) {
      return plans.get(id) ?? null;
    },
    async getByToken(token) {
      return [...plans.values()].find((plan) => plan.viewToken === token) ?? null;
    },
    async save(id, content, status, agreementSelection) {
      const current = plans.get(id);
      if (!current) return null;
      const now = new Date().toISOString();
      const next: StoredPlan = {
        ...current,
        ...content,
        status,
        updatedAt: now,
        publishedAt: status === "published" ? current.publishedAt ?? now : null,
        agreementSelection: agreementSelection ?? current.agreementSelection,
      };
      plans.set(id, next);
      return next;
    },
  };
}

function summarize(plan: StoredPlan): PlanSummary {
  return {
    id: plan.id,
    clientName: plan.clientName,
    email: plan.email,
    service: plan.service,
    status: plan.status,
    needsReview: plan.needsReview,
    updatedAt: plan.updatedAt,
    viewToken: plan.viewToken,
    linked: Boolean(plan.accountId),
  };
}

type SqliteStatement = {
  get(...args: unknown[]): unknown;
  all(...args: unknown[]): unknown[];
  run(...args: unknown[]): unknown;
};
type SqliteDatabase = { exec(sql: string): void; prepare(sql: string): SqliteStatement };

type PlanRow = {
  id: string;
  submission_id: string;
  view_token: string;
  status: string;
  service: string;
  client_name: string;
  email: string;
  goals: string;
  ideal_outcome: string;
  fitness_plan: string;
  meals: string;
  schedule: string;
  coach_notes: string;
  intake_json: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  agreement_selection: string | string[] | null;
  account_id: string | null;
};

function parseAgreementSelection(raw: string | string[] | null | undefined): string[] {
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) as unknown : raw;
    if (!Array.isArray(parsed)) return [];
    const allowed = new Set(AGREEMENT_FORMS.map((form) => form.id));
    return [...new Set(parsed.filter((id): id is string => typeof id === "string" && allowed.has(id)))];
  } catch {
    return [];
  }
}

function snapshot(submission: IntakeSubmission): string {
  return JSON.stringify({ service: submission.service, email: submission.email, fullName: submission.fullName, answers: submission.answers });
}

function fromSnapshot(raw: string, fallback: Pick<PlanRow, "service" | "email" | "client_name">): IntakeSubmission | null {
  try {
    const parsed = JSON.parse(raw) as { service?: unknown; email?: unknown; fullName?: unknown; answers?: unknown };
    if (!isCoachingService(parsed.service) || typeof parsed.email !== "string" || typeof parsed.fullName !== "string" || !parsed.answers || typeof parsed.answers !== "object") {
      return null;
    }
    return { service: parsed.service, email: parsed.email, fullName: parsed.fullName, answers: parsed.answers as Record<string, IntakeAnswer> };
  } catch {
    if (!isCoachingService(fallback.service)) return null;
    return { service: fallback.service, email: fallback.email, fullName: fallback.client_name, answers: {} };
  }
}

function rowToRecord(row: PlanRow): PlanRecord | null {
  if (!isCoachingService(row.service) || (row.status !== "draft" && row.status !== "published")) return null;
  const submission = fromSnapshot(row.intake_json, row);
  if (!submission) return null;
  const draft = draftPlan(submission);
  return {
    id: row.id,
    submissionId: row.submission_id,
    viewToken: row.view_token,
    status: row.status,
    service: row.service,
    clientName: row.client_name,
    email: row.email,
    needsReview: draft.needsReview,
    intake: describeIntake(submission),
    goals: row.goals,
    idealOutcome: row.ideal_outcome,
    fitnessPlan: row.fitness_plan,
    meals: row.meals,
    schedule: row.schedule,
    coachNotes: row.coach_notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at,
    agreementSelection: parseAgreementSelection(row.agreement_selection),
    accountId: row.account_id ?? null,
  };
}

const PLAN_COLUMNS = `id, submission_id, view_token, status, service, client_name, email, goals, ideal_outcome, fitness_plan, meals, schedule, coach_notes, intake_json, created_at, updated_at, published_at, agreement_selection, account_id`;

const sqlitePools = new Map<string, PlanStore>();

export function createSqlitePlanStore(file: string): PlanStore {
  const cached = sqlitePools.get(file);
  if (cached) return cached;
  mkdirSync(path.dirname(file), { recursive: true });
  let opening: Promise<{ db: SqliteDatabase; insert: SqliteStatement; selectId: SqliteStatement; selectToken: SqliteStatement; selectSubmission: SqliteStatement; list: SqliteStatement; update: SqliteStatement; byAccount: SqliteStatement; claim: SqliteStatement }> | null = null;
  function api() {
    opening ??= (async () => {
      const { DatabaseSync } = await import("node:sqlite");
      const db = new DatabaseSync(file) as unknown as SqliteDatabase;
      db.exec(`
        CREATE TABLE IF NOT EXISTS client_plans (
          id text PRIMARY KEY,
          submission_id text NOT NULL UNIQUE,
          view_token text NOT NULL UNIQUE,
          status text NOT NULL,
          service text NOT NULL,
          client_name text NOT NULL,
          email text NOT NULL,
          goals text NOT NULL,
          ideal_outcome text NOT NULL,
          fitness_plan text NOT NULL,
          meals text NOT NULL,
          schedule text NOT NULL,
          coach_notes text NOT NULL,
          intake_json text NOT NULL,
          created_at text NOT NULL,
          updated_at text NOT NULL,
          published_at text,
          agreement_selection text NOT NULL DEFAULT '[]',
          account_id text
        );
      `);
      try { db.exec("ALTER TABLE client_plans ADD COLUMN agreement_selection text NOT NULL DEFAULT '[]'"); } catch { /* already present */ }
      try { db.exec("ALTER TABLE client_plans ADD COLUMN account_id text"); } catch { /* already present */ }
      return {
        db,
        insert: db.prepare(`INSERT INTO client_plans (id, submission_id, view_token, status, service, client_name, email, goals, ideal_outcome, fitness_plan, meals, schedule, coach_notes, intake_json, created_at, updated_at, published_at, account_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`),
        selectId: db.prepare(`SELECT ${PLAN_COLUMNS} FROM client_plans WHERE id = ?`),
        selectToken: db.prepare(`SELECT ${PLAN_COLUMNS} FROM client_plans WHERE view_token = ?`),
        selectSubmission: db.prepare(`SELECT ${PLAN_COLUMNS} FROM client_plans WHERE submission_id = ?`),
        list: db.prepare(`SELECT ${PLAN_COLUMNS} FROM client_plans ORDER BY updated_at DESC`),
        byAccount: db.prepare(`SELECT ${PLAN_COLUMNS} FROM client_plans WHERE account_id = ? ORDER BY created_at DESC`),
        claim: db.prepare(`UPDATE client_plans SET account_id = ? WHERE view_token = ? AND account_id IS NULL`),
        update: db.prepare(`UPDATE client_plans SET status = ?, goals = ?, ideal_outcome = ?, fitness_plan = ?, meals = ?, schedule = ?, coach_notes = ?, updated_at = ?, published_at = ?, agreement_selection = ? WHERE id = ?`),
      };
    })();
    return opening;
  }

  async function read(statement: SqliteStatement, ...args: unknown[]): Promise<PlanRecord | null> {
    const row = statement.get(...args) as PlanRow | undefined;
    if (!row) return null;
    return rowToRecord(row);
  }

  const store: PlanStore = {
    async ensureDraft(submission, submissionId, accountId = null) {
      const { insert, selectSubmission } = await api();
      const existing = await read(selectSubmission, submissionId);
      if (existing) return { ...existing, intake: describeIntake(submission), needsReview: draftPlan(submission).needsReview };
      const created = buildRecord(submission, submissionId, undefined, accountId);
      try {
        insert.run(
          created.id, created.submissionId, created.viewToken, created.status, created.service, created.clientName, created.email,
          created.goals, created.idealOutcome, created.fitnessPlan, created.meals, created.schedule, created.coachNotes,
          snapshot(submission), created.createdAt, created.updatedAt, created.publishedAt, created.accountId,
        );
      } catch (error) {
        if (String(error).toLowerCase().includes("unique")) {
          const raced = await read(selectSubmission, submissionId);
          if (raced) return raced;
        }
        throw error;
      }
      return created;
    },
    async listByAccount(accountId) {
      const { byAccount } = await api();
      return (byAccount.all(accountId) as PlanRow[]).map(rowToRecord).filter((p): p is PlanRecord => Boolean(p)).map(toAccountSummary);
    },
    async linkToAccount(viewToken, accountId) {
      const { selectToken, claim } = await api();
      const plan = await read(selectToken, viewToken);
      if (!plan) return "missing";
      if (plan.accountId === accountId) return "already";
      if (plan.accountId) return "taken";
      const result = claim.run(accountId, viewToken) as { changes?: number | bigint };
      if (Number(result.changes ?? 0) > 0) return "linked";
      return (await read(selectToken, viewToken))?.accountId === accountId ? "already" : "taken"; // lost a race
    },
    async list() {
      const { db, list } = await api();
      try {
        const submissions = db.prepare("SELECT id, email_normalized, full_name, answers FROM client_intake_submissions").all() as {
          id: string;
          email_normalized: string;
          full_name: string;
          answers: string;
        }[];
        for (const row of submissions) {
          const submission = submissionFromIntake(row.answers, row.email_normalized, row.full_name);
          if (submission) await store.ensureDraft(submission, row.id);
        }
      } catch {
        // The questionnaire table is created on the first submission.
      }
      return (list.all() as PlanRow[]).map(rowToRecord).filter((plan): plan is PlanRecord => Boolean(plan)).map(summarize);
    },
    async get(id) {
      const { selectId } = await api();
      return read(selectId, id);
    },
    async getByToken(token) {
      const { selectToken } = await api();
      return read(selectToken, token);
    },
    async save(id, content, status, agreementSelection) {
      const current = await store.get(id);
      if (!current) return null;
      const now = new Date().toISOString();
      const publishedAt = status === "published" ? current.publishedAt ?? now : null;
      const { update } = await api();
      update.run(status, content.goals, content.idealOutcome, content.fitnessPlan, content.meals, content.schedule, content.coachNotes, now, publishedAt, JSON.stringify(agreementSelection ?? current.agreementSelection), id);
      return store.get(id);
    },
  };
  sqlitePools.set(file, store);
  return store;
}

function submissionFromIntake(raw: string, email: string, fullName: string): IntakeSubmission | null {
  try {
    const parsed = JSON.parse(raw) as { coachingService?: unknown; answers?: unknown } & Record<string, unknown>;
    const service = parsed.coachingService;
    if (!isCoachingService(service)) return null;
    const answers = { ...parsed };
    delete answers.coachingService;
    return { service, email, fullName, answers: answers as Record<string, IntakeAnswer> };
  } catch {
    return null;
  }
}

export function createNeonPlanStore(connectionString: string): PlanStore {
  let client: Promise<{ query: (text: string, params?: unknown[]) => Promise<PlanRow[]> }> | null = null;
  function sql() {
    client ??= import("@neondatabase/serverless").then(({ neon }) => neon(connectionString) as unknown as { query: (text: string, params?: unknown[]) => Promise<PlanRow[]> });
    return client;
  }
  async function one(text: string, params: unknown[] = []): Promise<PlanRecord | null> {
    const rows = await (await sql()).query(text, params);
    return rows[0] ? rowToRecord(rows[0]) : null;
  }
  return {
    async ensureDraft(submission, submissionId, accountId = null) {
      const existing = await one(`SELECT ${PLAN_COLUMNS} FROM client_plans WHERE submission_id = $1`, [submissionId]);
      if (existing) return { ...existing, intake: describeIntake(submission), needsReview: draftPlan(submission).needsReview };
      const created = buildRecord(submission, submissionId, undefined, accountId);
      try {
        await (await sql()).query(
          `INSERT INTO client_plans (id, submission_id, view_token, status, service, client_name, email, goals, ideal_outcome, fitness_plan, meals, schedule, coach_notes, intake_json, created_at, updated_at, account_id)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14::jsonb,$15::timestamptz,$16::timestamptz,$17::uuid)`,
          [created.id, created.submissionId, created.viewToken, created.status, created.service, created.clientName, created.email, created.goals, created.idealOutcome, created.fitnessPlan, created.meals, created.schedule, created.coachNotes, snapshot(submission), created.createdAt, created.updatedAt, created.accountId],
        );
      } catch (error) {
        const message = String(error).toLowerCase();
        if (message.includes("duplicate") || message.includes("unique") || message.includes("23505")) {
          const raced = await one(`SELECT ${PLAN_COLUMNS} FROM client_plans WHERE submission_id = $1`, [submissionId]);
          if (raced) return raced;
        }
        throw error;
      }
      return created;
    },
    async listByAccount(accountId) {
      const rows = await (await sql()).query(`SELECT ${PLAN_COLUMNS} FROM client_plans WHERE account_id = $1::uuid ORDER BY created_at DESC`, [accountId]);
      return rows.map(rowToRecord).filter((p): p is PlanRecord => Boolean(p)).map(toAccountSummary);
    },
    async linkToAccount(viewToken, accountId) {
      const plan = await one(`SELECT ${PLAN_COLUMNS} FROM client_plans WHERE view_token = $1`, [viewToken]);
      if (!plan) return "missing";
      if (plan.accountId === accountId) return "already";
      if (plan.accountId) return "taken";
      const claimed = await (await sql()).query(`UPDATE client_plans SET account_id = $1::uuid WHERE view_token = $2 AND account_id IS NULL RETURNING id`, [accountId, viewToken]);
      if (claimed.length > 0) return "linked";
      return (await one(`SELECT ${PLAN_COLUMNS} FROM client_plans WHERE view_token = $1`, [viewToken]))?.accountId === accountId ? "already" : "taken"; // lost a race
    },
    async list() {
      const db = await sql();
      const submissions = await db.query("SELECT id, email_normalized, full_name, answers FROM client_intake_submissions") as unknown as {
        id: string;
        email_normalized: string;
        full_name: string;
        answers: unknown;
      }[];
      for (const row of submissions) {
        const answers = typeof row.answers === "string" ? row.answers : JSON.stringify(row.answers ?? {});
        const submission = submissionFromIntake(answers, row.email_normalized, row.full_name);
        if (submission) await this.ensureDraft(submission, row.id);
      }
      const rows = await db.query(`SELECT ${PLAN_COLUMNS} FROM client_plans ORDER BY updated_at DESC`);
      return rows.map(rowToRecord).filter((plan): plan is PlanRecord => Boolean(plan)).map(summarize);
    },
    async get(id) {
      return one(`SELECT ${PLAN_COLUMNS} FROM client_plans WHERE id = $1`, [id]);
    },
    async getByToken(token) {
      return one(`SELECT ${PLAN_COLUMNS} FROM client_plans WHERE view_token = $1`, [token]);
    },
    async save(id, content, status, agreementSelection) {
      const current = await this.get(id);
      if (!current) return null;
      const now = new Date().toISOString();
      const publishedAt = status === "published" ? current.publishedAt ?? now : null;
      await (await sql()).query(
        `UPDATE client_plans SET status = $1, goals = $2, ideal_outcome = $3, fitness_plan = $4, meals = $5, schedule = $6, coach_notes = $7, updated_at = $8::timestamptz, published_at = $9::timestamptz, agreement_selection = $10::jsonb WHERE id = $11`,
        [status, content.goals, content.idealOutcome, content.fitnessPlan, content.meals, content.schedule, content.coachNotes, now, publishedAt, JSON.stringify(agreementSelection ?? current.agreementSelection), id],
      );
      return this.get(id);
    },
  };
}

let memory: PlanStore | null = null;

export function resolvePlanStore(env: NodeJS.ProcessEnv = process.env): PlanStore | null {
  if (env.DATABASE_URL) return createNeonPlanStore(env.DATABASE_URL);
  if (env.NODE_ENV !== "production") return (memory ??= createMemoryPlanStore());
  if (isEphemeralHost(env)) return null;
  const file = env.INTAKE_SQLITE_PATH || path.join(process.cwd(), "data", "client-intake.sqlite");
  return createSqlitePlanStore(file);
}
