# CONTENT.md — EZE IRL Content Status

## Homepage Sections

| Section | Component | Content Status | Assets Status |
|---------|-----------|---------------|---------------|
| Navigation | Navigation.tsx | Complete | EZEEmblemSVG (complete) |
| Hero | Hero.tsx | Complete (copy) | hero-portrait.webp MISSING, hero-bg MISSING |
| IRL | IRLSection.tsx | Complete (copy) | No images required |
| Stream | StreamSection.tsx | Complete — Sept 5 2026, 6–8 PM Pacific | No image required |
| EZE-FIT | home/EzeFitReveal.tsx | Complete — private beta | real app screens MISSING (brand splash shown) |
| EZE // FORM | home/EzeFormReveal.tsx | Complete — Drop 001 coming soon | real product imagery MISSING (typographic fallback) |
| Performance Lab | PerformanceLab.tsx | Complete | No images required |
| Watch | WatchSection.tsx | Complete — no videos yet | video thumbnails MISSING |
| Partnerships | PartnershipSection.tsx | Complete | No images required |
| Community | CommunitySection.tsx | Complete — "coming soon" (no-provider) | No images required |
| Footer | Footer.tsx | Complete | EZEEmblemSVG (complete) |

## Legal Pages

| Page | Status | Content |
|------|--------|---------|
| /privacy | Complete | Full privacy policy |
| /terms | Complete | Full terms of service |
| /sponsorship-disclosure | Complete | FTC-compliant disclosure |
| /filming-policy | Complete | Consent and filming notice |
| /accessibility | Complete | Accessibility statement |
| /gym-collaboration-draft | Internal draft | Not publicly linked |
| /contact | Complete | Mailto links to booking@ezeirl.com |

## Placeholder Content

The following content is explicitly placeholder and must be replaced before or shortly after launch:

- **Hero portrait** — Component has `data-placeholder="hero-creator-portrait"`. Currently renders a gradient fill. Replace with actual photo.
- **Hero background** — No video or background image loaded. Section uses CSS gradient. Replace with cinematic background.
- **Watch section thumbnails** — Three video cards show placeholder boxes. No YouTube/TikTok links active.
- **EZE-FIT screens** — `/eze-fit` and the homepage show a brand splash inside the phone. Add REAL captures via `config/assets.ts`.
- **EZE // FORM imagery** — `/merch` is typographic until real product photography is registered in `config/assets.ts`.

## Missing Assets (Required Before Launch)

| Asset | Filename | Location | Dimensions | Format |
|-------|----------|----------|-----------|--------|
| OG / Share Image | og-image.jpg | public/images/og-image.jpg | 1200×630 | JPG or WebP |
| Apple Touch Icon | apple-touch-icon.png | public/apple-touch-icon.png | 180×180 | PNG |
| Hero Creator Portrait | hero-portrait.webp | public/images/hero-portrait.webp | 800×1200 min | WebP |
| Hero Background | hero-bg.webp | public/images/hero-bg.webp | 1920×1080 | WebP or MP4 |
| EZE-FIT screens (4) | per `config/assets.ts` | public/eze-fit/screens/ | ~390×844 | WebP |
| EZE-FIT runner mark + wordmark | per `config/assets.ts` | public/eze-fit/brand/ | — | SVG |
| EZE // FORM product views | per `config/assets.ts` | public/eze-form/products/<id>/ | ~1600px long edge | WebP |
| Video Thumbnails (3) | thumb-{1-3}.webp | public/images/watch/ | 1280×720 | WebP |

## What Exists in public/

- `favicon.svg` — EZE emblem SVG (complete)
- `site.webmanifest` — PWA manifest (complete)
- `robots.txt` — robots configuration (complete)
- `public/images/` — directory exists, no assets yet
- `public/logos/` — directory exists, no assets yet

## Social / Platform Status

All social URLs are `null` in `config/social.ts`. No platform is confirmed. Footer displays "SOON" for all.

Stream platform: Twitch — account not yet configured. `platformUrl: null` in `config/stream.ts`.
