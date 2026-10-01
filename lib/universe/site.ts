/** Site-wide constants for the EZE Universe shell. */
// The live site used hello@ezeirl.com; the repo's documented business address is booking@ezeirl.com (config/brand.ts).
// We use the documented one. OWNER: confirm which mailbox actually receives mail (hello@ was never verified here).
export const SITE_EMAIL = "booking@ezeirl.com";
export const SITE_ORIGIN = "https://ezeirl.com";

export const BRAND_TITLES = {
  irl: "EZE IRL — Discipline Creates Freedom",
  "eze-fit": "EZE-FIT — Private Beta | EZE IRL",
  "eze-form": "EZE//FORM — Drop 001 · Fall 2026 | EZE IRL",
} as const;
