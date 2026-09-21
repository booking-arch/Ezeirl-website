# EZE IRL professional photography

Internal. **Not published.** Source: Google Drive `My Drive/Eze IRL website/site photos` (read via Drive for Desktop, read-only).
Masters (untouched PNG originals + the approved template) are kept **outside the repo**: `C:\Users\EzequielCruz\eze-irl-site-masters\`.
Web copies: `public/eze-irl/photos/*.webp` (941×1672, WebP q80, 62–242 KB, no EXIF). Files on disk are uncropped and ungraded;
crop (CSS `object-position`, focal points in `config/assets.ts` → `ezeIrlPhotos`) and a restrained grade (`.grade`: saturate .72 / contrast 1.06) are presentation only.
No image was generated, retouched or replaced.

## Inventory

The folder held 16 PNGs (12 unique; the four "(1)" files are byte-identical duplicates by SHA-256), three extension-less files that are
HTML documents (not images, ignored), and the template `01_EZE_IRL_Homepage_Master_Concept.png`. All photos are 941×1672 portrait.

| Web file | Scene | Used as | Notes |
|---|---|---|---|
| `cable-row-back.webp` | Seated cable row from behind, kettlebell rack | **Hero** | Same composition the template hero is built from; shown in a right-hand column at ~native size |
| `portrait-arms-crossed.webp` | Arms crossed, headphones, direct gaze | Story mosaic (identity) | Cropped chest-up (`object-position` top) — excludes the waistband branding and bathroom background |
| `plate-hold.webp` | Seated with a weight plate | Story mosaic, Training gallery | |
| `bench-rest.webp` | Leaning back on a bench between sets | Story mosaic | |
| `dumbbell-row.webp` | Heavy dumbbell row | Training feature, "Content" tile | |
| `incline-curl-low.webp` | Low-angle incline curl | Training gallery | |
| `incline-curl-roar.webp` | Incline curl, roaring | Training gallery, "Fitness" tile | |
| `pull-up-back.webp` | Pull-up handles from behind | Training gallery | |
| `cable-row-side.webp` | Seated cable row, side | Training gallery | Near-duplicate scene of the hero, different pose |
| `sunset-calisthenics.webp` | Horizontal calisthenics jump at sunset | Lifestyle feature, "Lifestyle" tile | Only full-colour, outdoor image — shown **ungraded** on purpose |

## Not used

| Original | Reason |
|---|---|
| `016BE36C…` (bathroom, shirtless, from behind) | Toilet and underwear branding in frame; not brand-appropriate |
| `61B47D81…` (selfie with a second person, arm in sling) | Shows another identifiable person; consent is not verifiable and `/filming-policy` requires it. Owner may approve |
| `0B3DED22…` (arms crossed, full frame) | Only used in cropped form; the uncropped frame shows bathroom + waistband branding |
| `0A3EFD17…`/`A758CC8F…` | Superseded by the same scenes above (near-duplicates) |
| Three HTML files without extension | Not images |

Third-party marks visible in some frames (apparel logos on shirts and caps) are incidental to the photography; the sponsorship-disclosure page already
states no endorsement is implied.

## Template (design language only)

`01_EZE_IRL_Homepage_Master_Concept.png` was used for look and feel only: near-monochrome graded photography with grain, distressed heavy
condensed headline, green dry-brush script accent, outlined green pill CTAs, six-tile category strip, handwritten side taglines, closing panorama.
**Not reproduced from the concept** because they contradict `docs/eze-fit-feature-matrix.md`: the fake EZE-Fit phone UI ("1,852 calories"), "Powered by AI. Backed by science",
"AI Coach", "Community support", "Real results". The Nutrition tile is omitted (no honest imagery). The wide mountain/city panorama has no source photo, so the closing beat is typographic.

## Known limitations

- Photos are 941 px wide. The hero uses a ~60 vw column (≈ native at 1440 px) rather than full-bleed; on 1920 px screens the hero image is upscaled ≈1.3×. Higher-resolution masters would sharpen large screens.
- The hero image is a back view; identity comes from the wordmark and headline, as in the template.
