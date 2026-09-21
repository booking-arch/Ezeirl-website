import type { RateLimiter } from "./rate-limit";
import type { WaitlistStore } from "./store";
import { parseWaitlistPayload } from "./validate";

export interface WaitlistDeps {
  enabled: boolean;
  store: WaitlistStore | null;
  rateLimiter: RateLimiter;
}

const MAX_BODY_BYTES = 4096;
const NO_STORE = { "Cache-Control": "no-store" };

function json(status: number, body: Record<string, unknown>, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { ...NO_STORE, ...headers } });
}

/** Same-origin check: browsers always send Origin on cross-site and fetch POSTs. */
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
  // Vercel sets x-forwarded-for; the first hop is the client. Fall back to a shared bucket.
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

/**
 * POST /api/waitlist. Order matters: legal gate first, then cheap rejections, then the store.
 * Responses never reveal whether an email was already on a list (no account-enumeration oracle):
 * a new signup and a repeat signup both return the same success body.
 */
export async function handleWaitlistRequest(req: Request, deps: WaitlistDeps): Promise<Response> {
  // Legal gate: while WAITLIST_ENABLED is not "true", nothing is parsed, stored, or logged.
  if (!deps.enabled) {
    return json(503, { ok: false, code: "disabled", message: "Sign-ups are not open yet." });
  }

  if (!isSameOrigin(req)) return json(403, { ok: false, code: "forbidden", message: "Request not allowed." });

  if (!(req.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json")) {
    return json(415, { ok: false, code: "bad_request", message: "Invalid request." });
  }

  const limit = deps.rateLimiter.check(clientKey(req));
  if (!limit.allowed) {
    return json(
      429,
      { ok: false, code: "rate_limited", message: "Too many attempts. Please try again shortly." },
      { "Retry-After": String(limit.retryAfterSeconds) },
    );
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

  const parsed = parseWaitlistPayload(body);
  if (!parsed.ok) return json(422, { ok: false, code: "invalid", errors: parsed.errors });
  if (parsed.honeypot) return json(200, { ok: true }); // bot: pretend success, store nothing

  if (!deps.store) return json(503, { ok: false, code: "unavailable", message: "Sign-ups are temporarily unavailable." });

  try {
    await deps.store.upsert(parsed.data);
  } catch (err) {
    // Log the error class only — never the email or payload.
    console.error("[waitlist] store failure:", err instanceof Error ? err.name : "unknown");
    return json(500, { ok: false, code: "server_error", message: "Something went wrong. Please try again." });
  }

  return json(200, { ok: true });
}
