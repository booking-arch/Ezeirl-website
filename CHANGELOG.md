# CHANGELOG.md — EZE IRL Website

All notable changes to this project are documented here.

---

## [Unreleased] — `feat/ecosystem` — EZE ecosystem (EZE IRL · EZE-FIT · EZE // FORM)

### 2026-09-30 — EZE IRL website accounts
- **Log in** is at `/login`. **Create account** is at `/register`. A signed-in person lands on `/account`, can change their password, and can log out.
- Accounts live in `site_accounts` / `site_sessions` (migration `0004`). On this machine they are stored in `data/site-accounts.sqlite`, which is not committed. When `DATABASE_URL` is set, they use that Postgres database instead. On Vercel, with no database configured, sign-in answers that accounts are unavailable. Changing a password ends the older sessions.
- This login is the public website only. `/eze-fit` still has no login and does not link to the private app.

### 2026-09-30 — public content journal
- **`/content`**: index of the ten approved EZE IRL photographs, grouped as training, fitness, and lifestyle. Each card links back to the homepage section that already shows that photo. No video is listed. `config/content.ts` rejects a video entry unless its URL is the confirmed account in `config/social.ts`.
- Homepage Watch section’s primary action is now **EXPLORE THE PHOTOS** (`content_click`). YouTube, TikTok, and Instagram buttons still render only when those URLs are set, and then fire `social_click`. Footer social links do the same.
- Mobile menu includes CONTENT. The header **JOIN IRL** button now goes to `/#community` from every page, including `/partnerships` and `/content`.
- Removed the unconfirmed `twitter.creator` value `@ezeirl`. X is still `url: null` in `config/social.ts`.
- `robots.txt` now disallows `/intake` and `/client-portal`. Neither route is in the sitemap.

### 2026-09-22 — production-launch completion pass
- **New `/partnerships`** page: dedicated route reusing the verified `PartnershipSection` content, own SEO metadata, `ContactPage`/`ContactPoint` structured data (email only, no phone), nav updated to link here instead of the homepage anchor.
- **Community signup fixed**: `CommunitySection` previously checked a never-configured `env.emailProvider` and faked a success response with `setTimeout` — collected nothing, ever. Rewired to the real gated `/api/waitlist` (interest `eze_irl_community`, source `homepage`) via the shared `WaitlistForm`, which gained an `"irl"` tone. Verified end-to-end (invalid email, valid + consent, success state, real POST body) against a live dev server.
- **Fixed a hydration bug introduced during that rewiring**: `isWaitlistEnabled()` was called directly inside the (`"use client"`) `CommunitySection`, which reads a server-only env var — correct during SSR, `undefined` after hydration in the browser, so the form and its disabled-state sibling disagreed and React silently remounted the wrong one. Fixed by computing the flag in the server component (`app/page.tsx`) and passing it down as a prop, the same pattern `/eze-fit` and `/merch` already used correctly.
- **Waitlist schema widened** (additive migration `0002_waitlist_community.sql`): new interest `eze_irl_community`, new sources `homepage`/`partnerships`. Verified on disposable Postgres: applies idempotently, accepts the new values, still rejects invalid ones.
- **Removed dead code**: `config/env.ts` (the fake email-provider gate, now unreachable) and its five stale doc references (`AGENTS.md`, `ARCHITECTURE.md`, `DECISIONS.md`, `README.md`, `SECURITY.md`), rewritten to describe the real `WAITLIST_ENABLED` gate.
- **Branded error handling**: `app/error.tsx` (route-segment crashes) and `app/global-error.tsx` (root-layout crashes) replace Next's generic error page; neither ever renders the underlying error to the visitor.
- **Security regression suite** (`tests/security-boundary.test.tsx`): fails if any page ever renders a `127.0.0.1`/tailnet/`fit-mate`/localhost-with-port URL, an off-site link, or a link into `/admin`/`/dashboard`; also scans the compiled `.next/static` output (what the browser actually downloads) when a build is present.
- **Analytics**: added `eze_irl_community_signup`, `partnership_cta`, `social_click`, `content_click` events; `Button.tsx` now forwards `onClick` on href/mailto links (it silently dropped it before) so the partnership CTA can be tracked.
- **Docs**: `docs/admin-observability.md` (no admin panel built — documents the safer alternative), `docs/assets/asset-audit-2026-09-22.md` (consolidated missing-asset report, re-verified against Drive).
- Added `images.qualities: [75, 80]` to `next.config.ts` (Next 16 forward-compat; was a build warning).
- 106/106 tests passing (was 95); 0 axe violations across all 8 public routes, desktop + mobile.

