import {
  WAITLIST_INTERESTS,
  isWaitlistInterest,
  isWaitlistSource,
  type WaitlistInterest,
  type WaitlistSource,
} from "./interests";
import { normalizeEmail, normalizeFirstName } from "./normalize";

export interface WaitlistSignup {
  email: string; // as typed (trimmed)
  emailNormalized: string;
  firstName: string | null;
  interests: WaitlistInterest[];
  source: WaitlistSource;
  campaign: string | null;
  referral: string | null;
  consent: boolean;
}

export type FieldErrors = Partial<Record<"email" | "firstName" | "interests" | "source" | "campaign" | "referral" | "body", string>>;

export type ParseResult =
  | { ok: true; data: WaitlistSignup; honeypot: false }
  | { ok: true; honeypot: true }
  | { ok: false; errors: FieldErrors };

const TAG_RE = /^[a-z0-9][a-z0-9_.:-]{0,63}$/i;
const HOST_RE = /^[a-z0-9.-]{1,100}$/i;

function optionalTag(value: unknown, re: RegExp): string | null | undefined {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") return undefined;
  const v = value.trim();
  return re.test(v) ? v.toLowerCase() : undefined;
}

/**
 * Validate an untrusted JSON body. Never throws. `website` is the honeypot field: real people never
 * see or fill it, so a non-empty value is reported as `honeypot: true` (caller pretends success).
 */
export function parseWaitlistPayload(body: unknown): ParseResult {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { ok: false, errors: { body: "Invalid request." } };
  }
  const b = body as Record<string, unknown>;

  if (typeof b.website === "string" && b.website.trim() !== "") return { ok: true, honeypot: true };

  const errors: FieldErrors = {};

  const emailNormalized = normalizeEmail(b.email);
  if (!emailNormalized) errors.email = "Enter a valid email address.";

  const firstName = normalizeFirstName(b.firstName);
  if (firstName === undefined) errors.firstName = "Use letters only for your first name.";

  const rawInterests = Array.isArray(b.interests) ? b.interests : b.interest !== undefined ? [b.interest] : [];
  const interests = [...new Set(rawInterests)].filter(isWaitlistInterest);
  if (rawInterests.length === 0 || interests.length !== new Set(rawInterests).size || interests.length > WAITLIST_INTERESTS.length) {
    errors.interests = "Choose a valid list to join.";
  }

  if (!isWaitlistSource(b.source)) errors.source = "Invalid request.";

  const campaign = optionalTag(b.campaign, TAG_RE);
  if (campaign === undefined) errors.campaign = "Invalid campaign.";
  const referral = optionalTag(b.referral, HOST_RE);
  if (referral === undefined) errors.referral = "Invalid referral.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    honeypot: false,
    data: {
      email: (b.email as string).trim(),
      emailNormalized: emailNormalized as string,
      firstName: firstName as string | null,
      interests,
      source: b.source as WaitlistSource,
      campaign: campaign as string | null,
      referral: referral as string | null,
      consent: b.consent === true,
    },
  };
}
