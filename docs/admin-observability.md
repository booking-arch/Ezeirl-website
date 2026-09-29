# Waitlist observability — safest minimal architecture

Internal. **Not published.** There is no admin authentication system anywhere in this repository
(nor should there be one added just to view signups) — this documents how the owner reviews
waitlist data safely without a public admin panel.

## Why no admin route was built

Building a protected `/admin` route means building real authentication (password/session or a
signed magic link), which is its own security surface with its own risk of getting wrong. That is
disproportionate to "let me see how many people signed up." Every reasonable existing option below
gets the owner the same information without adding an attack surface to the public site.

## Option A — Neon's own dashboard (recommended, needs no new code)

Once `DATABASE_URL` is provisioned (see `DEPLOYMENT.md`), open the Neon project in a browser and
use its built-in SQL editor. It is authenticated by the Neon account, not by anything this repo
controls, so there is nothing here to keep secure.

```sql
-- Signups by list, most recent first
select c.email_display, c.first_name, i.interest, i.source, i.campaign, i.status, i.created_at
from waitlist_interests i join waitlist_contacts c on c.id = i.contact_id
order by i.created_at desc;

-- Totals per list
select interest, status, count(*) from waitlist_interests group by 1, 2 order by 1, 2;

-- Duplicate-submission check: contacts with more than one interest (this is expected and correct,
-- not a bug — see DECISIONS.md on the contacts+interests model)
select c.email_display, count(*) from waitlist_interests i
join waitlist_contacts c on c.id = i.contact_id group by 1 having count(*) > 1;

-- Rows that never got a real send (should be empty; consent_at is null unless the box was ticked)
select * from waitlist_interests where consent_at is null;
```

## Option B — a local script, run by the owner, never deployed

`db/migrate.mjs` already shows the pattern (Neon serverless driver, one-off script). A read-only
export script would follow the same shape: `DATABASE_URL=… node db/export-waitlist.mjs > signups.csv`.
Not built here because it isn't needed yet — Option A already covers it. Build it only if CSV
exports become a recurring need.

## Option C — a future protected route, if the owner specifically wants one

If a real in-app view is ever wanted, the safest shape is a single server-rendered route gated by
a long random bearer token in an environment variable (`ADMIN_TOKEN`), checked in a `middleware.ts`
for that one path only, never client-side. This is deliberately not built now — it's real
authentication and deserves its own review, not a fast-follow bolt-on to an unrelated task.

## What this does NOT need

- No new database. Neon already holds everything (see `docs/eze-fit-feature-matrix.md`'s sibling,
  `db/migrations/`).
- No separate observability platform. Two tables and a handful of rows a day do not need Datadog.
