/** Site-wide constants for the EZE Universe shell. */
// The live site used hello@ezeirl.com; the repo's documented business address is booking@ezeirl.com (config/brand.ts).
// We use the documented one: the owner confirmed booking@ is their real Google/Firebase account. hello@ was never verified.
export const SITE_EMAIL = "booking@ezeirl.com";
export const SITE_ORIGIN = "https://ezeirl.com";

export const BRAND_TITLES = {
  irl: "EZE IRL — Discipline Creates Freedom",
  "eze-fit": "EZE-FIT — Private Beta | EZE IRL",
  "eze-form": "EZE//FORM — Drop 001 · Fall 2026 | EZE IRL",
} as const;
