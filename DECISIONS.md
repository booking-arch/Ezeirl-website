# DECISIONS.md — Key Technical and Product Decisions

## Why Imperative Three.js Instead of React Three Fiber (R3F)

**Decision:** Use Three.js directly in `useEffect` rather than `@react-three/fiber`.

**Reason:** React Three Fiber 8.x does not cleanly support React 19 concurrent rendering features. The root-level `createRoot` API and fiber reconciler in R3F 8 conflicts with React 19's scheduler. Using imperative Three.js in a standard `useEffect` sidesteps this entirely — the canvas is owned by Three.js; React manages only mount/unmount and the boolean state that toggles the effect.

**Trade-off:** Lose declarative scene management, hooks like `useFrame`, and Drei helpers. Gain stability and zero peer dependency conflict warnings at build time.

**Future:** When R3F releases a version with React 19 support, the 3D emblem can be migrated.

---

## Why All Social URLs Are Null

**Decision:** Every social platform URL in `config/social.ts` is `null` until confirmed.

**Reason:** Publishing an unverified or placeholder URL (e.g., a wrong username, or a URL that doesn't exist yet) damages trust and can result in users clicking dead links or links to unrelated accounts. The footer handles `null` gracefully by rendering "SOON" badges.

**Policy:** A social URL is only set when:
1. The account is verified as owned by EZE Media
2. The handle is confirmed active and posting
3. The URL is tested and resolves correctly

---

## Why No Email Provider is Active

**Decision:** `WAITLIST_ENABLED` is not `true` by default. The community form (and every other waitlist form) shows "coming soon."

**Reason:** Collecting email addresses requires an updated, attorney-reviewed privacy policy and a compliant unsubscribe flow. The guard in `lib/waitlist/handler.ts` prevents the API from parsing or storing anything while the flag is off — this is not just a UI choice but a data governance decision, enforced server-side. (Superseded the original `env.emailProvider`-based design, which never had a real backend — see ARCHITECTURE.md.)

**Path to activation:**
1. Select a provider (Buttondown, ConvertKit, Klaviyo, etc.)
2. Sign DPA
3. Review and update privacy policy
4. Attorney-review the privacy policy, then set `WAITLIST_ENABLED=true` and provision `DATABASE_URL` (see DEPLOYMENT.md)
5. Wire the submit handler

---

## Why Static Site Generation (SSG)

**Decision:** The entire site is statically generated (no `use server`, no database, no dynamic routes with params).

**Reason:** The site is a content-and-brand presence, not an application. SSG gives:
- Best possible performance (pre-rendered HTML)
- Zero server-side compute cost
- Easy CDN distribution (Vercel, Cloudflare Pages)
- Maximum reliability for a launch event

**Trade-off:** Any content change requires a redeploy. Acceptable at this stage.

**Update 2026-09-30:** The marketing pages stay static. `/login`, `/register`, `/account`, and `/api/auth/*` are dynamic. See “Why website accounts stay on this site.”

---

## Why website accounts stay on this site

**Decision:** `/login`, `/register`, and `/account` are EZE IRL website accounts. They are not EZE-FIT accounts, and this site does not link to the private app.

**Reason:** The owner asked for a login that is ready to use on this Next.js site. The private EZE-FIT app stays invitation-only and off the public pages. `/eze-fit` remains a beta-interest page with no login. `/client-portal` stays a coaching questionnaire, not an account gate.

**How it works:** Passwords are scrypt hashes. The `eze_session` cookie is HttpOnly and holds a random token; the database stores only the SHA-256 of that token. Changing the password ends the older sessions and sets a new cookie. With no `DATABASE_URL`, this computer stores accounts in `data/site-accounts.sqlite` (gitignored). When `DATABASE_URL` is set, migration `0004_site_accounts.sql` is the Postgres schema. On Vercel, with no database URL, sign-in returns unavailable instead of pretending an account was saved. Waitlist and health intake stay off.

---

## Why No Gym/Venue is Named

**Decision:** Stream location is described as "pending written authorization from facility" — no gym or venue is named.

**Reason:** Naming a venue implies approval. No written approval from any facility exists at build date. Naming without approval could:
1. Create false advertising / misrepresentation
2. Cause the event to be denied by the facility
3. Expose the brand to legal liability

**Policy:** A venue is only named after written authorization is received and confirmed.

---

## Why the (legal) Route Group

**Decision:** Legal pages live in `app/(legal)/` with a shared layout.

**Reason:** Route groups in Next.js App Router allow shared layout without adding a URL path segment. `/privacy` resolves to `app/(legal)/privacy/page.tsx`. This gives all legal pages a consistent back-navigation header and footer without duplicating the layout in each file.

---

## Why Tailwind 3 Not 4

**Decision:** Tailwind CSS 3.x used (not 4.x alpha/RC).

**Reason:** Tailwind 4 was in alpha/RC at build date. Next.js 15 integration with Tailwind 4's new CSS-first config approach was not stable. Tailwind 3 has full support with `postcss.config.mjs`.

---

## Ecosystem Decisions (2026-09)

- **Waitlist off by default.** Built and tested completely, but `WAITLIST_ENABLED` must be `true` to collect anything (AGENTS.md legal gate). Enabling is configuration, not a redesign.
- **Contacts + interests, not one row per product.** One email = one contact; each list is an interest row, so a person on all three lists is not three conflicting records. Gmail dots/plus-tags are intentionally *not* collapsed.
- **Repeat signups look identical to new ones** so the endpoint cannot be used to test whether an address is on a list.
- **Neon via the serverless driver,** not a full ORM: two tables and one statement do not justify Prisma.
- **In-process rate limiting** (documented limitation) behind an interface; DB constraints keep data correct regardless.
- **Vitest without jsdom/testing-library:** logic + `react-dom/server` render tests cover the risk (claims, gate, placeholders) without a heavy stack.
- **No new animation library.** CSS/IntersectionObserver for reveals, existing Framer Motion for tilt/drift; Three.js is not used on the new pages.
- **`next/font` instead of the CSS `@import`.** The `@import` was invalid (after `@tailwind`) so fonts never loaded; self-hosting also fixes CLS.
- **EZE-FIT claims are derived from evidence,** not route names: `docs/eze-fit-feature-matrix.md`. Production flags differ from dev (`FEATURE_*` are unset in production), so dev screenshots would over-represent the product.
- **Placeholders never ship as products:** missing assets render a labelled box only outside production.
