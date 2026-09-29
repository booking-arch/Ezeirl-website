# Asset audit — 2026-09-22

Internal. **Not published.** Consolidated status across the three brand asset inventories
(`eze-irl-brand.md`, `eze-fit-media.md`, `eze-form-drop-001.md`). Re-checked before writing this:
Drive search for the two missing items below returned nothing new since the last check.

## Present and integrated

| Asset | Where it came from | In use |
|---|---|---|
| EZE IRL logo suite (lockup + mark + app icons) | Drive: `Eze irl website/Website Logos` | Nav, footer, legal header, favicon, apple-touch-icon, manifest |
| EZE IRL photography (10 photos) | Drive: `Eze irl website/site photos` | Homepage hero/story/training/lifestyle sections |
| EZE-FIT app screens (3: nutrition targets, exercise library, FitPoints) | Captured from the real app, production-mode, demo account | Homepage EZE-FIT reveal + tile strip |
| Fonts (Inter, Bebas Neue, JetBrains Mono, Permanent Marker) | Official Google Fonts CDN, self-hosted | Sitewide |

## Still missing — cannot be fabricated, need the owner

| Asset | Needed for | Exact spec | Status |
|---|---|---|---|
| **EZE-FIT runner mark / wordmark** (the app's own logo, distinct from EZE IRL's) | `FitMark.tsx` (currently a typographic "EZE-FIT" fallback, no image) | SVG preferred (scales cleanly at nav-height ~28–40px); PNG fallback ≥ 512×512, transparent background, white or near-white linework to sit on `#0d1210`/`#020617` | Not in this repo, not in `~/projects/fit-mate`, not found in any Drive folder checked this engagement |
| **EZE // FORM garment photography** | `/merch` gallery, homepage EZE // FORM reveal | Real photos of physical garments (mannequin, model, or flat-lay); JPG/PNG/HEIC masters, any resolution ≥ 1600px long edge; front + back + detail shots per product | Drive folder `EZE  FORM/Clothing` contains only wholesale-marketplace screenshots and AI-generated concept boards — see `eze-form-drop-001.md` for the full breakdown. No usable photo found. |

## Config hooks already in place (ready the moment files arrive)

- `config/assets.ts` → `ezeFitAssets.runnerMark` / `.wordmark` — both `null`, typed, ready.
- `config/assets.ts` → `ezeFormAssets.hero` and `.products[]` — both empty, typed, ready.
- `public/eze-fit/brand/` and `public/eze-form/drop-001/` — directories exist with `.gitkeep`.
- Dropping a correctly-named file into either path and registering it in `config/assets.ts` is the
  entire integration step; no component changes are needed (see the "How to add" section at the
  bottom of `eze-fit-media.md` and `eze-form-drop-001.md`).
