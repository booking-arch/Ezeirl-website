# ARCHITECTURE.md — EZE IRL Website

## Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 15.x |
| UI library | React | 19.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.x |
| Animation | Framer Motion | 11.x |
| 3D | Three.js (imperative) | 0.175.x |

## Route Structure

```
app/
  layout.tsx            — Root layout: metadata, skip link, fonts
  page.tsx              — Homepage (all sections rendered server-side shell, client components hydrate)
  globals.css           — Base styles, CSS vars, reduced-motion media query
  not-found.tsx         — Custom 404 page
  opengraph-image.tsx   — Static OG image via next/og ImageResponse (edge runtime)
  sitemap.ts            — Auto-generated sitemap
  eze-fit/page.tsx      — /eze-fit  (EZE-FIT private beta page)
  merch/page.tsx        — /merch    (EZE // FORM, Drop 001 coming soon)
  partnerships/page.tsx — /partnerships
  content/page.tsx      — /content  (approved photography; no unconfirmed video)
  intake/page.tsx       — /intake   (health questionnaire, noindex, INTAKE_ENABLED default off)
  client-portal/        — /client-portal and /client-portal/[service] (noindex, direct-link onboarding)
  api/waitlist/route.ts — POST /api/waitlist (gated by WAITLIST_ENABLED)
  api/intake/route.ts   — POST /api/intake (gated by INTAKE_ENABLED)
  (legal)/              — Route group: shared layout with back navigation
    layout.tsx          — Legal layout: header, back link, footer
    privacy/            — /privacy
    terms/              — /terms
    sponsorship-disclosure/ — /sponsorship-disclosure
    filming-policy/     — /filming-policy
    accessibility/      — /accessibility
    gym-collaboration-draft/ — /gym-collaboration-draft (internal draft)
    contact/            — /contact
```

The `(legal)` route group applies a shared layout (back button, brand header, legal footer) without adding a path segment. All legal pages are statically generated.

## Config System

All site-wide configuration lives in `config/`. Components import from config; no hardcoded values in components.

| File | Purpose |
|------|---------|
| `brand.ts` | Name, tagline, domain, email, description |
| `social.ts` | Social platform URLs — all null until confirmed |
| `links.ts` | Internal routes and mailto links used across components |
| `stream.ts` | Stream event data: date, platform, location, status flags |
| `ecosystem.ts` | Navigation and EZE-FIT / EZE // FORM copy (verified claims only) |
| `assets.ts` | Typed asset manifest; `null` = awaiting approved asset |

## 3D Approach

Three.js is used imperatively inside `useEffect` in `components/3D/HeroEmblem3D.tsx`. This bypasses the React Three Fiber (R3F) / React 19 compatibility conflict (R3F 8.x does not support React 19 concurrent features cleanly as of build date).

Cleanup in `useEffect` return function:
- `cancelAnimationFrame`
- `removeEventListener` (mousemove)
- `ResizeObserver.disconnect()`
- `emblem.traverse()` — disposes geometry and material per mesh
- `renderer.dispose()`

Fallback: SVG emblem renders if WebGL is unavailable or `prefers-reduced-motion: reduce` is set.

## Social / Stream State

- Social URLs: all `null` in `config/social.ts`. Footer renders "SOON" badges for null entries. No fabricated handles or follower counts anywhere.
- Stream: `config/stream.ts` uses `platformUrl: null` — the "WATCH ON TWITCH" button only renders when `platformUrl` is non-null. Countdown guards against negative values with `if (diff <= 0) return zeros`.
- Email/Community: `CommunitySection.tsx` uses the real gated waitlist (`lib/waitlist/*`, interest `eze_irl_community`, source `homepage`). While `WAITLIST_ENABLED` is not `true`, it shows a "coming soon" state — no form is displayed, no email is submitted or logged. (Superseded the old `env.emailProvider` stub, which faked a success response with a `setTimeout` and never actually collected anything — removed 2026-09-22.)
- Gear: all "COMING SOON" badges, no purchase links anywhere.

## Security Headers

Configured in `next.config.ts` via `headers()`:
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Content-Security-Policy` — see SECURITY.md

## EZE ecosystem layer

- **Identities:** EZE IRL (red/gold, existing) · EZE-FIT (`fit.*` tokens: charcoal, lime, emerald, teal) · EZE // FORM (`form.*` tokens: bone on ink). Page wrappers `theme-fit` / `theme-form` scope focus rings and selection.
- **Assets:** `config/assets.ts` → `components/ecosystem/MediaSlot.tsx`. Production never renders a placeholder as if it were a product or app screen.
- **Motion:** CSS + IntersectionObserver reveals (`Reveal`, visible without JS); Framer Motion only for pointer tilt / scroll drift, and only on the `full` tier from `hooks/useMotionTier.ts` (`static` = reduced motion, `lite` = touch/small/constrained, `full` = capable desktop). No WebGL for these pages.
- **Waitlist:** `lib/waitlist/*` — `WaitlistStore` interface (Neon in production; in-memory for tests/dev only), `handler.ts` holds all request logic. Schema: `db/migrations/0001_waitlist.sql` — `waitlist_contacts` (unique normalized email) 1—N `waitlist_interests` (unique per contact+interest; `eze_fit_beta`, `eze_fit_launch`, `eze_form`; status, source, campaign, referral, consent timestamp + wording version).
- **Analytics:** `lib/analytics.ts` — typed events, allow-listed props, no provider until approved.
- **Commerce readiness:** `FormProduct` (id, name, colorway, views: front/back/side/detail/alt) is the seam for inventory, sizes, variants, cart and checkout; `ProductGrid` is the only component that would change.
- **Tests:** `tests/` (Vitest, node env; server-render smoke tests via `react-dom/server`).
