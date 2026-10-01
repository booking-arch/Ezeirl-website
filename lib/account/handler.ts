import { audit } from "@/lib/audit";
import { readCookie } from "@/lib/auth/handler";
import type { SessionRecord } from "@/lib/auth/store";
import type { PlanStore } from "@/lib/plans/store";
import type { RateLimiter } from "@/lib/waitlist/rate-limit";

export interface AccountDeps {
  plans: PlanStore | null;
  findSession: (token: string) => Promise<SessionRecord | null>;
  rateLimiter: RateLimiter;
}

// Plan view tokens are 24 random bytes in base64url (32 chars). Anything else cannot be a token, so skip the lookup.
const TOKEN_RE = /^[A-Za-z0-9_-]{20,64}$/;
const NO_STORE = { "Cache-Control": "no-store" };

function json(status: number, body: Record<string, unknown>, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { ...NO_STORE, ...headers } });
}

function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host") ?? req.headers.get("x-forwarded-host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

async function signedIn(req: Request, deps: AccountDeps): Promise<SessionRecord | null> {
  const token = readCookie(req);
  return token ? deps.findSession(token) : null;
}

/** GET /api/account/plans — the signed-in client's own coaching plans. Drafts expose only that they exist. */
export async function handleMyPlans(req: Request, deps: AccountDeps): Promise<Response> {
  const session = await signedIn(req, deps);
  if (!session) return json(401, { ok: false, message: "Log in to see your coaching." });
  if (!deps.plans) return json(503, { ok: false, message: "Coaching is not available on this server." });
  return json(200, { ok: true, plans: await deps.plans.listByAccount(session.accountId) });
}

/** POST /api/account/plans/link {token} — save a plan to the signed-in account using its private link. */
export async function handleLinkPlan(req: Request, deps: AccountDeps): Promise<Response> {
  if (!sameOrigin(req)) return json(403, { ok: false, message: "Request not allowed." });
  const session = await signedIn(req, deps);
  if (!session) return json(401, { ok: false, message: "Log in to save this plan to your account." });
  if (!deps.plans) return json(503, { ok: false, message: "Coaching is not available on this server." });
  if (!(req.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json")) return json(415, { ok: false, message: "Invalid request." });
  const limit = deps.rateLimiter.check(session.accountId);
  if (!limit.allowed) return json(429, { ok: false, message: "Too many attempts. Please try again shortly." }, { "Retry-After": String(limit.retryAfterSeconds) });
  const raw = await req.text();
  if (raw.length > 512) return json(413, { ok: false, message: "Invalid request." });
  let token: unknown;
  try {
    token = (JSON.parse(raw) as { token?: unknown }).token;
  } catch {
    return json(400, { ok: false, message: "Invalid request." });
  }
  if (typeof token !== "string" || !TOKEN_RE.test(token)) return json(404, { ok: false, message: "That plan link isn't valid." });
  const result = await deps.plans.linkToAccount(token, session.accountId);
  if (result === "missing") return json(404, { ok: false, message: "That plan link isn't valid." });
  if (result === "taken") return json(409, { ok: false, message: "That plan is already saved to a different account." });
  if (result === "linked") audit("plan.linked", { account: session.accountId });
  return json(200, { ok: true, status: result });
}
