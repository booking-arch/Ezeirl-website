-- 0003_client_intake.sql — personal-training client intake questionnaire.
-- ADDITIVE ONLY. Safe to run twice (IF NOT EXISTS). Rollback: DROP TABLE client_intake_submissions;
-- Deliberately SEPARATE from waitlist_* tables: this holds HEALTH information (PAR-Q, injuries,
-- medications, pregnancy) which the waitlist schema must never contain. Treat as sensitive:
-- restrict access, do not export to analytics, and set a retention period with counsel.

CREATE TABLE IF NOT EXISTS client_intake_submissions (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email_normalized     text        NOT NULL,
  full_name            text        NOT NULL,
  answers              jsonb       NOT NULL,   -- validated against config/intake.ts; unknown keys never stored
  consent_at           timestamptz NOT NULL,
  consent_text_version text        NOT NULL,
  status               text        NOT NULL DEFAULT 'new',
  created_at           timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT client_intake_email_len CHECK (char_length(email_normalized) BETWEEN 3 AND 254),
  CONSTRAINT client_intake_status_chk CHECK (status IN ('new', 'reviewed', 'archived'))
);

CREATE INDEX IF NOT EXISTS client_intake_email_idx   ON client_intake_submissions (email_normalized, created_at);
CREATE INDEX IF NOT EXISTS client_intake_status_idx  ON client_intake_submissions (status, created_at);
