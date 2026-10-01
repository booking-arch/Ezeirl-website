# Rebuild — October 2026

Branch `rebuild/v2` (backup of earlier work: `codex/T-038-docusign-agreements`). Nothing here is deployed; `master` and production are untouched.

## Why
`ezeirl.com` is served from Firebase Hosting by a Vite single-page app whose source could not be found (not on this computer, GitHub, Lovable,
Replit, OneDrive or the Firebase project, which holds built files only). The site was rebuilt from the captured production bundle so it can be
maintained, and the user and trainer portals were integrated.

## What exists now
| Area | Routes / code |
|---|---|
| EZE Universe (replica of live site) | `/`, `/eze-fit`, `/eze-form` · `app/(universe)`, `components/universe`, `lib/universe/content.ts` |
| Same shell for the rest of the public site | `/content`, `/partnerships`, legal pages, `/login`, `/register`, `/account`, `/intake` |
| User portal | `/account` → "Your coaching" · `/client-portal` questionnaires · `/plan/[token]` (+ "Save to my account") |
| Trainer portal | `/coach` (not linked publicly) · search, filters, plan editor, agreement packet, **team panel (admin)** |
| Roles | `client` / `coach` / `admin` (migration 0007); `COACH_EMAILS` = bootstrap admins |
| Backend | accounts + sessions, intake, plans, waitlist · Neon Postgres in production, SQLite locally, memory in tests |
| Migrations | `db/migrations/0001…0008` (all additive). New: **0007 roles, 0008 plan→account link** |
| Hosting prep | `apphosting.yaml`, `firebase.json`, `.firebaserc`, runbook |
| Old pages kept | `/eze-fit/beta` (noindex; the app-landing replica with the gated waitlist form) · `/merch` → 301 `/eze-form` |

## Decisions awaiting the owner
1. **Billing**: Firebase App Hosting needs the Blaze plan. Neon plan/cost also unconfirmed.
2. **Domain cutover**: requires DNS records at Squarespace (TXT/CNAME/A). Zero-downtime flow in the runbook. Not started.
3. **Social handles**: carried from the live site into `lib/universe/content.ts` (IG `itsezeirl`, TikTok `@itsezeirl`, YouTube `@ItsEzeIRL`, X `@EzeIRL`, plus Spotify / Apple / YouTube Music / SoundCloud). `config/social.ts` is still null per the old rule — confirm or remove.
4. **Business mailbox**: live CTAs used `hello@ezeirl.com`; the rebuild uses `booking@ezeirl.com`, which the owner confirmed (2026-10-01) is the Firebase/Google account, so it is a real mailbox. Remaining question: does `hello@` also exist (alias)?
5. **Google Analytics**: live site loads GA `G-QQK088RQ5E`. The rebuild loads nothing unless `NEXT_PUBLIC_GA_ID` is set (needs the privacy policy to cover it).
6. **Ambient audio**: `/audio/site-bed.mp3` never existed on the live site; the SOUND toggle is hidden until a licensed file is supplied (`AMBIENT_AUDIO_SRC`).
7. **Legal gates** stay closed: `WAITLIST_ENABLED=false`, `INTAKE_ENABLED=false` until the privacy policy (currently a draft that says health data is not collected) is attorney-reviewed.
8. **Public repo**: `Ezeirl-website` is public on GitHub, so this code (including portal logic) is readable. Make it private if undesired.

## Verification performed
- `npm run typecheck`, `npm run lint`, `npm test` (181 tests: stores contract-tested against memory **and** SQLite), `npm run build`.
- End-to-end HTTP run on a throwaway server and databases: register → admin grants coach → signed-in intake → coach publishes → client sees plan → claim by link → second-account claim refused (409) → bad token (404) → logged-out (401) → audit log scanned for names/emails/plan text (none).
- Browser sweep of 14 routes × 3 viewports (390 / 820 / 1440): no horizontal overflow, one `<main>`, alt on every image, no console or network errors.
- Visual comparison of `/` with the live site: matches. Logged-in screens (client dashboard, coach desk, owner desk) reviewed in screenshots.

## Security notes
- Fixed an open-redirect hole in `safeNext` (`/\t/evil.example` slipped through; browsers strip the tab → `//evil.example`).
- Cloud Run safe: stores refuse to fall back to a local SQLite file (data would be lost).
- Plans link to accounts by id, never by email (emails are not verified — there is no email provider yet).

## Not done / backlog
- **Email**: no provider → no password reset, email verification, or notifications. Needs a provider choice + privacy review.
- **Rate limiting** is in-memory per instance (speed bump on Cloud Run). Move to Postgres.
- Waitlist forms are not wired into the new CTAs (they use `mailto:` like the live site). When `WAITLIST_ENABLED` opens, point "TRY BETA"/"GET NOTIFIED" at `/eze-fit/beta#beta-signup` / a form.
- Real EZE-FIT screens, EZE // FORM product photography and the live "newer" staging build (`Documents/eze-fit-staging/site-preview`) are not integrated.
- `docs/domain-routing.md`, `docs/production-baseline-2026-09-21.md` are historical.
