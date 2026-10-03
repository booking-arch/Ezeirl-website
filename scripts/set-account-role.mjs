#!/usr/bin/env node
/**
 * Set a website account's role directly in the database: client | coach | admin.
 *
 *   DATABASE_URL=postgres://... node scripts/set-account-role.mjs <email> <client|coach|admin>
 *   DATABASE_URL=postgres://... node scripts/set-account-role.mjs --list
 *
 * WHY THIS EXISTS: sign-up does not verify email addresses (no email provider yet), so an email-based admin list
 * (COACH_EMAILS) can be claimed by whoever registers that address first. Promote an account only AFTER its real
 * owner has registered it, using this script (run by someone with database access). The desk's team panel can
 * grant/revoke "coach" later; "admin" can only ever be set here.
 *
 * The connection string is read from the environment and never printed.
 */
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is required.");
  process.exit(1);
}
const sql = neon(url);
const ROLES = ["client", "coach", "admin"];
const args = process.argv.slice(2);

if (args[0] === "--list") {
  const rows = await sql.query("SELECT email_display, role, created_at FROM site_accounts WHERE role <> 'client' ORDER BY role, email_normalized");
  console.log(rows.length ? rows.map((r) => `${r.role.padEnd(6)} ${r.email_display}`).join("\n") : "(no staff accounts)");
  process.exit(0);
}

const [emailArg, role] = args;
const email = (emailArg ?? "").trim().toLowerCase();
if (!email || !email.includes("@") || !ROLES.includes(role)) {
  console.error(`Usage: node scripts/set-account-role.mjs <email> <${ROLES.join("|")}>   |   --list`);
  process.exit(1);
}
const updated = await sql.query("UPDATE site_accounts SET role = $1 WHERE email_normalized = $2 RETURNING email_display", [role, email]);
if (!updated.length) {
  console.error("No account uses that email. The person must register at /register first.");
  process.exit(2);
}
console.log(`${updated[0].email_display} is now: ${role}`);
