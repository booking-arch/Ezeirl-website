# EZE // FORM — Drop 001 asset status

Internal. **Not published.** Update this file whenever imagery is imported.

## Acquisition status: BLOCKED — files found, but none are usable product photography

**2026-09-22.** Read `G:\My Drive\EZE  FORM\Clothing\Products` and its parent `G:\My Drive\EZE  FORM\Clothing` (via
Drive for Desktop through Windows, read-only; nothing was moved or deleted in Drive). Local copy for review:
`C:\Users\EzequielCruz\eze-form-masters\` (outside the repo, not committed).

**41 files found** (29 `.HEIC`, 12 `.PNG`; 2 PNGs are byte-identical duplicates, so 40 unique). None can be used as-is:

| Group | Count | What it actually is |
|---|---|---|
| `IMG_8550`–`IMG_8578.HEIC` (29) | 29 | **Screen captures of a phone browsing a wholesale-sourcing marketplace app** (Alibaba/1688-style). Every frame shows phone chrome — status bar, "Find similar", "Chat now", "Send inquiry" buttons — and one frame is a full product listing with a price ladder ("$6.82 · Min. order 50 pieces"), a "Super September" sale banner and a store rating. The garments shown belong to other, unrelated brands/sellers (visible marks include "Andreike", "FLAMEBULL", generic "Custom" text, Chrome-Hearts-style cross graphics) — these are reference/inspiration captures, not EZE // FORM's own product. |
| `Clothing/*.png` + `Clothing/Products/*.png` (11 unique) | 11 | **AI-generated concept boards**, two kinds: (a) `EZE//FORM` **logo/wordmark exploration sheets** (multiple mark variations side by side, no single approved mark indicated), and (b) **fabric-swatch mockup sheets** for named concepts ("EMBOSS HOODIE", "PANEL HOODIE", "SIGNATURE HOODIE", "DISTRESSED KNIT SWEATER") with generic colour-swatch dots and template captions — the visual grammar of an AI moodboard generator, not photography of a sewn garment. |

**Conclusion:** there is still no photograph of an actual, physical EZE // FORM garment in the reachable Drive location.
Per the standing rule ("do not substitute stock images, do not AI-generate replacement clothing, never invent — group by
real product, not by file count"), **none of these 40 files were used.** `/merch`, the homepage reveal and
`config/assets.ts` are unchanged (`ezeFormAssets.hero: null`, `products: []`).

The logo sheets are noted for later: if the owner picks one mark from `c02`/`c03` and confirms it as approved, it can
seed `public/eze-fit/brand/` or a future `public/eze-form/brand/` — but that is a brand-identity decision for the owner,
not something inferred from a multi-option exploration sheet.

## What the owner needs to do (any one of these)

1. Share or export actual photographs of physical EZE // FORM garments (on a mannequin, a model, or flat-lay) —
   the "site photos" style used for EZE IRL is the right precedent; or
2. Confirm that one of the sourcing-marketplace listings represents a genuinely licensed/white-label EZE // FORM
   product and should be used as a placeholder with that fact disclosed (not implied to be an exclusive EZE // FORM photo); or
3. Point to a different, more complete folder if the real production photography lives elsewhere.

## Import procedure (ready, unchanged from before)

1. **Inventory** every file before building: filename, dimensions, orientation, product group, view (front / back / side / detail / alternate),
   colorway (only if objectively visible), duplicate / near-duplicate, quality, hero / gallery / detail suitability. Group multiple views of one garment; do not assume file count = product count.
2. **Optimize:** masters stay outside the repo. Web variants: WebP, ~1600 px long edge for gallery, ~2400 px for the hero, quality ≈ 80–82, no EXIF.
3. **Place** under `public/eze-form/drop-001/<product-id>/` (`front.webp`, `back.webp`, `side.webp`, `detail-1.webp`, …) and register in `config/assets.ts` → `ezeFormAssets.products` (and `hero`).
4. **Document** each product and the hero here. `tests/assets.test.ts` fails if a registered file is missing or lacks alt text.
5. Homepage reveal: set `ezeFormAssets.hero` to the strongest single image; the reveal then shows it instead of the typographic "001".
6. Re-run typecheck, lint, tests, clean build, and visual QA at 375 / 390 / 430 / 768 / 1280 / 1440 / 1920.

## Truth rule

Never state fabric composition, technical materials, pricing, sizing, inventory, release date, manufacturing location or performance
properties unless the owner supplies them. `FormProduct` has `name`, `colorway` and `description` fields that stay `null` until confirmed.

## Inventory (still empty — no usable photography found)

| Product ID | Files | Views | Colorway | Hero? | Notes |
|---|---|---|---|---|---|
| — | — | — | — | — | — |

Rejected images and reasons: see table above (all 40 files, two groups, neither usable).
