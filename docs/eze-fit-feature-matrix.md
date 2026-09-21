# EZE-FIT Feature Verification Matrix (final)

Internal reference, **not published**. Governs every product claim on `/eze-fit`, the homepage, metadata,
OpenGraph, structured data, FAQ and CTAs. Verified 2026-09-21 on `feat/ecosystem` against the EZE-FIT repo
(`~/projects/fit-mate`) and its running production stack.

## Method and limits

Evidence: source code (routes, gating, services), committed tests / E2E specs, the app's own audit docs,
and the *running stack state* (`/api/health`, which containers are up).
**Not available:** production database contents (access was blocked), authenticated production sessions,
physical devices. Therefore content volumes (approved studies, foods) are **unverified** and never quoted.
A route existing is never treated as proof a feature works.

### Gating finding

`productFeatureEnabled()` is true whenever `NODE_ENV !== "production"`. In production a gated feature needs
`FEATURE_<NAME>=true`; `.env.production` sets **none** and `compose.production.yml` passes none.
`getFeatureFlags()` has no consumers, so most declared flags (`AI_COACH`, `RESEARCH_RAG`, …) are documentation,
not enforcement. Screenshots from `npm run dev` / the E2E harness (`NODE_ENV=test`) therefore show features a
production tester will **not** see. Capture only from a production-mode build with production-equivalent flags.

Classifications: **CONFIRMED** working and safe · **LIMITED** exists, careful wording · **BETA / EXPERIMENTAL**
only with explicit beta context · **PLANNED** / **DISABLED** never advertised as available.

