# DEPLOYMENT.md — EZE IRL

## STATUS (2026-10-01): rebuilt, NOT deployed

- **Live site today:** `ezeirl.com` is a static Vite SPA on **Firebase Hosting** (project `eze-irl`, site `eze-irl`; `www` redirects to the apex).
  Its source was never recovered, so this repository **replicates it** (captured bundle, copy and assets) as the Next.js "EZE Universe" pages
  and adds the user and trainer portals.
- **Target:** Firebase App Hosting in the same project. Config is prepared (`apphosting.yaml`, `firebase.json`, `.firebaserc`).
  **Runbook, costs and rollback: [docs/firebase-app-hosting-runbook.md](docs/firebase-app-hosting-runbook.md).**
- **Vercel** (`ezeirl-website.vercel.app`) still serves an old `master` build and is not the production domain. Older notes in
  `docs/domain-routing.md` and `docs/production-baseline-2026-09-21.md` describe a redirect that no longer exists — ignore them.
- Summary of the rebuild and the decisions awaiting the owner: [docs/rebuild-2026-10.md](docs/rebuild-2026-10.md).

## Hard boundaries (unchanged)

- Domain registration stays at **Squarespace Domains**. No transfer.
- **No DNS or nameserver changes** are needed for any feature in this repo. Do not modify Google Workspace records (MX/SPF/DKIM/DMARC) or `booking@ezeirl.com`.
- No production deployment, merge to `master`, or plan change without Ezekiel's explicit approval.

## Environment variables

| Variable | Scope | Purpose |
|----------|-------|---------|
| `WAITLIST_ENABLED` | server | Legal gate. Must be exactly `true` to collect emails. Default/unset = forms show "opening soon" and `/api/waitlist` answers `503`. |
| `DATABASE_URL` | server | Neon Postgres connection string. Required only when `WAITLIST_ENABLED=true`. |
| `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_EMAIL_*`, `NEXT_PUBLIC_ANALYTICS_ID` | public | Existing, unchanged; analytics/email provider remain unconfigured. |

Vercel applies environment variable changes to the **next** deployment only, so enabling the waitlist is: set variables → redeploy.

## Releasing the ecosystem work (`feat/ecosystem`)

1. Push the branch. Vercel builds a **Preview** (never production). Forms show "opening soon" there because `WAITLIST_ENABLED` is unset.
2. Review the Preview on phone and desktop.
3. Get explicit approval, then merge to `master` → Vercel promotes to production.
4. Rollback: see below.

## Opening the waitlist (only after privacy/legal review)

Prerequisite (AGENTS.md): privacy policy attorney-reviewed and updated to describe the EZE-FIT / EZE // FORM lists.

1. Provision Neon Postgres (Vercel Marketplace). **Confirm the plan and cost first** — do not provision on an unconfirmed paid plan.
2. Set `DATABASE_URL` in Vercel (server-side).
3. Apply the schema once: `DATABASE_URL=… npm run db:migrate` (additive; safe to re-run; see `db/migrations/0001_waitlist.sql`).
4. Set `WAITLIST_ENABLED=true` and redeploy.
5. Smoke test: submit a test address on `/eze-fit` and `/merch`; confirm rows in `waitlist_contacts` / `waitlist_interests`; delete the test rows.

## Rollback

- **Site:** Vercel dashboard → Deployments → the previous production deployment → **Promote to Production** (instant; no rebuild).
- **Git:** `master` is untouched until approval. To undo a merge: `git revert -m 1 <merge-commit>`.
- **Database:** the migration only *adds* two tables and nothing reads them unless `WAITLIST_ENABLED=true`. Rolling back the site needs no database action. To remove the data: `DROP TABLE waitlist_interests; DROP TABLE waitlist_contacts;`.
- **Kill switch without a redeploy of code:** unset/`false` `WAITLIST_ENABLED` and redeploy; the API refuses requests immediately after.

## Local production preview

```bash
npm install --legacy-peer-deps
npm run build && npm run start   # http://localhost:3000
```
