-- 0006_client_agreement_selection.sql
-- Coach-selected DocuSign packet items are stored per client plan.
-- The selection records intent only; it does not send a document or constitute consent.
ALTER TABLE client_plans
  ADD COLUMN IF NOT EXISTS agreement_selection jsonb NOT NULL DEFAULT '[]'::jsonb;
