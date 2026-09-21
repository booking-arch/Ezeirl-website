# Production baseline — recorded before `feat/ecosystem`

Recorded 2026-09-21 (verified, not assumed).

| Item | Value |
|---|---|
| Production branch | `master` |
| Production commit | `62d182061f7adeb0f8d7d3ca0b0fcc469b7c95d4` (`62d1820`) |
| Remote | `github.com/ezequielcruz91343-max/Ezeirl-website` |
| Live host | Vercel. `ezeirl.com` and `www.ezeirl.com` both return `301` → `https://ezeirl-website.vercel.app/` (observed 2026-09-21T03:00Z) |
| Uncommitted changes at start | `.env.example` (blank line), `package-lock.json` (`engines` sync) — carried onto the branch untouched |
| Vercel deployment ID | Not available from this environment (no Vercel CLI/API access used). Record from the Vercel dashboard before promoting anything. |

## Baseline checks on unmodified code

| Check | Result |
|---|---|
| `npm run typecheck` | pass, no errors |
| `npm run lint` | pass, no warnings |
| `npm run build` | pass, 12 static pages |
| `/` bundle | 19.5 kB route, 163 kB first-load JS (103 kB shared) |
| Routes | `/`, `/privacy`, `/terms`, `/sponsorship-disclosure`, `/filming-policy`, `/accessibility`, `/contact`, `/gym-collaboration-draft`, `/sitemap.xml`, `/opengraph-image`, 404 |

## Rollback

Vercel dashboard → Deployments → the deployment serving production before this work → Promote to
Production (instant, no rebuild). Git: `master` is untouched; nothing merges without approval.
The waitlist adds tables only (additive, no existing tables), so rolling back the site needs no
database rollback.
