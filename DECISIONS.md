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

**Decision:** `env.emailProvider` is `null`. The community form shows "coming soon."

**Reason:** Collecting email addresses requires a signed DPA with the provider, an updated privacy policy, and a compliant unsubscribe flow. None of these were in place at launch prep. The guard in `CommunitySection.tsx` prevents any form from rendering when `emailProvider` is null — this is not just a UI choice but a data governance decision.

**Path to activation:**
1. Select a provider (Buttondown, ConvertKit, Klaviyo, etc.)
2. Sign DPA
3. Review and update privacy policy
4. Set `env.emailProvider` and add API key to `.env.local`
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
