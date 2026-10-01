/**
 * True on serverless hosts whose filesystem is ephemeral or read-only (Vercel, Google Cloud Run — which is what
 * Firebase App Hosting runs on). There a local SQLite file would silently lose data, so stores must use
 * DATABASE_URL or report "unavailable" instead.
 */
export function isEphemeralHost(env: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(env.VERCEL || env.K_SERVICE || env.FIREBASE_CONFIG || env.FUNCTION_TARGET);
}
