/**
 * Waitlist vocabulary. One contact (email) can hold many interests — never one row per product.
 * Keep these in sync with the CHECK constraints in db/migrations/0001_waitlist.sql.
 */
export const WAITLIST_INTERESTS = ["eze_fit_beta", "eze_fit_launch", "eze_form", "eze_irl_community"] as const;
export type WaitlistInterest = (typeof WAITLIST_INTERESTS)[number];

/** Where on the site the signup happened. Distinct from interest (what the person wants). */
export const WAITLIST_SOURCES = ["eze_fit", "eze_fit_home", "merch", "merch_home", "homepage", "partnerships"] as const;
export type WaitlistSource = (typeof WAITLIST_SOURCES)[number];

/** Interest lifecycle. New signups are always `active`; the rest are set by future admin tooling. */
export const WAITLIST_STATUSES = ["active", "invited", "converted", "unsubscribed"] as const;
export type WaitlistStatus = (typeof WAITLIST_STATUSES)[number];

/** Bump whenever the consent wording shown next to a form changes. Stored with consent_at. */
export const CONSENT_TEXT_VERSION = "2026-09-v1";

export function isWaitlistInterest(value: unknown): value is WaitlistInterest {
  return typeof value === "string" && (WAITLIST_INTERESTS as readonly string[]).includes(value);
}

export function isWaitlistSource(value: unknown): value is WaitlistSource {
  return typeof value === "string" && (WAITLIST_SOURCES as readonly string[]).includes(value);
}
