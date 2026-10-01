-- 0007_account_roles.sql — roles for website accounts (client / coach / admin).
-- ADDITIVE ONLY. Safe to run twice. Existing accounts become 'client'.
-- Rollback: ALTER TABLE site_accounts DROP COLUMN role;
-- Coach access is granted by an admin (or bootstrapped from the COACH_EMAILS env list); sign-up can never set a role.
ALTER TABLE site_accounts
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'client'
  CHECK (role IN ('client', 'coach', 'admin'));
CREATE INDEX IF NOT EXISTS site_accounts_role_idx ON site_accounts (role) WHERE role <> 'client';
