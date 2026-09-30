-- 0004_site_accounts.sql — EZE IRL website accounts.
-- ADDITIVE ONLY. Safe to run twice (IF NOT EXISTS).
-- Rollback: DROP TABLE site_sessions; DROP TABLE site_accounts;
-- These tables are the public website's own accounts. They are not EZE-FIT users
-- and must never hold health, fitness, or waitlist-interest data.
-- Session ids are stored as a SHA-256 hash. The raw token exists only in the cookie.

CREATE TABLE IF NOT EXISTS site_accounts (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email_normalized      text        NOT NULL,
  email_display         text        NOT NULL,
  password_hash         text        NOT NULL,
  consent_at            timestamptz NOT NULL DEFAULT now(),
  consent_text_version  text        NOT NULL,
  created_at            timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT site_accounts_email_key UNIQUE (email_normalized),
  CONSTRAINT site_accounts_email_len CHECK (char_length(email_normalized) BETWEEN 3 AND 254),
  CONSTRAINT site_accounts_display_len CHECK (char_length(email_display) BETWEEN 3 AND 254),
  CONSTRAINT site_accounts_hash_len CHECK (char_length(password_hash) BETWEEN 20 AND 300),
  CONSTRAINT site_accounts_consent_len CHECK (char_length(consent_text_version) BETWEEN 1 AND 40)
);

CREATE TABLE IF NOT EXISTS site_sessions (
  id_hash     text        PRIMARY KEY,
  account_id  uuid        NOT NULL REFERENCES site_accounts(id) ON DELETE CASCADE,
  expires_at  timestamptz NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT site_sessions_hash_len CHECK (char_length(id_hash) BETWEEN 40 AND 80)
);

CREATE INDEX IF NOT EXISTS site_sessions_account_idx ON site_sessions (account_id);
CREATE INDEX IF NOT EXISTS site_sessions_expiry_idx ON site_sessions (expires_at);
