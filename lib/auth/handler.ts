import { randomUUID } from "node:crypto";
import { hashPassword, verifyPassword, DUMMY_PASSWORD_HASH } from "./password";
import type { AuthStore } from "./store";
import { CONSENT_TEXT_VERSION, parseAuthPayload } from "./validate";
import type { RateLimiter } from "@/lib/waitlist/rate-limit";

export const SESSION_COOKIE = "eze_session";
const SESSION_SECONDS = 60 * 60 * 24 * 14;
const MAX_BODY_BYTES = 4096;
const NO_STORE = { "Cache-Control": "no-store" };
const INVALID_MESSAGE = "That email or password doesn't match.";
const UNAVAILABLE = "We couldn't do that right now. Please try again.";

export interface AuthDeps {
  store: AuthStore | null;
  rateLimiter: RateLimiter;
}

function json(status: number, body: Record<string, unknown>, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { ...NO_STORE, ...headers } });
}

function isSameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host") ?? req.headers.get("x-forwarded-host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function clientKey(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

export function readCookie(req: Request, name = SESSION_COOKIE): string | null {
  const raw = req.headers.get("cookie");
  if (!raw) return null;
  for (const part of raw.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

export function sessionCookieHeader(token: string, req: Request, maxAge = SESSION_SECONDS): string {
  let secure = false;
  try {
    secure = new URL(req.url).protocol === "https:" || req.headers.get("x-forwarded-proto") === "https";
  } catch {
    secure = false;
  }
  const parts = [`${SESSION_COOKIE}=${encodeURIComponent(token)}`, "HttpOnly", "SameSite=Lax", "Path=/", `Max-Age=${maxAge}`];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

async function readJson(req: Request): Promise<{ ok: true; body: unknown } | { ok: false; response: Response }> {
  if (!isSameOrigin(req)) return { ok: false, response: json(403, { ok: false, code: "forbidden", message: "Request not allowed." }) };
  if (!(req.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json")) {
    return { ok: false, response: json(415, { ok: false, code: "bad_request", message: "Invalid request." }) };
  }
  let raw = "";
  try {
    raw = await req.text();
  } catch {
    return { ok: false, response: json(400, { ok: false, code: "bad_request", message: "Invalid request." }) };
  }
  if (raw.length > MAX_BODY_BYTES) return { ok: false, response: json(413, { ok: false, code: "bad_request", message: "Invalid request." }) };
  try {
    return { ok: true, body: JSON.parse(raw) };
  } catch {
    return { ok: false, response: json(400, { ok: false, code: "bad_request", message: "Invalid request." }) };
  }
}

function limited(limiter: RateLimiter, key: string): Response | null {
  const result = limiter.check(key);
  if (result.allowed) return null;
  return json(429, { ok: false, code: "rate_limited", message: "Too many attempts. Please try again shortly." }, { "Retry-After": String(result.retryAfterSeconds) });
}

export async function handleRegister(req: Request, deps: AuthDeps): Promise<Response> {
  const blocked = limited(deps.rateLimiter, `register:${clientKey(req)}`);
  if (blocked) return blocked;
  const parsedBody = await readJson(req);
  if (!parsedBody.ok) return parsedBody.response;
  const parsed = parseAuthPayload(parsedBody.body, "register");
  if (!parsed.ok) return json(422, { ok: false, code: "invalid", errors: parsed.errors });
  if (parsed.honeypot) return json(200, { ok: true });
  if (!deps.store) return json(503, { ok: false, code: "unavailable", message: UNAVAILABLE });

  const passwordHash = await hashPassword(parsed.credentials.password);
  const created = await deps.store.createAccount({
    id: randomUUID(),
    emailNormalized: parsed.credentials.emailNormalized,
    emailDisplay: parsed.credentials.emailDisplay,
    passwordHash,
    consentVersion: CONSENT_TEXT_VERSION,
  });
  if (created === "exists") {
    return json(409, { ok: false, code: "exists", message: "An account with that email already exists. Log in instead." });
  }
  const token = await deps.store.createSession(created.id, new Date(Date.now() + SESSION_SECONDS * 1000));
  return json(201, { ok: true }, { "Set-Cookie": sessionCookieHeader(token, req) });
}

export async function handleLogin(req: Request, deps: AuthDeps): Promise<Response> {
  const blocked = limited(deps.rateLimiter, `login:${clientKey(req)}`);
  if (blocked) return blocked;
  const parsedBody = await readJson(req);
  if (!parsedBody.ok) return parsedBody.response;
  const parsed = parseAuthPayload(parsedBody.body, "login");
  if (!parsed.ok) return json(422, { ok: false, code: "invalid", errors: parsed.errors });
  if (parsed.honeypot) return json(401, { ok: false, code: "invalid", message: INVALID_MESSAGE });
  if (!deps.store) return json(503, { ok: false, code: "unavailable", message: UNAVAILABLE });

  const account = await deps.store.findByEmail(parsed.credentials.emailNormalized);
  const matches = await verifyPassword(parsed.credentials.password, account?.passwordHash ?? DUMMY_PASSWORD_HASH);
  if (!account || !matches) return json(401, { ok: false, code: "invalid", message: INVALID_MESSAGE });
  const token = await deps.store.createSession(account.id, new Date(Date.now() + SESSION_SECONDS * 1000));
  return json(200, { ok: true }, { "Set-Cookie": sessionCookieHeader(token, req) });
}

export async function handleLogout(req: Request, deps: AuthDeps): Promise<Response> {
  if (!isSameOrigin(req)) return json(403, { ok: false, code: "forbidden", message: "Request not allowed." });
  const token = readCookie(req);
  if (token && deps.store) await deps.store.deleteSession(token);
  return json(200, { ok: true }, { "Set-Cookie": sessionCookieHeader("", req, 0) });
}

export async function handleSession(req: Request, deps: AuthDeps): Promise<Response> {
  const token = readCookie(req);
  if (!token || !deps.store) return json(200, { ok: false });
  const session = await deps.store.findSession(token);
  if (!session) return json(200, { ok: false });
  return json(200, { ok: true, email: session.emailDisplay });
}

export async function handlePasswordChange(req: Request, deps: AuthDeps): Promise<Response> {
  const blocked = limited(deps.rateLimiter, `password:${clientKey(req)}`);
  if (blocked) return blocked;
  const token = readCookie(req);
  if (!token || !deps.store) return json(401, { ok: false, code: "unauthorized", message: "Log in again to continue." });
  const session = await deps.store.findSession(token);
  if (!session) return json(401, { ok: false, code: "unauthorized", message: "Log in again to continue." });

  const parsedBody = await readJson(req);
  if (!parsedBody.ok) return parsedBody.response;
  const body = parsedBody.body as { currentPassword?: unknown; newPassword?: unknown };
  const current = typeof body.currentPassword === "string" ? body.currentPassword : "";
  const nextPayload = parseAuthPayload({ email: session.emailNormalized, password: body.newPassword, consent: true }, "login");
  if (!nextPayload.ok) return json(422, { ok: false, code: "invalid", errors: { password: nextPayload.errors.password ?? "Choose a stronger password." } });

  const account = await deps.store.findByEmail(session.emailNormalized);
  if (!account) return json(401, { ok: false, code: "unauthorized", message: "Log in again to continue." });
  const matches = await verifyPassword(current, account.passwordHash);
  if (!matches) return json(401, { ok: false, code: "invalid", message: "The current password doesn't match." });
  await deps.store.updatePassword(account.id, await hashPassword(nextPayload.credentials.password));
  await deps.store.deleteAccountSessions(account.id);
  const nextToken = await deps.store.createSession(account.id, new Date(Date.now() + SESSION_SECONDS * 1000));
  return json(200, { ok: true }, { "Set-Cookie": sessionCookieHeader(nextToken, req) });
}
