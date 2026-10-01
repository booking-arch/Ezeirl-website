import { isEphemeralHost } from "@/lib/runtime-env";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

/** client = default for every sign-up; coach = may use the coach desk; admin = coach + may grant/revoke coach access. */
export type AccountRole = "client" | "coach" | "admin";
export const ACCOUNT_ROLES: readonly AccountRole[] = ["client", "coach", "admin"];

export function isAccountRole(value: unknown): value is AccountRole {
  return typeof value === "string" && (ACCOUNT_ROLES as readonly string[]).includes(value);
}

export interface AccountRecord {
  id: string;
  emailNormalized: string;
  emailDisplay: string;
  passwordHash: string;
  /** Absent means "client". Sign-up never sets a role; only setRole() (admin action) does. */
  role?: AccountRole;
}

export interface SessionRecord {
  accountId: string;
  emailDisplay: string;
  emailNormalized: string;
  role: AccountRole;
}

export interface StaffRecord {
  emailDisplay: string;
  emailNormalized: string;
  role: AccountRole;
}

export interface AuthStore {
  findByEmail(emailNormalized: string): Promise<AccountRecord | null>;
  createAccount(input: AccountRecord & { consentVersion: string }): Promise<AccountRecord | "exists">;
  createSession(accountId: string, expiresAt: Date): Promise<string>;
  findSession(token: string): Promise<SessionRecord | null>;
  deleteSession(token: string): Promise<void>;
  deleteAccountSessions(accountId: string): Promise<void>;
  updatePassword(accountId: string, passwordHash: string): Promise<void>;
  /** Returns false when no account has that email. */
  setRole(emailNormalized: string, role: AccountRole): Promise<boolean>;
  /** Every account whose role is not "client". */
  listStaff(): Promise<StaffRecord[]>;
}

export function sessionHash(token: string): string {
  return createHash("sha256").update(token).digest("base64url");
}

export function newSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export function createMemoryAuthStore(): AuthStore {
  const accounts = new Map<string, AccountRecord & { consentVersion: string }>();
  const byEmail = new Map<string, string>();
  const sessions = new Map<string, { accountId: string; expiresAt: number }>();

  return {
    async findByEmail(email) {
      const id = byEmail.get(email);
      return id ? accounts.get(id) ?? null : null;
    },
    async createAccount(input) {
      if (byEmail.has(input.emailNormalized)) return "exists";
      accounts.set(input.id, input);
      byEmail.set(input.emailNormalized, input.id);
      return input;
    },
    async createSession(accountId, expiresAt) {
      const token = newSessionToken();
      sessions.set(sessionHash(token), { accountId, expiresAt: expiresAt.getTime() });
      return token;
    },
    async findSession(token) {
      const key = sessionHash(token);
      const row = sessions.get(key);
      if (!row) return null;
      if (row.expiresAt <= Date.now()) {
        sessions.delete(key);
        return null;
      }
      const account = accounts.get(row.accountId);
      if (!account) return null;
      return { accountId: account.id, emailDisplay: account.emailDisplay, emailNormalized: account.emailNormalized, role: account.role ?? "client" };
    },
    async deleteSession(token) {
      sessions.delete(sessionHash(token));
    },
    async deleteAccountSessions(accountId) {
      for (const [key, row] of sessions) {
        if (row.accountId === accountId) sessions.delete(key);
      }
    },
    async updatePassword(accountId, passwordHash) {
      const account = accounts.get(accountId);
      if (account) account.passwordHash = passwordHash;
    },
    async setRole(email, role) {
      const id = byEmail.get(email);
      const account = id ? accounts.get(id) : undefined;
      if (!account) return false;
      account.role = role;
      return true;
    },
    async listStaff() {
      return [...accounts.values()]
        .filter((a) => (a.role ?? "client") !== "client")
        .map((a) => ({ emailDisplay: a.emailDisplay, emailNormalized: a.emailNormalized, role: a.role ?? "client" }));
    },
  };
}

type SqliteStatement = {
  get(...args: unknown[]): unknown;
  all(...args: unknown[]): unknown[];
  run(...args: unknown[]): unknown;
};

type SqliteDatabase = {
  exec(sql: string): void;
  prepare(sql: string): SqliteStatement;
};

type AccountRow = {
  id: string;
  email_normalized: string;
  email_display: string;
  password_hash: string;
};

type SqliteKit = {
  findEmail: SqliteStatement;
  insertAccount: SqliteStatement;
  insertSession: SqliteStatement;
  findSessionStmt: SqliteStatement;
  deleteSessionStmt: SqliteStatement;
  deleteAccountSessionsStmt: SqliteStatement;
  deleteExpired: SqliteStatement;
  updatePasswordStmt: SqliteStatement;
  setRoleStmt: SqliteStatement;
  listStaffStmt: SqliteStatement;
};

