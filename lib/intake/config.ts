/**
 * Legal gate for the client intake form. It collects HEALTH information, so it stays OFF until the
 * privacy policy is attorney-reviewed (AGENTS.md). On only when INTAKE_ENABLED is exactly "true".
 * Pages read it at build time; the API route re-checks it per request and stores nothing while off.
 */
export function isIntakeEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.INTAKE_ENABLED === "true";
}
