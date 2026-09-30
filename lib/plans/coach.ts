import { readCookie } from "@/lib/auth/handler";
import type { SessionRecord } from "@/lib/auth/store";
import { normalizeEmail } from "@/lib/waitlist/normalize";
import { AGREEMENT_FORMS } from "@/config/agreements";
import type { PlanContent, PlanStatus } from "./public";
import type { PlanStore } from "./store";

const MAX_BODY = 48_000;
const LIMITS: Record<keyof PlanContent, number> = {
  goals: 6000,
  idealOutcome: 4000,
  fitnessPlan: 8000,
  meals: 8000,
  schedule: 6000,
  coachNotes: 8000,
};
const ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export interface CoachDeps {
  plans: PlanStore | null;
  findSession: (token: string) => Promise<SessionRecord | null>;
  coachEmails: string[];
}

function json(status: number, body: Record<string, unknown>) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export function coachEmailList(env: NodeJS.ProcessEnv = process.env): string[] {
  return (env.COACH_EMAILS ?? "")
    .split(",")
    .map((email) => normalizeEmail(email))
    .filter((email): email is string => Boolean(email));
}

export function isCoachEmail(email: string, allowed = coachEmailList()): boolean {
  const normalized = normalizeEmail(email);
  return Boolean(normalized && allowed.includes(normalized));
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

async function coach(req: Request, deps: CoachDeps): Promise<{ email: string } | Response> {
  if (!deps.plans) return json(503, { ok: false, message: "The coach desk is not available on this server." });
  const token = readCookie(req);
  const session = token ? await deps.findSession(token) : null;
  if (!session) return json(401, { ok: false, message: "Log in to open the coach desk." });
  if (!isCoachEmail(session.emailNormalized, deps.coachEmails)) {
    return json(403, { ok: false, message: "This account cannot open the coach desk." });
  }
  return { email: session.emailNormalized };
}

export async function handleCoachMe(req: Request, deps: CoachDeps): Promise<Response> {
  const who = await coach(req, deps);
  if (who instanceof Response) return who;
  return json(200, { ok: true });
}

export async function handleCoachList(req: Request, deps: CoachDeps): Promise<Response> {
  const who = await coach(req, deps);
  if (who instanceof Response) return who;
  const plans = await deps.plans!.list();
  return json(200, { ok: true, plans });
}

export async function handleCoachGet(req: Request, deps: CoachDeps, id: string): Promise<Response> {
  const who = await coach(req, deps);
  if (who instanceof Response) return who;
  if (!ID_RE.test(id)) return json(404, { ok: false, message: "That plan was not found." });
  const plan = await deps.plans!.get(id);
  if (!plan) return json(404, { ok: false, message: "That plan was not found." });
  return json(200, { ok: true, plan });
}

export async function handleCoachSave(req: Request, deps: CoachDeps, id: string): Promise<Response> {
  if (!sameOrigin(req)) return json(403, { ok: false, message: "Request not allowed." });
  const who = await coach(req, deps);
  if (who instanceof Response) return who;
  if (!ID_RE.test(id)) return json(404, { ok: false, message: "That plan was not found." });
  if (!(req.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json")) {
    return json(415, { ok: false, message: "Invalid request." });
  }
  const raw = await req.text();
  if (raw.length > MAX_BODY) return json(413, { ok: false, message: "That update is too large." });
  let body: Record<string, unknown>;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("bad");
    body = parsed as Record<string, unknown>;
  } catch {
    return json(400, { ok: false, message: "Invalid request." });
  }
  const current = await deps.plans!.get(id);
  if (!current) return json(404, { ok: false, message: "That plan was not found." });
  const content: PlanContent = { ...current };
  for (const key of Object.keys(LIMITS) as (keyof PlanContent)[]) {
    if (body[key] === undefined) continue;
    if (typeof body[key] !== "string" || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(body[key] as string)) {
      return json(422, { ok: false, message: "Use plain text in the plan." });
    }
    const value = (body[key] as string).trim();
    if (value.length > LIMITS[key]) return json(422, { ok: false, message: "One of the sections is too long." });
    content[key] = value;
  }
  const status: PlanStatus = body.publish === true ? "published" : body.publish === false ? "draft" : current.status;
  let agreementSelection = current.agreementSelection;
  if (body.agreementSelection !== undefined) {
    if (!Array.isArray(body.agreementSelection) || body.agreementSelection.length > AGREEMENT_FORMS.length || body.agreementSelection.some((id) => typeof id !== "string")) {
      return json(422, { ok: false, message: "Choose valid agreement forms." });
    }
    const requested = [...new Set(body.agreementSelection as string[])];
    const allowed = new Set(AGREEMENT_FORMS.filter((form) => form.services.includes(current.service)).map((form) => form.id));
    if (requested.some((id) => !allowed.has(id))) return json(422, { ok: false, message: "One of those forms is not available for this coaching service." });
    agreementSelection = requested;
  }
  if (status === "published") {
    for (const key of ["goals", "idealOutcome", "fitnessPlan", "meals", "schedule"] as const) {
      if (!content[key].trim()) return json(422, { ok: false, message: "Fill in every client section before you publish." });
    }
    if (current.needsReview && body.reviewed !== true) {
      return json(422, { ok: false, message: "Confirm you reviewed the health answers before the client can see this." });
    }
  }
  const saved = await deps.plans!.save(id, content, status, agreementSelection);
  return json(200, { ok: true, plan: saved });
}
