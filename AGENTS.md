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
- **Do not connect social accounts** — all are null in config/social.ts
- **Do not send outreach** — gym-collaboration-draft is for internal review only
- **No secrets or credentials** in committed files
- **Do not market any EZE-FIT feature** that is not CONFIRMED (or explicitly beta-labelled) in `docs/eze-fit-feature-matrix.md`
- **Never fabricate app screens or merchandise imagery.** Missing assets stay `null` in `config/assets.ts`
- **Do not invent EZE // FORM prices, materials, sizes, inventory or release dates**
- **Waitlist is gated by `WAITLIST_ENABLED`** (default off). Do not enable it until the privacy policy is attorney-reviewed
- **Client intake (`/intake`, `POST /api/intake`) collects HEALTH data and is gated by `INTAKE_ENABLED` (default off).** Do not enable until the privacy policy is attorney-reviewed. Data goes only to `client_intake_submissions` (migration 0003), never the waitlist tables
- **Website login (`/login`, `/register`) is an EZE IRL account only.** Do not connect it to the private EZE-FIT app or put that app's address anywhere public
- **`/coach` is the owner's review desk.** Plans stay unpublished until the coach publishes them. Do not link `/coach` from marketing pages or from `/eze-fit`
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
- No real social URLs — Footer shows "SOON" badges
- Approved EZE IRL photographs are in `public/eze-irl/photos/` and indexed at `/content`. Do not generate replacements. Video and social URLs stay unset until confirmed in `config/social.ts`
- No analytics provider — events are emitted through `lib/analytics.ts` and dropped until a provider is approved
