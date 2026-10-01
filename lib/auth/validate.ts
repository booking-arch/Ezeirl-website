import { normalizeEmail } from "@/lib/waitlist/normalize";

export const CONSENT_TEXT_VERSION = "account-v1";
const MIN_PASSWORD = 10;
const MAX_PASSWORD = 72;

export interface AuthCredentials {
  emailNormalized: string;
  emailDisplay: string;
  password: string;
}

export type AuthParse =
  | { ok: true; credentials: AuthCredentials; consent: boolean; honeypot: boolean }
  | { ok: false; errors: Record<string, string> };

function cleanPassword(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  if (raw.length < MIN_PASSWORD || raw.length > MAX_PASSWORD) return null;
  if (/[\u0000-\u001f\u007f]/.test(raw)) return null;
  if (!/[a-z]/i.test(raw) || !/[0-9]/.test(raw)) return null;
  return raw;
}

/** Only same-site paths. Blocks protocol-relative and off-site redirects. */
export function safeNext(value: unknown): string | null {
  if (typeof value !== "string") return null;
  if (value.length < 1 || value.length > 200) return null;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\") || value.includes("://")) return null;
  // URL parsers silently drop tab / CR / LF (and other control characters), so "/\t/evil.example" would become
  // "//evil.example" — a redirect off-site. Reject any control character outright.
  if (/[\u0000-\u001f\u007f]/.test(value)) return null;
  return value;
}

export function parseAuthPayload(body: unknown, mode: "login" | "register"): AuthParse {
  if (!body || typeof body !== "object") return { ok: false, errors: { form: "Enter your email and password." } };
  const record = body as Record<string, unknown>;
  const honeypot = typeof record.company === "string" && record.company.trim().length > 0;
  const emailDisplay = typeof record.email === "string" ? record.email.trim() : "";
  const emailNormalized = normalizeEmail(record.email);
  const errors: Record<string, string> = {};
  if (!emailNormalized) errors.email = "Enter a valid email address.";
  const password = cleanPassword(record.password);
  if (!password) errors.password = "Use 10 to 72 characters, with at least one letter and one number.";
  if (mode === "register" && record.consent !== true) errors.consent = "Agree to the privacy policy to create an account.";
  if (emailNormalized && password && password.toLowerCase() === emailNormalized) {
    errors.password = "Use a password that is not your email address.";
  }
  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    honeypot,
    consent: record.consent === true,
    credentials: { emailNormalized: emailNormalized as string, emailDisplay, password: password as string },
  };
}