| Feature | Status | Evidence | Marketing safe? | Approved wording | Restrictions |
|---|---|---|---|---|---|
| Nutrition (overall) | LIMITED | Meal logging + targets are ungated and E2E-tested; several sub-features are flag-gated off in prod | Yes, scoped | "Track your meals" | Name only the specific sub-features below |
| Meal logging | LIMITED | Verified in production mode: preset-meal buttons (dashboard: 3, Nutrition: 1 catalog meal) + a recipe builder; server-calculated macros. **No food search, custom foods or barcode lookup** (flag-gated off / empty catalog) | Yes, narrow | "Log meals" (no "any food" claims) | Do not imply a searchable food database |
| Calories | LIMITED | Deterministic Mifflin-St Jeor engine, guardrails, 6-test edge matrix (RC1 doc) | Yes, hedged | "Calorie and macro estimates from your profile" | Not medical advice; constants are an app rule, not individually cited |
| Macros | LIMITED | Same engine; macro ranges from calories/body weight | Yes, hedged | (as above) | Estimates only |
| Protein | LIMITED | Protein target range in engine (g/kg by goal); ceiling guardrail | Yes, hedged | "…calories, protein, carbs and fat against your daily targets" | Never imply optimal or guaranteed intake |
| Barcode scanner | BETA / EXPERIMENTAL | Camera UI (`@zxing/browser`) + `/api/nutrition/foods/barcode/[code]`; no real-device test; catalog coverage unknown; USDA key pending | Only with beta label | "Barcode scanning (beta) — coverage is still being tested" | Never imply broad coverage |
| Workouts | CONFIRMED | `/api/workouts`, completion idempotency, two-user IDOR E2E | Yes | "Log your workouts" | No injury / form-coaching claims |
| Exercises | CONFIRMED | Exercise library route + seeded catalog | Yes | "Browse an exercise library" | Do not quantify the catalog |
| Programs | CONFIRMED | `/api/programs` + activate; owner-scoped E2E | Yes | "Build programs" | No outcome claims |
| Progress | LIMITED | Verified in production mode: weight trend, body composition, measurements render for a new account | Yes, hedged | "Follow measurements and trends over time" | No photo analysis; page also shows photo/scan-import sections — capture only the top; app typo "1 tracked exercises" |
| Research (tools) | LIMITED | `/api/research/*`; discovery smoke passes; discovery stores *unapproved* studies | Yes, beta-labelled | "Research tools are in beta" | Never claim study counts or "evidence-based results" |
| Research Memory | LIMITED | Approved-claims-only reads; admin review workflow | Yes, hedged | "Sources are reviewed before summaries appear in the app" | Volume unverified; **owner to confirm wording** |
| PubMed | LIMITED | Provider primitives (DOI/PMID, design classification); smoke reachable | Not named in copy | — | Discovery only; do not cite as a coverage claim |
| Crossref | LIMITED | Provider primitive; smoke reachable | Not named | — | Same |
| ClinicalTrials.gov | LIMITED | Provider; smoke reachable | Not named | — | Same |
| FDA data | LIMITED | Provider; smoke reachable | Not named | — | Never imply regulatory endorsement |
| Learn (education) | LIMITED | `/learn`, `learn.spec.ts`; content volume unverified | Not currently used | — | Do not quantify |
| Supplements | BETA / EXPERIMENTAL | Intelligence/stack/intake log; safety + evidence policies exist | **No** | — | Highest claim risk (dosage/health); excluded |
| Coach | DISABLED | `/coach` and a dashboard "AI COACH — Hermes ready" widget **render for testers**, but the `ollama` model service is **not running** in the prod stack; `hermes.ts` localhost-only; cloud providers off | **No** | — | Legacy "AI coaching / real-time form feedback" removed |
| FitPoints | CONFIRMED | Verified in production mode: one completed workout + a protein-target day scored TRAIN 40 / PROTEIN 15 / CONSISTENCY 10 = 65; caps + idempotency tests | Yes, hedged | "Earn FitPoints for completed workouts and nutrition days" | No prizes/rewards; do not claim consistency/streak behavior |
| Leaderboard | LIMITED | Public fields only; privacy/opt-in not confirmed | **No** | — | Involves real users' data; excluded |
| Apple Health | PLANNED | Native source written; XCTest **not executed**; no device run | **No** | — | Never claim sync works |
| Health Connect / Samsung | PLANNED | Native shell / partner approval pending | **No** | — | — |
| Health dashboard (V2) | DISABLED in prod | `HEALTH_DASHBOARD_V2` gated off | **No** | — | — |
| Photo analysis | DISABLED | `PHOTO_ANALYSIS` off; docs: never exact body-fat | **No** | — | — |
| USDA live search | PLANNED | `USDA_FDC_API_KEY` not provisioned | **No** | — | — |
| Food search / custom foods / custom meals / date navigation | DISABLED in prod | Gated by unset `FEATURE_*` | **No** | — | Re-verify if flags change |
| Water / weight / favorites / saved meals | NOT PRESENT | Running production-mode app: none of these controls exist on Nutrition (Hydration is a target only) | **No** | — | Resolved 2026-09-21 |
| AI functionality (any) | DISABLED | Cloud AI, BYOK, weekly review, recommendations flags off; Coach backend not running | **No** | — | No "AI" claims anywhere |
| Native iOS / Android apps | PLANNED | Web app only; private beta access | Only as "not yet" | "Not yet. No store listings or public launch date have been announced." | No store links, no date |

## Claims this site currently makes (all traced above)

Track meals against calorie/macro/protein targets (estimates) · log workouts, build programs, browse exercises ·
follow measurements and trends · earn FitPoints for completed workouts and nutrition days · research tools in beta,
sources reviewed before summaries appear · barcode scanning (beta) · private beta by invitation.

## Removed from the legacy site

"AI Coaching — real-time form feedback and adaptive programming" · "Muscle Visualization" ·
"Challenges & Streaks — compete, get rewarded" · red/gold "Fit-Mate" name · fake phone UI.

## Owner confirmations — status after production-mode verification (2026-09-21)

1. Water / weight / favorites / saved meals: **resolved — not present**. Date navigation, food search, custom foods, meal plan, health dashboard: **resolved — disabled** ("Feature not enabled" / absent).
2. Progress and FitPoints: **resolved — available** to testers.
3. Research Memory wording: still needs the owner. The Research Explorer renders approved topics only (the seed provides one); production content volume is unverified and the page has UI typos, so no Research screen is used on the site (HOLD).

Media provenance and the capture environment: `docs/assets/eze-fit-media.md`.
