/**
 * Legal gate for production-facing email collection (AGENTS.md: no email signup until the privacy
 * policy is attorney-reviewed). Off unless WAITLIST_ENABLED is exactly the string "true".
 *
 * Pages read this at build time to choose between the live form and the "opening soon" panel; the
 * API route re-checks it at request time and refuses to parse or store anything while it is off.
 * On Vercel, changing the variable takes effect on the next deployment. Enabling collection later is
 * therefore a configuration change (set the variable, redeploy) — no code or design change.
 */
export function isWaitlistEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.WAITLIST_ENABLED === "true";
}
