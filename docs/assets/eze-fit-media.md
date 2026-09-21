# EZE-FIT marketing media inventory

Internal. **Not published** (lives in `docs/`, never under `public/`). Every EZE-FIT image or clip used on
ezeirl.com must be listed here with its provenance. `tests/assets.test.ts` fails if a registered screen is
missing from this file.

## Capture environment (2026-09-21)

| Item | Value |
|---|---|
| App source | `~/projects/fit-mate` @ `c10b373` (clean tree; same commit family as the rebuilt production container, image created 2026-09-21T06:28Z) |
| Build | `next build` with `NODE_ENV=production`, isolated `NEXT_DIST_DIR=.next-marketing` (no existing build dir touched) |
| Feature flags | **None set** (`FEATURE_*` absent), matching `.env.production` — so flag-gated features are OFF, exactly as for a beta tester |
| Database | Throwaway Postgres (tmpfs, port 55433), migrations + seed from the committed repo; destroyed after capture |
| Account | Synthetic demo (`*.example.test`); synthetic body data (178 cm / 78 kg); backdated weigh-ins added through the app's own API |
| Viewport | 390×844 CSS px @2x (780×1688), reduced-motion |
| Never captured | real users, real health data, credentials, tokens, production data, the production database |

**Caveat:** the local seed defines the exercise library (12 exercises), the preset meals and one approved research topic.
Production content volume was not accessible and is unverified.

## Approved and in use

| File (public) | Route | Feature | Classification | Marketing safe | Used at |
|---|---|---|---|---|---|
| `eze-fit/screens/nutrition-targets.webp` | `/nutrition` | Daily calorie / protein / carb / fat / fiber / hydration targets with "Why?" | LIMITED (estimates) | Yes, "targets" wording only | `/eze-fit` hero + TRACK chapter; homepage EZE-FIT reveal |
| `eze-fit/screens/exercise-library.webp` | `/exercises` | Exercise library: muscle groups, instructions, filter | CONFIRMED | Yes | `/eze-fit` TRAIN chapter |
| `eze-fit/screens/fitpoints-score.webp` | `/fitpoints` | FitPoints daily score and categories | LIMITED | Yes, "completed workouts and nutrition days" | `/eze-fit` PROGRESS chapter |

Crops: the exercise capture starts below the app's mobile nav strip because that strip lists Coach, Supplements,
Health and Secrets (excluded features). Each capture was scanned for excluded-feature text before acceptance.

## Captured but NOT used (masters outside the repo)

| Master | Route | Reason held |
|---|---|---|
| `progress-trend.png` | `/progress` | Usable but shows an app typo ("1 tracked exercises") and unstyled white inputs; owner may still approve |
| `research-explorer.png` | `/research` | Real seeded topic, but the page prints "?" where a dash belongs ("only ? last reviewed") and production content volume is unverified. **HOLD — owner decision.** UNDERSTAND chapter uses the brand splash meanwhile |

## Deliberately NOT captured

| Screen | Why |
|---|---|
| Dashboard | Contains the "AI COACH — Hermes ready" widget, supplements and "performance compounds" panels (excluded features) |
| Barcode scanner widget | Its sibling text says "Search the food database or add a custom food" (both disabled in prod mode); food catalog empty in a fresh DB, so no real lookup can be shown |
| Coach, Health, Supplements, Timeline, Leaderboard | Excluded per the verified matrix (`/health` shows "Feature not enabled") |
| Meal plan / Generate plan | "Feature not enabled" in production mode |
| Learn | Copy still says "FitMate" (legacy name) |

## Recordings (masters, not shipped)

Location: `~/eze-fit-marketing-masters/clips/` (H.264 MP4, no audio, 390-wide) + `-poster.jpg`; VP8 sources in `webm-source/`.

| Clip | Content | Length | Status |
|---|---|---|---|
| `exercise-library.mp4` | Scroll through the exercise library (nav cropped out) | 9.7 s | Approved for reuse |
| `nutrition-targets.mp4` | Scroll through daily targets | 7.6 s | Approved for reuse |
| `fitpoints-score.mp4` | FitPoints score and categories | 7.3 s | Approved for reuse |

Not recorded: barcode scanning (no camera / empty catalog), meal logging and workout logging (the forms are plain and the
mobile nav strip would need cropping throughout; can be added on request). Not wired into the site: clips are library assets
for social/onboarding; the phone uses stills to keep the pages light.

## Brand assets

`EZE-FIT APPROVED BRAND ASSET REQUIRED` — the runner mark and wordmark are not in this repo or in `~/projects/fit-mate`.
Slots exist (`config/assets.ts` → `runnerMark`, `wordmark`; folder `public/eze-fit/brand/`). Until supplied the site shows a
typographic "EZE-FIT" wordmark only. No substitute icon was created.

## Production-truth resolutions (from the running production-mode app)

| Question | Resolved |
|---|---|
| Water tracking, favorites, saved meals, weight logging | **Not present** on the Nutrition page (Hydration is a target only) → not marketed |
| Food search / custom foods / barcode lookup | Search and custom foods **disabled**; catalog empty in a fresh DB; scanner widget exists on the dashboard only |
| Meal logging | Preset / single catalog-meal buttons plus a recipe builder — narrower than "log any meal" |
| Meal plan | "Feature not enabled" |
| Health dashboard | "Feature not enabled" |
| Progress | Available (weight trend, body composition, measurements) |
| FitPoints | Available; scored TRAIN 40 / PROTEIN 15 / CONSISTENCY 10 for one workout + one protein-target day |
| Research | Available; renders approved topics only (seed provides one); content in production unverified → HOLD |
| Coach | UI exists but its model backend is not running in the production stack → excluded |

## Defects found in the EZE-FIT beta (for the app owner — not fixed here)

1. **Onboarding birth date returns HTTP 500** (`Invalid value for argument birthDate … Expected ISO-8601 DateTime`): the `YYYY-MM-DD` value is not converted before the database call. Testers who enter it hit "Internal server error".
2. Research page text prints `?` instead of an em dash ("Approved evidence only ? last reviewed…", "Grade A ? 1 supporting record(s)").
3. Progress page grammar: "1 tracked exercises".
4. Learn page still says "FitMate".
5. Mobile nav strip exposes Coach / Supplements / Health / Secrets to every tester.

## How to add or replace a screen

1. Capture from a production-mode build with a demo account (see environment above); scan for excluded features.
2. Export a 780×1688 WebP (quality ~82) to `public/eze-fit/screens/`.
3. Register it in `config/assets.ts` with descriptive alt text.
4. Add a row to this file. Run `npm test` (the asset guard fails otherwise).
