-- 0002_waitlist_community.sql — adds the EZE IRL community interest and two new sources.
-- ADDITIVE ONLY: widens two CHECK constraints, adds no columns/tables. Safe to run twice.
-- Rollback: re-run 0001's original CHECK definitions (below), which only fails if a row already
-- uses one of the new values — check first with:
--   SELECT DISTINCT interest FROM waitlist_interests WHERE interest = 'eze_irl_community';
--   SELECT DISTINCT source FROM waitlist_interests WHERE source IN ('homepage','partnerships');

ALTER TABLE waitlist_interests DROP CONSTRAINT IF EXISTS waitlist_interests_interest_chk;
ALTER TABLE waitlist_interests ADD CONSTRAINT waitlist_interests_interest_chk
  CHECK (interest IN ('eze_fit_beta', 'eze_fit_launch', 'eze_form', 'eze_irl_community'));

ALTER TABLE waitlist_interests DROP CONSTRAINT IF EXISTS waitlist_interests_source_chk;
ALTER TABLE waitlist_interests ADD CONSTRAINT waitlist_interests_source_chk
  CHECK (source IN ('eze_fit', 'eze_fit_home', 'merch', 'merch_home', 'homepage', 'partnerships'));

-- Rollback (only if no row uses a new value — see checks above):
-- ALTER TABLE waitlist_interests DROP CONSTRAINT waitlist_interests_interest_chk;
-- ALTER TABLE waitlist_interests ADD CONSTRAINT waitlist_interests_interest_chk
--   CHECK (interest IN ('eze_fit_beta', 'eze_fit_launch', 'eze_form'));
-- ALTER TABLE waitlist_interests DROP CONSTRAINT waitlist_interests_source_chk;
-- ALTER TABLE waitlist_interests ADD CONSTRAINT waitlist_interests_source_chk
--   CHECK (source IN ('eze_fit', 'eze_fit_home', 'merch', 'merch_home'));
