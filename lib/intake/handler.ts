import type { RateLimiter } from "@/lib/waitlist/rate-limit";
import { readCookie } from "@/lib/auth/handler";
import type { SessionRecord } from "@/lib/auth/store";
import type { PlanStore } from "@/lib/plans/store";
import type { IntakeStore } from "./store";
import { parseIntakePayload } from "./validate";

export interface IntakeDeps {
  enabled: boolean;
  store: IntakeStore | null;
  rateLimiter: RateLimiter;
  plans?: PlanStore | null;
  /** When given, a submission made while signed in is linked to that account (never inferred from the email). */
  findSession?: (token: string) => Promise<SessionRecord | null>;
}

const MAX_BODY_BYTES = 40_000;
const NO_STORE = { "Cache-Control": "no-store" };

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

/**
 * POST /api/intake. Same shape as the waitlist handler: legal gate first, then cheap rejections,
 * then the store. Health answers are never logged — only the error class on a store failure.
 */
export async function handleIntakeRequest(req: Request, deps: IntakeDeps): Promise<Response> {
  if (!deps.enabled) return json(503, { ok: false, code: "disabled", message: "The intake form is not open yet." });
  if (!isSameOrigin(req)) return json(403, { ok: false, code: "forbidden", message: "Request not allowed." });
  if (!(req.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json")) {
    return json(415, { ok: false, code: "bad_request", message: "Invalid request." });
  }

  const limit = deps.rateLimiter.check(clientKey(req));
  if (!limit.allowed) {
    return json(429, { ok: false, code: "rate_limited", message: "Too many attempts. Please try again shortly." }, { "Retry-After": String(limit.retryAfterSeconds) });
  }

  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return json(400, { ok: false, code: "bad_request", message: "Invalid request." });
  }
  if (raw.length > MAX_BODY_BYTES) return json(413, { ok: false, code: "bad_request", message: "Invalid request." });

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { ok: false, code: "bad_request", message: "Invalid request." });
  }

  const parsed = parseIntakePayload(body);
  if (!parsed.ok) return json(422, { ok: false, code: "invalid", errors: parsed.errors });
  if (parsed.honeypot) return json(200, { ok: true });

  if (!deps.store) return json(503, { ok: false, code: "unavailable", message: "The form is temporarily unavailable." });

  let submissionId = "";
  try {
    submissionId = await deps.store.insert(parsed.data);
  } catch (err) {
    console.error("[intake] store failure:", err instanceof Error ? err.name : "unknown");
    return json(500, { ok: false, code: "server_error", message: "Something went wrong. Please try again." });
  }
  if (deps.plans && submissionId) {
    try {
      const token = deps.findSession ? readCookie(req) : null;
      const session = token && deps.findSession ? await deps.findSession(token).catch(() => null) : null;
      await deps.plans.ensureDraft(parsed.data, submissionId, session?.accountId ?? null);
    } catch (err) {
      console.error("[intake] plan draft failure:", err instanceof Error ? err.name : "unknown");
    }
  }
  return json(200, { ok: true });
}
