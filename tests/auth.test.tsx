import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import LoginPage from "@/app/(universe)/login/page";
import RegisterPage from "@/app/(universe)/register/page";
import { handleLogin, handleLogout, handlePasswordChange, handleRegister, handleSession, SESSION_COOKIE } from "@/lib/auth/handler";
import { createMemoryAuthStore, createSqliteAuthStore } from "@/lib/auth/store";
import { safeNext } from "@/lib/auth/validate";
import { createMemoryRateLimiter } from "@/lib/waitlist/rate-limit";

const EMAIL = "member@ezeirl.com";
const PASSWORD = "train-hard-10";

function deps(store = createMemoryAuthStore()) {
  return { store, rateLimiter: createMemoryRateLimiter({ limit: 8, windowMs: 60_000 }) };
}

function post(pathname: string, body: unknown, cookie?: string) {
  return new Request(`http://ezeirl.test${pathname}`, {
    method: "POST",
    headers: {
      origin: "http://ezeirl.test",
      host: "ezeirl.test",
      "content-type": "application/json",
      ...(cookie ? { cookie: `${SESSION_COOKIE}=${cookie}` } : {}),
    },
    body: JSON.stringify(body),
  });
}

function tokenFrom(response: Response): string {
  const raw = response.headers.get("set-cookie") ?? "";
  const match = raw.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : "";
}

describe("site accounts", () => {
  it("creates an account, logs in, reads the session, and logs out", async () => {
    const bag = deps();
    const created = await handleRegister(post("/api/auth/register", { email: EMAIL, password: PASSWORD, consent: true }), bag);
    expect(created.status).toBe(201);
    const token = tokenFrom(created);
    expect(token.length).toBeGreaterThan(20);

    const session = await handleSession(new Request("http://ezeirl.test/api/auth/session", { headers: { cookie: `${SESSION_COOKIE}=${token}` } }), bag);
    expect(await session.json()).toEqual({ ok: true, email: EMAIL });

    const bad = await handleLogin(post("/api/auth/login", { email: EMAIL, password: "wrong-password-1" }), bag);
    const missing = await handleLogin(post("/api/auth/login", { email: "nobody@ezeirl.com", password: "wrong-password-1" }), bag);
    expect(bad.status).toBe(401);
    expect(await bad.json()).toEqual(await missing.json());

    const again = await handleLogin(post("/api/auth/login", { email: `  ${EMAIL}  `, password: PASSWORD }), bag);
    expect(again.status).toBe(200);
    const nextToken = tokenFrom(again);
    const changed = await handlePasswordChange(
      post("/api/auth/password", { currentPassword: PASSWORD, newPassword: "new-password-20" }, nextToken),
      bag,
    );
    expect(changed.status).toBe(200);
    const oldLogin = await handleLogin(post("/api/auth/login", { email: EMAIL, password: PASSWORD }), bag);
    expect(oldLogin.status).toBe(401);

    const loggedOut = await handleLogout(post("/api/auth/logout", {}, nextToken), bag);
    expect(loggedOut.headers.get("set-cookie")).toContain("Max-Age=0");
    const gone = await handleSession(new Request("http://ezeirl.test/api/auth/session", { headers: { cookie: `${SESSION_COOKIE}=${nextToken}` } }), bag);
    expect(await gone.json()).toEqual({ ok: false });
  });

  it("rejects weak passwords, missing consent, duplicates, and bots", async () => {
    const bag = deps();
    const weak = await handleRegister(post("/api/auth/register", { email: EMAIL, password: "short", consent: true }), bag);
    expect(weak.status).toBe(422);
    const noConsent = await handleRegister(post("/api/auth/register", { email: EMAIL, password: PASSWORD, consent: false }), bag);
    expect(noConsent.status).toBe(422);
    await handleRegister(post("/api/auth/register", { email: EMAIL, password: PASSWORD, consent: true }), bag);
    const duplicate = await handleRegister(post("/api/auth/register", { email: EMAIL, password: PASSWORD, consent: true }), bag);
    expect(duplicate.status).toBe(409);
    const bot = await handleRegister(post("/api/auth/register", { email: "bot@ezeirl.com", password: PASSWORD, consent: true, company: "spam" }), bag);
    expect(bot.status).toBe(200);
    expect(await bag.store.findByEmail("bot@ezeirl.com")).toBeNull();
  });

  it("rate limits repeated login attempts", async () => {
    const bag = deps();
    let status = 0;
    for (let i = 0; i < 9; i += 1) {
      status = (await handleLogin(post("/api/auth/login", { email: EMAIL, password: "wrong-password-1" }), bag)).status;
    }
    expect(status).toBe(429);
  });

  it("refuses to open when no store is configured", async () => {
    const response = await handleLogin(post("/api/auth/login", { email: EMAIL, password: PASSWORD }), {
      store: null,
      rateLimiter: createMemoryRateLimiter({ limit: 5, windowMs: 60_000 }),
    });
    expect(response.status).toBe(503);
  });

  it("keeps an account in sqlite", async () => {
    const dir = mkdtempSync(path.join(tmpdir(), "eze-auth-"));
    const store = createSqliteAuthStore(path.join(dir, "accounts.sqlite"));
    const bag = deps(store);
    expect((await handleRegister(post("/api/auth/register", { email: EMAIL, password: PASSWORD, consent: true }), bag)).status).toBe(201);
    const reopened = createSqliteAuthStore(path.join(dir, "accounts.sqlite"));
    expect((await reopened.findByEmail(EMAIL))?.emailDisplay).toBe(EMAIL);
  });

  it("only allows same-site next paths", () => {
    expect(safeNext("/account")).toBe("/account");
    expect(safeNext("https://evil.example")).toBeNull();
    expect(safeNext("//evil.example")).toBeNull();
  });

  it("rejects control characters that browsers strip, which would turn /\\t/evil into //evil", () => {
    for (const bad of ["/\t/evil.example", "/\n/evil.example", "/\r/evil.example", "/\u0000/evil.example", "/account\u007f"]) {
      expect(safeNext(bad), JSON.stringify(bad)).toBeNull();
    }
    expect(safeNext("/plan/abc_DEF-123")).toBe("/plan/abc_DEF-123");
  });
});

describe("login pages", () => {
  afterEach(() => undefined);
  it("render a real form and do not mention the private app host", () => {
    const login = renderToStaticMarkup(<LoginPage />);
    const register = renderToStaticMarkup(<RegisterPage />);
    expect(login).toContain("LOG IN");
    expect(login).toContain('type="password"');
    expect(register).toContain("CREATE ACCOUNT");
    expect(register).toContain("privacy policy");
    for (const html of [login, register]) {
      expect(html.toLowerCase()).not.toContain("tailscale");
      expect(html).not.toContain("127.0.0.1");
      expect(html).not.toContain("fit-mate");
    }
  });
});