### Added
- `/eze-fit` (private-beta product page, scroll-driven phone story, two separate waitlists, FAQ, disclaimers) and `/merch` (EZE // FORM, Drop 001 coming soon, real-asset gallery architecture, early access).
- Homepage EZE-FIT and EZE // FORM reveals; ecosystem cross-links (footer, strip); contextual nav CTA; intentional mobile menu (Escape, scroll lock, focus return).
- Waitlist: `/api/waitlist`, normalized contact + per-list interest schema (Neon Postgres), validation, honeypot, same-origin check, rate limit, no enumeration, **gated by `WAITLIST_ENABLED` (default off)**.
- Analytics abstraction (`lib/analytics.ts`, 8 events, allow-listed props, GPC/DNT); no provider installed.
- Asset architecture (`config/assets.ts`, `public/eze-{fit,form,irl}/`), motion tiers (static/lite/full), Vitest suite, sitemap + metadata + JSON-LD for both routes, `robots.txt` hides `/api/`.
- Docs: EZE-FIT feature-verification matrix, production baseline, corrected `DEPLOYMENT.md`.

### Changed
- **Fonts now actually load.** The Google Fonts `@import` sat below the `@tailwind` rules, so browsers ignored it and Bebas Neue / Inter / JetBrains Mono never rendered in production. Now self-hosted via `next/font` (preloaded, metric-matched fallback). Visible change to the live homepage typography (toward the intended design); CLS 0.09 → 0.
- Navigation: EZE IRL · EZE-FIT · MERCH · STREAM · PARTNERSHIPS (+ WATCH, COMMUNITY in the mobile menu).
- `PerformanceLab`: removed an invented statistic ("90% hydration") and an unsupported claim ("tested for real results").

### Homepage redesign — approved EZE IRL template + professional photography
- New editorial homepage: **Hero** (real photo, distressed "DISCIPLINE CREATES" + green brush "Freedom", pill CTAs, side rail) → **Story** ("This is EZE IRL", photo mosaic) → **Tile strip** (Fitness / Lifestyle / EZE-FIT with the real app screen / EZE // FORM / Content) → **Training** (hairline pillar list, feature photo, snap-scroll gallery) → **Lifestyle** → EZE-FIT and EZE // FORM reveals → Stream / Performance Lab / Watch / Partnerships / Community (kept) → **closing CTA** → footer.
- 10 professional photos from the approved set (WebP, focal points, alt text); 4 excluded with reasons: `docs/assets/eze-irl-photos.md`. Masters stay outside the repo.
- Design system: token values remapped from red/gold to near-monochrome + neon green (`#1fe082`) + warm off-white; pill CTAs for EZE IRL; film grain, dry-brush mask, restrained photo grade; Permanent Marker script (Apache 2.0, self-hosted, latin).
- Motion: clip-path image reveals, restrained parallax (capable desktops only), hero entrance; all disabled for reduced motion and never required (content is visible without JS).
- Removed the Three.js hero emblem: homepage raw JS ~1036 KB → ~540 KB; Three.js no longer loads anywhere.
- Fixed: `mask-reveal` targets could never reveal (Chrome excludes a fully clipped target from IntersectionObserver); the observed wrapper is now unclipped.
- Deliberately not carried over from the concept: fake EZE-Fit UI, "Powered by AI / Backed by science", "AI Coach", "Real results".

### Phase 2 (real assets + polish)
- **Real EZE-FIT screens** (Nutrition targets, Exercise library, FitPoints) captured from a production-mode build with no feature flags and a synthetic demo account; wired into the hero, homepage reveal and the pinned phone story. The Research chapter stays on the branded splash (HOLD). Provenance: `docs/assets/eze-fit-media.md`. Phone screen now sits below the device's dynamic-island band.
- Chapter copy aligned to what the captured screens show ("targets", "exercise library with instructions", FitPoints for "completed workouts and nutrition days").
- **Contrast:** zero axe violations on `/`, `/eze-fit`, `/merch`, `/privacy` at desktop and mobile. `brand.subtle` #555 → #858585; small red eyebrows use the bright red; dimmed display headings raised to 80 %. Footer links and nav logo now 44 px tall. Legal pages: skip link now has a target (`#main-content`), mailto links underlined.
- **Placeholders removed:** Performance Lab "PRODUCT IMAGE" boxes / "PARTNER SLOT OPEN" / "disclosure will appear here"; Watch section fake video cards with play buttons and the unsupported "New content drops weekly" claim; "(account pending)". Replaced with branded coming-soon states.
- **Fonts self-hosted** (`app/fonts/`, `next/font/local`, docs/fonts.md): builds no longer contact Google.
- Homepage `<link rel="canonical">` added. Domain-routing findings documented (docs/domain-routing.md); nothing changed.
- EZE // FORM imagery: acquisition blocked (no `clothing` folder or images in the authorized Drive tree). Import procedure ready: docs/assets/eze-form-drop-001.md.

### Fixed during final verification
- `/eze-fit`: pinned phone overlapped the section header on tall viewports (sticky offset used a translate); now viewport-aware.
- Mobile menu overlay used `bg-black/98` (not in Tailwind's scale, so no background at all — the page showed through); now opaque `bg-black/95`. Same bug existed in the original menu.
- Cross-link cards used `border-white/12` (no CSS generated → default light-gray border); now `border-white/10`.
- Copy tightened to verified facts: removed "invitations go out in waves", "we will reach out / be in touch", "get one email", "hear first / see it first", and reworded FitPoints to "completed workouts and nutrition days".
- Footer ecosystem links: contrast (#555 → muted) and 44px tap height. Focus moves to the invalid field on a failed submit.
- Per-route OpenGraph/Twitter images for `/eze-fit` and `/merch` (typographic only).

### Removed
- Legacy `AppSection` (fake phone UI, unverified AI-coaching / muscle-visualization / challenges claims, red/gold "Fit-Mate" branding), `GearSection` (invented product categories/claims), `config/fitmate.ts`.

## [1.0.0] — 2026-08-28 — Initial Build & Launch Preparation

### Added
- Complete Next.js 15 / React 19 / TypeScript / Tailwind CSS / Framer Motion website
- Custom App Router structure with `(legal)` route group for shared layout
- Homepage with all sections:
  - Hero (with imperative Three.js 3D emblem, WebGL fallback, reduced-motion support)
  - IRL Section
  - Stream Section (Sept 5 2026 countdown, Pacific time, guards against negative countdown)
  - Gear Section (all categories "coming soon", no purchase links)
  - Performance Lab Section
  - Fit-Mate / App Section (waitlist state)
  - Watch Section (no fake video links)
  - Partnership Section
  - Community Section (no-provider guard — no form shown until email provider is configured)
  - Footer (null social URLs render "SOON" badges)
- Legal pages: Privacy, Terms, Sponsorship Disclosure, Filming Policy, Accessibility, Contact
- Config system: `brand.ts`, `social.ts`, `links.ts`, `stream.ts`, `fitmate.ts`, `env.ts`
- Security headers: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- Sitemap generation (`app/sitemap.ts`)
- Robots.txt
- Custom 404 page (`app/not-found.tsx`)
- OG image generation via `next/og` (`app/opengraph-image.tsx`)
- Skip link for keyboard accessibility
- `prefers-reduced-motion` handling in CSS and Three.js component
- ARIA landmarks, labels, roles throughout all components
- Navigation: mobile menu with `role="dialog"`, `aria-modal`, close button, `aria-controls`
- Documentation: ASSETS.md, ARCHITECTURE.md, CONTENT.md, SECURITY.md, ACCESSIBILITY.md, DECISIONS.md, CHANGELOG.md, DEPLOYMENT.md, AGENTS.md, README.md

### Technical Decisions
- Three.js used imperatively (bypasses R3F / React 19 conflict)
- All social URLs `null` until confirmed — no fabricated handles
- Email collection disabled until provider is approved
- Static site generation — no server-side compute
- No venue named — location pending written authorization
- No Twitch account confirmed — `platformUrl: null`, "WATCH ON TWITCH" button hidden

### Build Status
- `npm run build` — 11 static pages, zero TypeScript errors
- `npm run typecheck` — clean
- `npm run lint` — clean

---

## Upcoming

- [ ] Replace hero portrait placeholder with actual creator photo
- [ ] Add hero background (video or high-quality image)
- [ ] Generate and add `public/apple-touch-icon.png` (180×180)
- [ ] Generate and add `public/images/og-image.jpg` (1200×630) for fallback browsers
- [ ] Confirm and set Twitch account URL
- [ ] Confirm and set social platform URLs
- [ ] Select email provider, sign DPA, activate community form
- [ ] Add video thumbnails for Watch section
- [ ] Add Fit-Mate app screenshots
- [ ] Confirm stream venue and update location note
- [ ] Harden CSP: replace `unsafe-inline` with nonce-based policy

### /eze-fit rebuilt as an exact replica of the real app's own landing page (2026-09-22)
Owner request: match http://127.0.0.1:3005/ — the live EZE-FIT app's own production homepage —
layout-for-layout and word-for-word. Replaced the previous Bebas/lime editorial design and pinned
phone story with a structural and visual match of the real page's copy, section order, and color
system (emerald/cyan/slate, rounded cards, `font-black` headlines). Read the app's own `page.tsx`
and `globals.css` directly rather than reverse-engineering screenshots. Two deliberate adaptations
since this static marketing page has no session and no public login: "Log in" scrolls to the
beta-signup form instead of an account system that doesn't exist here; the footer's "Log in /
Create account" pair is a link back into the EZE ecosystem instead. Email capture reuses this
site's own gated `/api/waitlist` with the real form's single-field layout (no name field, no
consent checkbox). One intentional deviation from "exact": five caption/footer text colors
(slate-500 on slate-950, 4.23:1) were bumped to slate-400 to clear WCAG AA — 0 axe violations,
desktop and mobile. Removed `components/eze-fit/{sections,PhoneStory}.tsx` (superseded).

This page's copy (as shipped live by the app itself) exceeds what `docs/eze-fit-feature-matrix.md`
classified as production-safe for `ezeirl.com`'s own marketing voice (e.g. "AI fitness coach",
"Fitness Coach", "Food search + barcode" stated plainly rather than hedged/beta-labeled). It was
used verbatim per explicit instruction to mirror the real, already-live app page exactly, not
independently re-verified against that matrix. Flagged here rather than silently reconciled.

## Unreleased — client intake
- Added `/intake` new-client questionnaire (schema in `config/intake.ts`), `POST /api/intake`, migration 0003. Off by default (`INTAKE_ENABLED`). noindex.
