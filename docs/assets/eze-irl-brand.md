# EZE IRL logo suite

Internal. **Not published.** Source: Google Drive `My Drive/Eze irl website/Website Logos` (read via Drive
for Desktop, read-only). Masters kept outside the repo: `C:\Users\EzequielCruz\eze-irl-logo-masters\`.

## What was there

7 PNGs, all the same angular "EF"-style mark in a consistent white-on-transparent design language, paired with
an "EZE//IRL" wordmark and "A HIGHER STATE" tagline in several lockups: a vertical mark-over-wordmark (`logo.png`),
a rounded-square app-icon badge (`logo2.png`), two near-identical circular badges (`Circle Version.png`, `logo3.png`),
an icon-only mark (`logo4.png`), and two horizontal lockups at different weights (`logo5.png`, `white.png`).
No AI-mockup artifacts, no app chrome — a real, consistent identity suite, unlike the EZE // FORM Drive folder.

## What was used

| Web file | Source | Used as |
|---|---|---|
| `public/eze-irl/brand/lockup.webp` (2007×446) | `white.png`, trimmed | Primary logo: nav, footer, legal-page header |
| `public/eze-irl/brand/mark.webp` (1112×735) | `logo4.png`, trimmed | Icon-only mark; registered for future compact use (not yet placed anywhere) |
| `public/eze-irl/brand/icon-512.png` / `icon-192.png` | `Circle Version.png`, flattened onto `#0a0a0a` (site background) since app icons need an opaque background | PWA manifest icons |
| `public/apple-touch-icon.png` (180×180) | same, resized | Apple touch icon (previously missing — see `ASSETS.md`) |
| `public/favicon-32.png` | same, resized | Small-size favicon fallback alongside the existing `favicon.svg` |

`white.png` was chosen over `logo5.png` (same composition, lighter stroke) for legibility at nav height.
`logo.png`/`logo2.png`/`logo3.png`/`Circle Version.png` are documented above but not separately shipped as files —
the two square/circle variants were equivalent for the app-icon purpose, so only one was rendered.

## Wordmark spelling

The approved mark reads **"EZE//IRL"** (double slash, matching "EZE // FORM"). Body copy across the site still says
"EZE IRL" (no slash) — e.g. `config/brand.ts`, page titles, the hero headline. The logo image itself was used exactly
as supplied; **no text copy was changed** to match, since standardizing on "EZE//IRL" everywhere is a brand decision
for the owner, not something inferred from finding the logo file.

## Removed

`components/3D/EZEEmblemSVG.tsx` — the hand-drawn placeholder emblem used in the nav, footer and legal header before
the real logo was available. No longer referenced anywhere.
