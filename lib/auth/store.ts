import { isEphemeralHost } from "@/lib/runtime-env";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

export interface AccountRecord {
  id: string;
  emailNormalized: string;
  emailDisplay: string;
  passwordHash: string;
}

export interface SessionRecord {
  emailDisplay: string;
  emailNormalized: string;
}

export interface AuthStore {
  findByEmail(emailNormalized: string): Promise<AccountRecord | null>;
  createAccount(input: AccountRecord & { consentVersion: string }): Promise<AccountRecord | "exists">;
  createSession(accountId: string, expiresAt: Date): Promise<string>;
  findSession(token: string): Promise<SessionRecord | null>;
  deleteSession(token: string): Promise<void>;
  deleteAccountSessions(accountId: string): Promise<void>;
  updatePassword(accountId: string, passwordHash: string): Promise<void>;
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
      return { emailDisplay: account.emailDisplay, emailNormalized: account.emailNormalized };
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
  };
}

type SqliteStatement = {
  get(...args: unknown[]): unknown;
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
        created_at text NOT NULL
      );
      CREATE TABLE IF NOT EXISTS site_sessions (
        id_hash text PRIMARY KEY,
        account_id text NOT NULL,
        expires_at text NOT NULL
      );
    `);
    return {
      findEmail: db.prepare("SELECT id, email_normalized, email_display, password_hash FROM site_accounts WHERE email_normalized = ?"),
      insertAccount: db.prepare(
        "INSERT INTO site_accounts (id, email_normalized, email_display, password_hash, consent_text_version, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      ),
      insertSession: db.prepare("INSERT INTO site_sessions (id_hash, account_id, expires_at) VALUES (?, ?, ?)"),
      findSessionStmt: db.prepare(
        `SELECT a.email_display, a.email_normalized FROM site_sessions s
         JOIN site_accounts a ON a.id = s.account_id WHERE s.id_hash = ? AND s.expires_at > ?`,
      ),
      deleteSessionStmt: db.prepare("DELETE FROM site_sessions WHERE id_hash = ?"),
      deleteAccountSessionsStmt: db.prepare("DELETE FROM site_sessions WHERE account_id = ?"),
      deleteExpired: db.prepare("DELETE FROM site_sessions WHERE expires_at <= ?"),
      updatePasswordStmt: db.prepare("UPDATE site_accounts SET password_hash = ? WHERE id = ?"),
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
      const row = findSessionStmt.get(sessionHash(token), now) as { email_display: string; email_normalized: string } | undefined;
      if (!row) return null;
      return { emailDisplay: row.email_display, emailNormalized: row.email_normalized };
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
        `SELECT a.email_display, a.email_normalized FROM site_sessions s
         JOIN site_accounts a ON a.id = s.account_id
         WHERE s.id_hash = $1 AND s.expires_at > now()`,
        [sessionHash(token)],
      );
      const row = rows[0];
      if (!row) return null;
      return { emailDisplay: row.email_display, emailNormalized: row.email_normalized };
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
