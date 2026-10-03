# Firebase App Hosting runbook — ezeirl.com

Status 2026-10-01: **prepared, nothing deployed.** `apphosting.yaml`, `firebase.json` and `.firebaserc` are committed; no backend
exists, DNS is untouched, and the live Vite site on Firebase Hosting (`eze-irl` → `eze-irl.web.app`) is still what visitors get.

## Why App Hosting
The rebuild is a Next.js server app (accounts, client portal, coach desk, API routes), so it needs a server — Firebase Hosting alone
only serves static files. App Hosting runs it on Google Cloud Run inside the **same Firebase project (`eze-irl`)**, deploys from
GitHub, and lets the domain stay in Firebase (Squarespace remains the registrar/DNS host, unchanged).

## Costs and prerequisites (owner decisions)
| Item | Detail |
|---|---|
| **Blaze plan** | App Hosting requires the pay-as-you-go plan (a billing account on the project). Config caps `maxInstances: 4`, scales to zero. **Confirm you are OK with billing before step 1.** |
| **Neon Postgres** | Needed for accounts, intake, plans, waitlist. Free tier exists; confirm plan/cost before creating (repo rule). |
| **GitHub** | App Hosting builds from a branch of `ezequielcruz91343-max/Ezeirl-website` via Developer Connect. |
| **Privacy policy** | `WAITLIST_ENABLED` / `INTAKE_ENABLED` stay `false` until attorney-reviewed. Accounts store only email + password hash. |

## Steps (each is reversible until step 6)
1. **Upgrade the project to Blaze** (console → Usage and billing). *Owner — sign in as `booking@ezeirl.com`, the Firebase account.*
2. **Create the database.** Neon project → copy the pooled connection string. Then, locally:
   `DATABASE_URL=… npm run db:migrate` (additive; safe to re-run).
3. **Create the database secret** (never commit values): `firebase apphosting:secrets:set ezeirl-database-url --project eze-irl`, then uncomment that entry in `apphosting.yaml`.
   **First admin — do NOT use `COACH_EMAILS` in production.** Sign-up does not verify emails (no email provider yet), so whoever registers a listed
   address first would become admin. Instead: (a) the real owner registers at `/register` first; (b) someone with database access runs
   `DATABASE_URL=… npm run account:role -- <email> admin`; (c) from then on the owner grants `coach` to trainers in the coach desk's team panel.
   (`COACH_EMAILS` still works for local development.)
4. **Create the backend** pointed at a **non-production branch** first:
   `firebase apphosting:backends:create --project eze-irl` → backend id `ezeirl-web`, pick a US region, connect the GitHub repo, set the
   live branch to `deploy/preview` (NOT `master`). Pushing to that branch builds and gives a private-by-obscurity `*.hosted.app` URL.
5. **Test on the `*.hosted.app` URL**: pages, /eze-fit, /eze-form, login/register, client portal, coach desk (with `COACH_EMAILS`),
   `/merch` redirect, Spotify embeds (CSP `frame-src`), mobile. Gates must still show "opening soon" panels.
6. **Cut over the domain (zero-downtime "Migrate a domain" flow)** — *owner approval required; touches DNS at Squarespace*:
   Firebase console → App Hosting → backend → Settings → Domains → Add domain `ezeirl.com` → choose **Migrate** (not "Connect new").
   Firebase shows the records to add (a `fah-claim=…` TXT, an `_acme-challenge` CNAME for the certificate, then the new A records).
   Add the TXT/CNAME first, wait for the certificate, then swap the A records. Add `www.ezeirl.com` with "redirect to ezeirl.com".
   **Do not touch MX / SPF / DKIM / DMARC (Google Workspace) records.** Certificates can take hours (up to ~24 h).
7. **Promote**: set the live branch to `master` (merge `rebuild/v2` after review). Pushes to it now deploy to production.

## Rollback
- **Before step 6:** delete the backend or ignore it; the live site is unaffected.
- **After step 6:** point the A records back to the Firebase Hosting values (`199.36.158.100`, as recorded in DEPLOYMENT.md) and remove the App
  Hosting custom domain. The Hosting site `eze-irl` is never modified by this plan, so it comes straight back.
- **Static copy of the old site:** `C:\Users\EzequielCruz\Documents\ezeirl-backups\ezeirl-live-site-2026-10-01.tar.gz` (HTML, JS/CSS bundle, all
  images, captured copy). It can be redeployed to Hosting with `firebase deploy --only hosting` from an extracted `live/` folder.
- **Rollouts:** App Hosting keeps previous rollouts; roll back from the console (App Hosting → Rollouts) without a rebuild.

## Known limits / follow-ups
- **Rate limiting is in-memory per instance** (`lib/waitlist/rate-limit.ts`): a speed bump on Cloud Run, not a global limit. Plan: Postgres-backed limiter.
- **No email provider**: no password reset or email verification yet (blocked on provider + privacy review). Do not market account features as verified.
- **Analytics** is off; set `NEXT_PUBLIC_GA_ID` (build-time) only after the privacy policy covers it. The live site currently loads GA `G-QQK088RQ5E`,
  so the rebuild will have *less* analytics than today until that is decided.
- **Ambient audio**: `/audio/site-bed.mp3` was never supplied on the live site; the toggle stays hidden until `AMBIENT_AUDIO_SRC` is set.
- **Mailbox**: live CTAs used `hello@ezeirl.com`; the rebuild uses the documented `booking@ezeirl.com`. Confirm which receives mail.
