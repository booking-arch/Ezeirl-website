# EZE IRL Website

Official website for EZE IRL — the fitness, competition, comedy, and real-life media brand.

**Domain:** www.ezeirl.com
**Creator:** EZE (Ezekiel Cruz)
**Company:** EZE Media
**Community:** The EZE Crew
**Tagline:** Bad decisions. Better stories.
**Business:** booking@ezeirl.com

## Stack

- Next.js 15 / React 19 / TypeScript
- Tailwind CSS 3
- Framer Motion 11
- Three.js (imperative, no JSX R3F — React 19 peer compat)
- Bebas Neue + Inter + JetBrains Mono (self-hosted via `next/font`)
- Vitest (logic + server-render tests) · Neon Postgres driver (waitlist)

## Sections

1. Hero — cinematic intro with 3D metallic emblem
2. The IRL — brand pillars
3. First Stream — countdown, event details, pending location
4. EZE-FIT — product reveal (private beta) → `/eze-fit`
5. EZE // FORM — Drop 001 reveal (coming soon) → `/merch`
6. Performance Lab — supplement/sponsor placeholders
7. Watch — content platform cards
8. Partnerships — brand partnership positioning
9. Community — email signup (provider-safe)

## Routes

`/` · `/eze-fit` · `/merch` · `/partnerships` · `/content` · `/api/waitlist` (POST) · legal pages · `/sitemap.xml`

`/intake` and `/client-portal` exist, are `noindex`, and are disallowed in `robots.txt`. Both stay off unless their environment gates are set.

## Local Development

```bash
npm install --legacy-peer-deps  # Required: R3F 8.x / React 19 peer dep
npm run dev                     # http://localhost:3000
npm test                        # Vitest
```

## Build

```bash
npm run build
npm run start          # Preview production build locally
```

## Configuration

| File | Purpose |
|------|---------|
| `config/brand.ts` | Brand name, taglines, email, themes |
| `config/social.ts` | Social platform URLs (null = not configured) |
| `config/links.ts` | Internal and external links |
| `config/stream.ts` | First stream date, status, location |
| `config/ecosystem.ts` | Navigation and EZE-FIT / EZE // FORM copy (verified claims only) |
| `config/assets.ts` | Asset manifest for real EZE-FIT screens and EZE // FORM imagery |
| `lib/waitlist/config.ts` | Waitlist legal gate (`WAITLIST_ENABLED`) |

## Environment Variables

Copy `.env.example` to `.env.local`. Do not commit `.env.local`.

Email signup is disabled until a provider is configured and the privacy policy is attorney-reviewed.
The EZE-FIT / EZE // FORM waitlist is off unless `WAITLIST_ENABLED=true` (needs `DATABASE_URL`). See `DEPLOYMENT.md`.

## Deployment (Vercel)

The site is already live on Vercel — see `DEPLOYMENT.md` for the current state, release flow and rollback.

**STOP: Do not deploy or change DNS without Ezekiel's approval.**

## Assets Required

See `ASSETS.md` for the full list of placeholder replacements needed.

## Legal

Draft legal pages are in `app/(legal)/`. All require attorney review before the site goes live.

The gym collaboration draft at `/gym-collaboration-draft` is marked noindex and must not be shared publicly without Ezekiel's approval.

## Actions Requiring Ezekiel's Approval

- Deploying to Vercel
- Connecting ezeirl.com domain
- Activating email provider
- Activating analytics
- Sending the gym collaboration outreach
- Publishing any sponsored or affiliate content
- Creating external social accounts
