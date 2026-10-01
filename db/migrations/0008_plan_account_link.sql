-- 0008_plan_account_link.sql — save a coaching plan to a website account.
-- ADDITIVE ONLY. Safe to run twice. Existing plans stay unlinked (reachable only by their private link).
-- Rollback: ALTER TABLE client_plans DROP COLUMN account_id;
-- Linking is by account id, set (a) when a signed-in client submits the questionnaire or (b) when a signed-in
-- client claims a plan by its private link. It is NEVER inferred from an email address: emails are not verified.
ALTER TABLE client_plans
  ADD COLUMN IF NOT EXISTS account_id uuid REFERENCES site_accounts(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS client_plans_account_idx ON client_plans (account_id) WHERE account_id IS NOT NULL;
