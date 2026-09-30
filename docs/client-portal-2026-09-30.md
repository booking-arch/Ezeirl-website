# Client portal — implementation and review handoff

Date: 2026-09-30. Local branch: `feat/ecosystem`. Production has not been changed.

## Delivered

- `/client-portal`: exactly two coaching links, Personal Training and Nutrition Coaching. No marketing navigation or extra calls to action. Uses the approved EZE IRL logo, self-hosted fonts, charcoal/green palette and handwritten headline treatment.
- Pointer-reactive cards with decorative Three.js dumbbell and apple sculptures. Three.js loads asynchronously; CSS artwork remains if WebGL is unavailable. Animation pauses off screen/in background tabs, respects reduced motion, and caps resolution and frame rate.
- `/client-portal/personal-training` and `/client-portal/nutrition-coaching`: five questionnaire sections, a review/edit step, explicit consent, validation and actual API submission states. Invalid service paths return 404.
- The original training questions in `config/intake.ts` are unchanged. New nutrition questions and nutrition consent are **drafts for owner and privacy review** in `config/coaching.ts`.
- `/intake` still works as the original full training form. Existing API clients without a service remain training submissions.
- The API validates the selected service against its schema. Unknown answer keys are discarded. The server writes the validated service as `answers.coachingService` in `client_intake_submissions`, with the appropriate consent wording version; no additional migration is needed beyond existing migration 0003. Older rows without `coachingService` are personal training.
- Answers remain only in React memory before submission; no local storage, analytics events, URL payloads or third-party form service. Successful submission clears answers and focuses confirmation. Retryable failures retain answers.
- Portal and questionnaire routes have `noindex, nofollow` metadata and are omitted from the sitemap. This is direct-link onboarding, not an authenticated account dashboard; no submitted client records are exposed through the portal.

## Context checked

Read the war-room README and authenticated task/channel history with `bos-task` and `bos-say --as Codex`. No token was opened or printed. No task was marked DONE and no messages were posted.

The `eze` channel confirmed yesterday's `/intake` work, the unchanged privacy gate and Claude's QA branch. Reviewed `qa/claude-review:docs/qa-2026-09-29.md`: 121 tests passed then; real database, iOS Safari and screen readers were untested. That branch's separate legal-link accessibility change has not been overwritten or merged. No existing portal task was listed on the board.

## Validation

- TypeScript check passed; lint passed (initial implicit image-alt warnings corrected with explicit alt attributes).
- Browser tests used Chromium and synthetic data only. The local dev process explicitly had an empty `DATABASE_URL`, so successful POSTs used the development memory store. No real records were submitted.
- Both flows passed: required field errors and focus; retaining answers through Back; training goal cap; review/edit; consent required before any network request; server failure retaining answers and successful retry; HTTP 200 from local `/api/intake`; confirmation focus and clearing inputs.
- Checked 320, 390, 768 and 1440 px widths: no horizontal overflow. Both WebGL sculptures rendered; no page exceptions. Reduced motion disables card transforms. Unknown service returns 404.
- Production build passed with zero lint/type errors. A post-build TypeScript check and **128 tests passed**. Existing test-environment Framer Motion / Next Image deprecation notices remain.
- Production browser checks passed: exact two-choice navigation by keyboard; both intake paths disabled; API returns `503 disabled`; responsive widths including a 1280 × 720 laptop; reduced motion; WebGL unavailable fallback; links working without JavaScript; homepage still loads. No page exceptions.

## Live hosting mismatch discovered during release verification

Read-only HTTP checks on 2026-09-30 found that `https://ezeirl.com/` and `/client-portal` serve a client-rendered HTML shell with `/assets/index-CQcPpWHX.js` and `/assets/index-BL9LN-9V.css`, rather than this Next.js build. `www.ezeirl.com` redirects to `ezeirl.com`. This contradicts the older Vercel routing notes in `DEPLOYMENT.md` and `docs/domain-routing.md`; do not use those notes to choose a deployment target.

Live Chromium inspection confirmed `/client-portal` renders the existing homepage, not a portal. The homepage retains the dark, green, condensed-heading and handwritten-accent brand direction used here.

An older, related built artifact exists at `C:/Users/EzequielCruz/Documents/eze-fit-staging/site-preview/` (same stylesheet filename, JS `index-CjvCDWPq.js`). That directory contains built assets only, not the source or current hosting configuration. The war-room current-state file points to this Next.js repository; its remote GitHub repository is also Next.js. The connected Sites account has no EZE IRL project. The live project's source/hosting location has been requested from the owner. **Resolve this before any deployment; do not replace the live homepage with this repository by assumption.**

## Release status and prerequisites

1. Owner review of the two-choice layout and the new nutrition questions.
2. **Ezekiel approved deployment in chat on 2026-09-30.** Locate the source repository and production deployment project that produce the current live Vite bundle. Deployment cannot safely continue against an unverified project: this build is Next.js and the current public site is Vite.
3. Intake stays OFF until the privacy policy is attorney-reviewed, as required by `AGENTS.md` and confirmed in the war room. The current privacy draft still says health data is not collected; counsel needs to address both coaching flows, actual storage/access/retention and consent before activation.
4. For real submissions: provision/verify `DATABASE_URL`, apply existing migration 0003 and verify the real database path before setting `INTAKE_ENABLED=true`. There is no automatic email notification integration in this change. The owner reviews submissions through authenticated database access.

No production deploy, environment update, DNS change, database migration, email or waitlist activation was performed.

Deployment approval is recorded; it does not override the need to identify and verify the actual site source and production target. `AGENTS.md` says, “Do not deploy without Ezekiel's approval”. That requirement is met; target identification remains open.

## Review artifacts

- Local production preview: `http://127.0.0.1:3100/client-portal` (intake OFF).
- `docs/client-portal/desktop.png` and `mobile.png`: production screenshots.
- `docs/client-portal/flow-results.json`: synthetic-data questionnaire checks.
- `docs/client-portal/production-results.json`: production navigation, gate and fallback checks.
- Browser harnesses and additional screenshots: `C:/Users/EzequielCruz/Documents/Codex/2026-09-30/client-portal-qa/`.
