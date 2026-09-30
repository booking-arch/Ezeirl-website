# Domain routing findings

**Nothing was changed.** No DNS, nameserver, Squarespace, Vercel-domain or Google Workspace setting was modified.

## Update 2026-09-30 (current)

`www.ezeirl.com` is a CNAME to `eze-irl.web.app`. The apex A record is `199.36.158.100`. Both serve a Firebase Hosting Vite build, and `www` redirects to the apex. `https://ezeirl-website.vercel.app` still serves this Next.js repository. Nameservers remain `nse1-4.squarespacedns.com`. Mail still points at Google (`smtp.google.com`, SPF, `google._domainkey`). There is no `_dmarc` record. Do not “correct” the domain toward Vercel until the Firebase project `eze-irl` is accounted for. The canonical tags inside this repo still say `https://www.ezeirl.com`, which is the intended primary host for this Next.js site, not a description of today’s Firebase redirect.

## Investigation 2026-09-21 (historical)

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
