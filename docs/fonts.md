# Fonts

Self-hosted (latin subset) under `app/fonts/`, loaded with `next/font/local` in `app/layout.tsx`.

| File | Family | Weights | Licence |
|---|---|---|---|
| `inter-latin-variable.woff2` | Inter | 100–900 (variable) | SIL Open Font License 1.1 |
| `bebas-neue-400-latin.woff2` | Bebas Neue | 400 | SIL Open Font License 1.1 |
| `jetbrains-mono-latin-variable.woff2` | JetBrains Mono | 100–800 (variable) | SIL Open Font License 1.1 |
| `permanent-marker-latin.woff2` | Permanent Marker (brush-script accent) | 400 | Apache License 2.0; SHA-256 `4884fec2c73aa52a2461073c1b87d1ceb80f400520391b43f97ca7d3c39eeb24`, downloaded from `fonts.gstatic.com` (Google Fonts CDN) |

**Provenance:** the exact woff2 bytes Google Fonts served through Next's official `next/font/google` downloader on
2026-09-21 (latin subset, the files Next preloads). Nothing was taken from a third-party source. SHA-256 sums are in the commit message.

**Why:** with `next/font/google` every build fetched fonts.googleapis.com; on a flaky connection the build logged repeated
`socket hang up` retries and would fail after three. Committing the files makes builds deterministic and offline-safe.

**Trade-off:** characters outside the latin subset (e.g. Cyrillic, Greek, extended-Latin diacritics beyond Latin-1) fall back to the system
font. The site content is English. If broader coverage is ever needed, add the corresponding subset files and extra `src` entries.

**To update a font:** download the new woff2 from Google Fonts (or fontsource), replace the file, keep the filename, rebuild, run the CLS check.
