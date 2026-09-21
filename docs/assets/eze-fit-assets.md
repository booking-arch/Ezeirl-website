# public/eze-fit/ — EZE-FIT assets (REAL captures only)

Wire each file up in `config/assets.ts` (`ezeFitAssets`). Nothing here is used until it is registered there.

- `brand/`   established runner mark + wordmark (SVG preferred)
- `screens/` real app screenshots, one per story chapter: track, train, progress, understand (WebP, ~390x844 or 2x)
- `video/`   real screen recordings (MP4/WebM) + a poster image for each
- `promo/`   share/OG imagery

Rules: capture from production-equivalent feature flags with a DEMO account (no real health or personal data);
only screens for CONFIRMED / clearly-labelled BETA features (see `docs/eze-fit-feature-matrix.md`).
Never mock up or generate app interfaces.
