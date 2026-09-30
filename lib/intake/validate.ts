import { type IntakeQuestion } from "@/config/intake";
import { getCoachingIntake, isCoachingService, type CoachingService } from "@/config/coaching";
import { normalizeEmail } from "@/lib/waitlist/normalize";

export type IntakeAnswer = string | string[];
export type IntakeAnswers = Record<string, IntakeAnswer>;

export interface IntakeSubmission {
  service: CoachingService;
  email: string; // normalized
  fullName: string;
  answers: IntakeAnswers;
}

export type IntakeErrors = Record<string, string>;

export type IntakeParseResult =
  | { ok: true; honeypot: false; data: IntakeSubmission }
  | { ok: true; honeypot: true }
  | { ok: false; errors: IntakeErrors };

const CONTROL_RE = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;

/** Validate one answer. Returns the cleaned value, `null` for "left blank", or an error string. */
export function validateAnswer(q: IntakeQuestion, raw: unknown): { value: IntakeAnswer | null } | { error: string } {
  const blank = raw === undefined || raw === null || raw === "" || (Array.isArray(raw) && raw.length === 0);
  if (blank) return q.required ? { error: "This question is required." } : { value: null };

  switch (q.type) {
    case "text":
    case "email":
    case "tel":
    case "textarea": {
      if (typeof raw !== "string") return { error: "Invalid answer." };
      const v = raw.normalize("NFKC").trim();
      if (!v) return q.required ? { error: "This question is required." } : { value: null };
      if (v.length > q.max) return { error: `Keep this under ${q.max} characters.` };
      if (CONTROL_RE.test(v)) return { error: "Invalid characters." };
      if (q.type === "email") {
        const e = normalizeEmail(v);
        return e ? { value: e } : { error: "Enter a valid email address." };
      }
      if (q.type === "tel" && !/^[+\d][\d\s().-]{5,29}$/.test(v)) return { error: "Enter a valid phone number." };
      return { value: v };
    }
    case "yesno":
      return raw === "yes" || raw === "no" ? { value: raw } : { error: "Choose Yes or No." };
    case "radio":
      return typeof raw === "string" && q.options.some((o) => o.value === raw) ? { value: raw } : { error: "Choose one of the options." };
    case "scale": {
      const n = typeof raw === "string" ? Number(raw) : NaN;
      return Number.isInteger(n) && n >= q.min && n <= q.max ? { value: String(n) } : { error: "Choose a number from 1 to 5." };
    }
    case "multi": {
      if (!Array.isArray(raw) || raw.some((x) => typeof x !== "string")) return { error: "Invalid answer." };
      const set = [...new Set(raw as string[])];
      if (!set.every((x) => q.options.some((o) => o.value === x))) return { error: "Choose from the listed options." };
      if (q.maxSelect && set.length > q.maxSelect) return { error: `Select up to ${q.maxSelect}.` };
      return { value: set };
    }
  }
}

/**
 * Validate an untrusted JSON body. Never throws. Unknown keys are ignored (never stored), so a
 * client cannot smuggle extra data into the record. `website` is the honeypot.
 */
export function parseIntakePayload(body: unknown): IntakeParseResult {
  if (typeof body !== "object" || body === null || Array.isArray(body)) return { ok: false, errors: { form: "Invalid request." } };
  const b = body as Record<string, unknown>;
  if (typeof b.website === "string" && b.website.trim() !== "") return { ok: true, honeypot: true };
  // Older /intake clients remain personal-training submissions. Never accept arbitrary service ids.
  const service = b.service === undefined ? "personal-training" : b.service;
  if (!isCoachingService(service)) return { ok: false, errors: { service: "Choose a coaching option." } };

  const errors: IntakeErrors = {};
  const answers: IntakeAnswers = {};
  const given = typeof b.answers === "object" && b.answers !== null && !Array.isArray(b.answers) ? (b.answers as Record<string, unknown>) : {};

  for (const q of getCoachingIntake(service).sections.flatMap((s) => s.questions)) {
    const r = validateAnswer(q, given[q.id]);
    if ("error" in r) errors[q.id] = r.error;
    else if (r.value !== null) answers[q.id] = r.value;
  }
  if (b.consent !== true) errors.consent = "Please confirm to continue.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    honeypot: false,
    data: { service, email: answers.email as string, fullName: answers.fullName as string, answers },
  };
}
