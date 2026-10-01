# AGENTS.md — EZE IRL Website

Agent coordination file for AI-assisted development.

## Project

EZE IRL public website at www.ezeirl.com. Next.js 15 / React 19 / TypeScript.

## Critical Rules

- **Do not deploy** without Ezekiel's approval
- **Do not activate email signup** until privacy policy is attorney-reviewed
- **Do not fabricate** follower counts, sponsors, testimonials, or product claims
- **Do not claim EOS Fitness or any gym has approved filming**
- **Do not claim Twitch account exists** — platformUrl is null in config/stream.ts
- **Social handles**: `config/social.ts` is still null (legacy). The rebuilt pages (`lib/universe/content.ts`) carry the Instagram / TikTok / YouTube / X / music links that were already public on the live site — owner sign-off pending (see docs/rebuild-2026-10.md). Do not add any account that is not already public
- **Do not send outreach** — gym-collaboration-draft is for internal review only
- **No secrets or credentials** in committed files
- **Do not market any EZE-FIT feature** that is not CONFIRMED (or explicitly beta-labelled) in `docs/eze-fit-feature-matrix.md`
- **Never fabricate app screens or merchandise imagery.** Missing assets stay `null` in `config/assets.ts`
- **Do not invent EZE // FORM prices, materials, sizes, inventory or release dates**
- **Waitlist is gated by `WAITLIST_ENABLED`** (default off). Do not enable it until the privacy policy is attorney-reviewed
- **Client intake (`/intake`, `POST /api/intake`) collects HEALTH data and is gated by `INTAKE_ENABLED` (default off).** Do not enable until the privacy policy is attorney-reviewed. Data goes only to `client_intake_submissions` (migration 0003), never the waitlist tables
- **Website login (`/login`, `/register`) is an EZE IRL account only.** Do not connect it to the private EZE-FIT app or put that app's address anywhere public
- **`/coach` is the staff review desk.** Plans stay unpublished until a coach publishes them. Do not link `/coach` from marketing pages or from `/eze-fit`. Access = database role `coach`/`admin` (migration 0007) or an email in `COACH_EMAILS` (always admin). Admins grant/revoke coach access in the desk; **admin is never grantable from the UI**
- **Plans link to accounts by account id only** (signed-in submission, or claiming a plan by its private link) — **never by matching an email address** (emails are unverified). Staff actions on client data go through `lib/audit.ts` (ids only, never names/emails/content)
- **Stores must not fall back to local SQLite on Cloud Run / Vercel** (`lib/runtime-env.ts`): without `DATABASE_URL` they report "unavailable"
- **The public pages are the "EZE Universe" shell** (`app/(universe)`, `components/universe`, copy in `lib/universe/content.ts`). The live-site stylesheet is generated into `app/(universe)/universe.css` (`scripts/scope-universe-css.mjs`, scoped with `:where(.universe)`); put hand-written CSS in `universe-extra.css`
- **Never change DNS, nameservers, Squarespace, or Google Workspace records**
- **Install with --legacy-peer-deps** (R3F 8.x / React 19 peer conflict)

## Build Commands

```bash
npm run build       # Must pass with zero errors
npm run typecheck   # Must pass
npm run lint        # Warnings acceptable, errors not
npm test            # Vitest: waitlist, analytics, pages, content-policy tests
```

## Config Files (edit these, not components)

- `config/brand.ts` — brand identity
- `config/social.ts` — set url: to real URL when account is confirmed
- `config/stream.ts` — update status when stream is confirmed/live/ended
- `config/ecosystem.ts` — navigation + all EZE-FIT / EZE // FORM copy (every EZE-FIT claim must map to `docs/eze-fit-feature-matrix.md`)
- `config/assets.ts` — asset manifest; real EZE-FIT screens / EZE // FORM product imagery are registered here

## Stream State Machine

status: "planned" → "live" → "ended" | "cancelled"
locationStatus: "pending-approval" → "confirmed"
platformStatus: "not-configured" → "configured"

## Social Account State

All social.ts entries start with url: null. Set to real URL only when account exists and is confirmed by Ezekiel.

## Legal

All pages in app/(legal)/ are drafts requiring attorney review before data collection is activated.

## Known Limitations

- R3F/React 19 peer dep conflict — use --legacy-peer-deps on install
- No email provider connected — CommunitySection shows "coming soon" state (the EZE-FIT / EZE // FORM waitlist is separate: see ARCHITECTURE.md)
- Hosting target is Firebase App Hosting (project `eze-irl`): see docs/firebase-app-hosting-runbook.md. `apphosting.yaml` is prepared; nothing is deployed
- Approved EZE IRL photographs are in `public/eze-irl/photos/` and indexed at `/content`. Do not generate replacements. Video and social URLs stay unset until confirmed in `config/social.ts`
- No analytics provider — events are emitted through `lib/analytics.ts` and dropped until a provider is approved
