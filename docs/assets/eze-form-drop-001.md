# EZE // FORM — Drop 001 asset status

Internal. **Not published.** Update this file whenever imagery is imported.

## Acquisition status: BLOCKED — no images accessible

**2026-09-21.** Google Drive access is authorized in this environment and was used, limited to the EZE // FORM tree:

| Check | Result |
|---|---|
| Folder `EZE//FORM` (id `1uVdW2b5…`, created 2026-09-21, owner: you) | Found |
| Its children | **4 PDFs only**: `01_EZE_FORM_Brand_Foundation`, `02_EZE_FORM_Visual_Identity_Direction`, `03_EZE_FORM_Drop_001_Under_Construction`, `04_EZE_FORM_Product_and_Ecosystem_Roadmap` |
| Subfolder named `clothing` (anywhere visible to this connection) | **Not found** |
| Images (`image/*`) inside `EZE//FORM` | **None** |

The four PDFs sit outside the authorized `clothing` scope and were **not opened**. Likely explanations, for the owner to check:
the `clothing` folder was not uploaded yet, lives in a different Google account or a Shared Drive this connector cannot see, or has
not been shared with the connected account. No other Drive locations were searched and no Windows folders were re-searched.

Nothing was substituted: no stock imagery, no generated garments, no mock-ups. `/merch` and the homepage reveal remain on their
typographic fallback, which is correct until real photography exists.

## What the owner needs to do (any one of these)

1. Move or share the `clothing` folder so it appears under `EZE//FORM` in the connected Google account, then tell the assistant to continue; or
2. Export the ~33 approved images and copy them into `public/eze-form/drop-001/` (full-quality originals are fine; they are optimized on import); or
3. Point to another exact folder the assistant may read.

Also useful (optional): a short list of which images are the same garment, and any confirmed product names. Until names exist, products get internal IDs (`product-01`, `product-02`, …).

## Import procedure (ready, not yet run)

1. **Inventory** every file before building: filename, dimensions, orientation, product group, view (front / back / side / detail / alternate),
   colorway (only if objectively visible), duplicate / near-duplicate, quality, hero / gallery / detail suitability. Group multiple views of one garment; do not assume 33 images = 33 products.
2. **Optimize:** masters stay outside the repo (`~/eze-form-masters/`). Web variants: WebP (Next serves AVIF/WebP per request), ~1600 px long edge for gallery, ~2400 px for the hero, quality ≈ 80–82, no EXIF.
3. **Place** under `public/eze-form/drop-001/<product-id>/` (`front.webp`, `back.webp`, `side.webp`, `detail-1.webp`, …) and register in `config/assets.ts` → `ezeFormAssets.products` (and `hero`).
4. **Document** each product and the hero here (table below). `tests/assets.test.ts` already fails if a registered file is missing or lacks alt text.
5. Homepage reveal: set `ezeFormAssets.hero` to the strongest single image; the reveal then shows it instead of the typographic "001".
6. Re-run typecheck, lint, tests, clean build, and visual QA at 375 / 390 / 430 / 768 / 1280 / 1440 / 1920.

## Truth rule

Never state fabric composition, technical materials, pricing, sizing, inventory, release date, manufacturing location or performance
properties unless the owner supplies them. `FormProduct` has `name`, `colorway` and `description` fields that stay `null` until confirmed.

## Inventory (empty until images are supplied)

| Product ID | Files | Views | Colorway | Hero? | Notes |
|---|---|---|---|---|---|
| — | — | — | — | — | — |

Rejected / unused images and reasons: —
