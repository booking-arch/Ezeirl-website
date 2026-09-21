#!/usr/bin/env node
/**
 * Apply db/migrations/*.sql in order. Manual, explicit, never run by the build.
 *   DATABASE_URL=postgres://... node db/migrate.mjs           # apply
 *   DATABASE_URL=postgres://... node db/migrate.mjs --dry-run # list what would run
 * Each file is idempotent (IF NOT EXISTS), so re-running is safe.
 */
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is required.");
  process.exit(1);
}
const dryRun = process.argv.includes("--dry-run");
const dir = join(dirname(fileURLToPath(import.meta.url)), "migrations");
const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();
const sql = neon(url);

for (const file of files) {
  console.log(`${dryRun ? "would apply" : "applying"} ${file}`);
  if (dryRun) continue;
  // The Neon HTTP driver runs one statement per call, so split on statement boundaries.
  const statements = readFileSync(join(dir, file), "utf8")
    .split(/;\s*(?:\n|$)/)
    .map((s) => s.replace(/^\s*--.*$/gm, "").trim())
    .filter(Boolean);
  for (const stmt of statements) await sql.query(stmt);
}
console.log("done");
