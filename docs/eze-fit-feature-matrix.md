# EZE-FIT Feature Verification Matrix

Internal reference. **Not published.** Governs every product claim on `/eze-fit` and the homepage.
Prepared 2026-09-21 on `feat/ecosystem` from the EZE-FIT repo (`~/projects/fit-mate`).

## Method and limits

Evidence used: source code (routes, gating, services), committed test suites/E2E specs and the
app's own audit docs, the running production stack's *container state* (`/api/health`, which
containers are up). **Not used:** production database contents (access was blocked by policy) and
authenticated production sessions. Therefore *content volumes* (how many approved studies, how
many foods) are **unverified** and must never be quoted.

### Gating finding (important)

`productFeatureEnabled()` is true whenever `NODE_ENV !== "production"`. In production a gated
feature needs `FEATURE_<NAME>=true`; `.env.production` sets **none** and `compose.production.yml`
passes none. `getFeatureFlags()` has no consumers, so most declared flags (`AI_COACH`,
`RESEARCH_RAG`, `NUTRITION_V2`, …) are documentation only, not enforcement. Consequence: any
screenshot taken from `npm run dev` or the E2E harness (`NODE_ENV=test`) shows features that a
production tester will **not** see. Captures must come from a production-mode build with
production-equivalent flags.

### Status key

CONFIRMED = working and safe to advertise. LIMITED = exists, careful wording required.
BETA = only with explicit beta context. PLANNED / DISABLED = never advertise as available.

## Matrix

| Feature | Status | Evidence | Marketing language | Restrictions |
|---|---|---|---|---|
| Account, login, onboarding | CONFIRMED | Argon2 + signed sessions; E2E auth/profile; resumable `/onboarding` | "Invite-only accounts" | Do not describe security beyond "private account". |
| Meal logging, daily calorie & macro totals | CONFIRMED | `GET/POST /api/nutrition/meals`, server-calculated macros, E2E nutrition journeys, unit tests | "Log meals and see calories, protein, carbs and fat" | Numbers are estimates. No accuracy claims. |
| Calorie / macro / protein targets | LIMITED | Deterministic Mifflin-St Jeor engine (`nutrition-energy.ts`), guardrails, 6-test edge matrix (RC1 doc) | "Personalized calorie and macro *estimates* based on your profile" | Not medical advice. No result guarantees. Constants are an application rule, not individually cited. |
| Food search, custom foods, custom meals, date navigation | DISABLED in prod | Gated by `FEATURE_*`; none set in `.env.production` | Do not mention | Re-verify after production flags change. |
| Water / weight / favorites / saved meals | LIMITED (unverified exposure) | RC1 migration `…water_weight_favorites_usage_savedmeals`; UI exposure in prod not confirmed | Do not mention until confirmed | Needs owner confirmation. |
| Barcode scanner | BETA | Camera UI (`@zxing/browser`) + `/api/nutrition/foods/barcode/[code]`; no real-device test; catalog coverage unknown; USDA key pending | "Barcode scanning (beta)" at most | Never imply broad coverage. Show only with beta context. |
| Workouts, programs, exercise library | CONFIRMED | `/api/programs`, `/api/workouts`, completion idempotency, two-user IDOR E2E, seeded exercises | "Build programs, log workouts, browse exercises" | No injury/form-coaching claims. |
| Progress (measurements, trends, timeline) | LIMITED | Progress V2 routes + tests; private photo storage | "Track measurements and trends over time" | Photos stay private; never show real photos. |
| Photo / body-fat analysis | DISABLED | `PHOTO_ANALYSIS` off; docs: never exact body-fat | Do not mention | — |
| Research pipeline (PubMed, Crossref, ClinicalTrials.gov, FDA, NIH ODS) | LIMITED | Discovery smoke test passes; discovery stores *unapproved* studies | "Research sources are reviewed before they appear in the app" | Never claim study counts, "evidence-based results", or that content is exhaustive. |
| Research Memory (approved claims only) | LIMITED | Approved-only reads; admin review workflow | "Approved research summaries with sources" | Volume unverified — do not quantify. No health/medical outcome claims. |
| Learn (education, quizzes) | LIMITED | `/learn`, `learn.spec.ts`; content volume unverified | "Educational content" only if reconfirmed | Do not quantify. |
| Supplements (intelligence, stack, intake log) | BETA — excluded | Sensitive domain; safety docs exist; evidence policy | Do not market | Highest claim risk (dosage/health). Excluded. |
| AI Coach (Hermes / local LLM) | DISABLED | `ollama` service defined but **not running** in prod stack; `hermes.ts` restricts to localhost; cloud providers off | Do not mention | Removes the legacy "AI coaching / real-time form feedback" claims. |
| Any cloud AI, BYOK, weekly review | DISABLED | Flags off; docs say intentionally disabled | Do not mention | — |
| Health dashboard / connected health | DISABLED in prod | `HEALTH_DASHBOARD_V2` gated off | Do not mention | — |
| Apple Health / HealthKit | PLANNED | Native source written, XCTest **not executed**, no device run | "Apple Health — planned" only if desired | Never claim sync works. |
| Health Connect / Samsung Health | PLANNED | Partner approval / native shell pending | Do not mention | — |
| FitPoints | LIMITED | Server-calculated, caps + idempotency tests; `/fitpoints` | "Earn points for consistency" | No prizes/rewards claims. Streak wording per policy doc. |
| Leaderboard | LIMITED — excluded | Public fields only; privacy/opt-in not confirmed | Do not market | Involves real users' data; exclude. |
| USDA FoodData Central search | PLANNED | `USDA_FDC_API_KEY` not provisioned | Do not mention | — |
| Native iOS / Android apps | PLANNED | Web app only; beta reached via private Tailscale access | "Private beta, by invitation" | No store links. No date promises. |

## Claims this site may make (derived)

Track meals against calorie and macro targets · Plan and log workouts · Watch progress over time ·
Sourced research summaries (beta, reviewed) · Points for consistency · Private beta by invitation.

## Claims removed from the legacy site

"AI Coaching — real-time form feedback and adaptive programming" · "Muscle Visualization" ·
"Challenges & Streaks — compete, get rewarded" · "Body composition" (as headline) ·
"Personalized Programs" as a promise of outcomes · the red/gold "Fit-Mate" name.

## Disclaimers required on `/eze-fit`

Not a medical device or medical advice; estimates only; consult a qualified professional; results
vary; beta software may contain errors.

## Open items for owner

1. Confirm which RC1 features (water/weight/favorites/saved meals, date navigation) are live for testers.
2. Provide screenshots/recordings, or approve production-mode capture from a demo account.
3. Approve final wording of the "research reviewed before shown" line.
