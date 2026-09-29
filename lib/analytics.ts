/**
 * Provider-agnostic analytics layer. The site has NO analytics provider yet (AGENTS.md: activate only
 * after the privacy policy is finalized), so by default every event is dropped. When a provider is
 * approved, register it once — components never change:
 *
 *   registerAnalyticsProvider({ track: (name, props) => provider.capture(name, props) });
 *
 * Privacy guarantees enforced HERE, not left to callers:
 *  - only allow-listed, primitive, non-identifying properties pass through (no email, name, health);
 *  - no fingerprinting, cookies, or storage;
 *  - honors Do Not Track / Global Privacy Control.
 */
export const ANALYTICS_EVENTS = [
  "eze_fit_view",
  "eze_fit_beta_cta",
  "eze_fit_beta_signup",
  "eze_fit_launch_signup",
  "merch_view",
  "merch_product_view",
  "merch_waitlist_signup",
  "merch_early_access_cta",
  "eze_irl_community_signup",
  "partnership_cta",
  "social_click",
  "content_click",
] as const;
export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];

/** Properties that may accompany an event. Anything else is discarded. */
const ALLOWED_PROPS = ["location", "surface", "product_id", "interest", "campaign", "referrer_host"] as const;
export type AnalyticsProps = Partial<Record<(typeof ALLOWED_PROPS)[number], string>>;

export interface AnalyticsProvider {
  track(event: AnalyticsEvent, props: AnalyticsProps): void;
}

let provider: AnalyticsProvider | null = null;

export function registerAnalyticsProvider(p: AnalyticsProvider | null) {
  provider = p;
}

function optedOut(): boolean {
  if (typeof navigator === "undefined") return true;
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean; doNotTrack?: string | null };
  return nav.globalPrivacyControl === true || nav.doNotTrack === "1";
}

export function sanitizeProps(props: Record<string, unknown> = {}): AnalyticsProps {
  const out: AnalyticsProps = {};
  for (const key of ALLOWED_PROPS) {
    const v = props[key];
    if (typeof v === "string" && v.length <= 64 && !v.includes("@")) out[key] = v;
  }
  return out;
}

export function track(event: AnalyticsEvent, props: Record<string, unknown> = {}): void {
  if (!provider || optedOut()) return;
  try {
    provider.track(event, sanitizeProps(props));
  } catch {
    // Analytics must never break the page.
  }
}