const sqlitePools = new Map<string, AuthStore>();
const sqliteKits = new Map<string, Promise<SqliteKit>>();

function openSqlite(file: string): Promise<SqliteKit> {
  const existing = sqliteKits.get(file);
  if (existing) return existing;
  const opening = (async () => {
    mkdirSync(path.dirname(file), { recursive: true });
    const { DatabaseSync } = await import("node:sqlite");
    const db = new DatabaseSync(file) as unknown as SqliteDatabase;
    db.exec(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS site_accounts (
        id text PRIMARY KEY,
        email_normalized text NOT NULL UNIQUE,
        email_display text NOT NULL,
        password_hash text NOT NULL,
        consent_text_version text NOT NULL,
        created_at text NOT NULL,
        role text NOT NULL DEFAULT 'client'
      );
      CREATE TABLE IF NOT EXISTS site_sessions (
        id_hash text PRIMARY KEY,
        account_id text NOT NULL,
        expires_at text NOT NULL
      );
    `);
    try { db.exec("ALTER TABLE site_accounts ADD COLUMN role text NOT NULL DEFAULT 'client'"); } catch { /* already present */ }
    return {
      findEmail: db.prepare("SELECT id, email_normalized, email_display, password_hash FROM site_accounts WHERE email_normalized = ?"),
      insertAccount: db.prepare(
        "INSERT INTO site_accounts (id, email_normalized, email_display, password_hash, consent_text_version, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      ),
      insertSession: db.prepare("INSERT INTO site_sessions (id_hash, account_id, expires_at) VALUES (?, ?, ?)"),
      findSessionStmt: db.prepare(
        `SELECT a.id, a.email_display, a.email_normalized, a.role FROM site_sessions s
         JOIN site_accounts a ON a.id = s.account_id WHERE s.id_hash = ? AND s.expires_at > ?`,
      ),
      deleteSessionStmt: db.prepare("DELETE FROM site_sessions WHERE id_hash = ?"),
      deleteAccountSessionsStmt: db.prepare("DELETE FROM site_sessions WHERE account_id = ?"),
      deleteExpired: db.prepare("DELETE FROM site_sessions WHERE expires_at <= ?"),
      updatePasswordStmt: db.prepare("UPDATE site_accounts SET password_hash = ? WHERE id = ?"),
      setRoleStmt: db.prepare("UPDATE site_accounts SET role = ? WHERE email_normalized = ?"),
      listStaffStmt: db.prepare("SELECT email_display, email_normalized, role FROM site_accounts WHERE role <> 'client' ORDER BY email_normalized"),
    };
  })();
  opening.catch(() => {
    sqliteKits.delete(file);
  });
  sqliteKits.set(file, opening);
  return opening;
}

export function createSqliteAuthStore(file: string): AuthStore {
  const cached = sqlitePools.get(file);
  if (cached) return cached;

  const store: AuthStore = {
    async findByEmail(email) {
      const { findEmail } = await openSqlite(file);
      const row = findEmail.get(email) as AccountRow | undefined;
      if (!row) return null;
      return {
        id: row.id,
        emailNormalized: row.email_normalized,
        emailDisplay: row.email_display,
        passwordHash: row.password_hash,
      };
    },
    async createAccount(input) {
      const { insertAccount } = await openSqlite(file);
      try {
        insertAccount.run(input.id, input.emailNormalized, input.emailDisplay, input.passwordHash, input.consentVersion, new Date().toISOString());
      } catch (error) {
        if (String(error).toLowerCase().includes("unique")) return "exists";
        throw error;
      }
      return input;
    },
    async createSession(accountId, expiresAt) {
      const { deleteExpired, insertSession } = await openSqlite(file);
      deleteExpired.run(new Date().toISOString());
      const token = newSessionToken();
      insertSession.run(sessionHash(token), accountId, expiresAt.toISOString());
      return token;
    },
    async findSession(token) {
      const { findSessionStmt } = await openSqlite(file);
      const now = new Date().toISOString();
      const row = findSessionStmt.get(sessionHash(token), now) as { id: string; email_display: string; email_normalized: string; role: string } | undefined;
      if (!row) return null;
      return { accountId: row.id, emailDisplay: row.email_display, emailNormalized: row.email_normalized, role: isAccountRole(row.role) ? row.role : "client" };
    },
    async deleteSession(token) {
      const { deleteSessionStmt } = await openSqlite(file);
      deleteSessionStmt.run(sessionHash(token));
    },
    async deleteAccountSessions(accountId) {
      const { deleteAccountSessionsStmt } = await openSqlite(file);
      deleteAccountSessionsStmt.run(accountId);
    },
    async updatePassword(accountId, passwordHash) {
      const { updatePasswordStmt } = await openSqlite(file);
      updatePasswordStmt.run(passwordHash, accountId);
    },
    async setRole(email, role) {
      const { setRoleStmt } = await openSqlite(file);
      const result = setRoleStmt.run(role, email) as { changes?: number | bigint };
      return Number(result.changes ?? 0) > 0;
    },
    async listStaff() {
      const { listStaffStmt } = await openSqlite(file);
      return (listStaffStmt.all() as { email_display: string; email_normalized: string; role: string }[])
        .filter((r) => isAccountRole(r.role))
        .map((r) => ({ emailDisplay: r.email_display, emailNormalized: r.email_normalized, role: r.role as AccountRole }));
    },
  };
  sqlitePools.set(file, store);
  return store;
}

export function createNeonAuthStore(connectionString: string): AuthStore {
  const sql = neon(connectionString);
  return {
    async findByEmail(email) {
      const rows = await sql.query(
        "SELECT id, email_normalized, email_display, password_hash FROM site_accounts WHERE email_normalized = $1",
        [email],
      );
      const row = rows[0];
      if (!row) return null;
      return { id: row.id, emailNormalized: row.email_normalized, emailDisplay: row.email_display, passwordHash: row.password_hash };
    },
    async createAccount(input) {
      try {
        await sql.query(
          `INSERT INTO site_accounts (id, email_normalized, email_display, password_hash, consent_text_version)
           VALUES ($1, $2, $3, $4, $5)`,
          [input.id, input.emailNormalized, input.emailDisplay, input.passwordHash, input.consentVersion],
        );
      } catch (error) {
        const message = String(error).toLowerCase();
        if (message.includes("duplicate") || message.includes("unique") || message.includes("23505")) return "exists";
        throw error;
      }
      return input;
    },
    async createSession(accountId, expiresAt) {
      const token = newSessionToken();
      await sql.query("DELETE FROM site_sessions WHERE expires_at <= now()");
      await sql.query("INSERT INTO site_sessions (id_hash, account_id, expires_at) VALUES ($1, $2, $3)", [
        sessionHash(token),
        accountId,
        expiresAt.toISOString(),
      ]);
      return token;
    },
    async findSession(token) {
      const rows = await sql.query(
        `SELECT a.id, a.email_display, a.email_normalized, a.role FROM site_sessions s
         JOIN site_accounts a ON a.id = s.account_id
         WHERE s.id_hash = $1 AND s.expires_at > now()`,
        [sessionHash(token)],
      );
      const row = rows[0];
      if (!row) return null;
      return { accountId: row.id, emailDisplay: row.email_display, emailNormalized: row.email_normalized, role: isAccountRole(row.role) ? row.role : "client" };
    },
    async deleteSession(token) {
      await sql.query("DELETE FROM site_sessions WHERE id_hash = $1", [sessionHash(token)]);
    },
    async deleteAccountSessions(accountId) {
      await sql.query("DELETE FROM site_sessions WHERE account_id = $1", [accountId]);
    },
    async updatePassword(accountId, passwordHash) {
      await sql.query("UPDATE site_accounts SET password_hash = $1 WHERE id = $2", [passwordHash, accountId]);
    },
    async setRole(email, role) {
      const rows = await sql.query("UPDATE site_accounts SET role = $1 WHERE email_normalized = $2 RETURNING id", [role, email]);
      return rows.length > 0;
    },
    async listStaff() {
      const rows = await sql.query("SELECT email_display, email_normalized, role FROM site_accounts WHERE role <> 'client' ORDER BY email_normalized");
      return rows
        .filter((r) => isAccountRole(r.role))
        .map((r) => ({ emailDisplay: r.email_display, emailNormalized: r.email_normalized, role: r.role as AccountRole }));
    },
  };
}

let memory: AuthStore | null = null;

export function resolveAuthStore(env: NodeJS.ProcessEnv = process.env): AuthStore | null {
  if (env.DATABASE_URL) return createNeonAuthStore(env.DATABASE_URL);
  if (env.NODE_ENV === "production" && isEphemeralHost(env)) return null;
  if (env.NODE_ENV === "test") return (memory ??= createMemoryAuthStore());
  const file = env.AUTH_SQLITE_PATH || path.join(process.cwd(), "data", "site-accounts.sqlite");
  return createSqliteAuthStore(file);
}

export function newAccountId(): string {
  return randomUUID();
}
