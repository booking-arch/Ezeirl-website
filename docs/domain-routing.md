# Domain routing findings (read-only investigation, 2026-09-21)

**Nothing was changed.** No DNS, nameserver, Squarespace, Vercel-domain or Google Workspace setting was modified.

## Observed

| Request | Result |
|---|---|
| `http://ezeirl.com` | `308` → `https://ezeirl.com/` → `301` → **`https://ezeirl-website.vercel.app/`** |
| `http://www.ezeirl.com` | `308` → `https://www.ezeirl.com/` → `301` → **`https://ezeirl-website.vercel.app/`** |
| `https://ezeirl.com`, `https://www.ezeirl.com` | `301` → `https://ezeirl-website.vercel.app/` |
| `https://ezeirl-website.vercel.app` | `200` (served here) |

DNS: `ezeirl.com` A → `216.198.79.1` (Vercel); `www.ezeirl.com` CNAME → `cname.vercel-dns.com`; nameservers `nse1-4.squarespacedns.com`.
Both hostnames resolve to Vercel, so **DNS is correct**. The redirect is produced by Vercel's routing, i.e. a domain setting on the Vercel project.

## Problem

Intended: `www.ezeirl.com` is primary and serves the site; `ezeirl.com` redirects to it.
Actual: **both** domains redirect to the `.vercel.app` hostname, so the public URL visitors and search engines end on is not the brand domain.

Consistency inside the site (all say `https://www.ezeirl.com`): metadata base, canonicals (home now added, `/eze-fit`, `/merch`), OpenGraph `og:url`, Twitter cards, sitemap, JSON-LD.
So the code is right and the deployment setting contradicts it.

## Recommended fix (owner, in the Vercel dashboard — no DNS change)

Project → Settings → Domains:
1. `www.ezeirl.com` → **no redirect** (set as the primary/production domain).
2. `ezeirl.com` → redirect to `www.ezeirl.com` (308).
3. Remove any "redirect to ezeirl-website.vercel.app" on either domain.

Then verify with `curl -sIL https://ezeirl.com` (one hop to `https://www.ezeirl.com/`, final `200`).
