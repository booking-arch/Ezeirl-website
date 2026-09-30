-- 0005_client_plans.sql — coach-reviewed fitness and nutrition plans.
-- ADDITIVE ONLY. Safe to run twice (IF NOT EXISTS).
-- Rollback: DROP TABLE client_plans;
-- A plan stays in status 'draft' until the coach publishes it.
-- The client link uses view_token. Coach notes are never part of the client page.

CREATE TABLE IF NOT EXISTS client_plans (
  id              uuid        PRIMARY KEY,
  submission_id   uuid        NOT NULL UNIQUE,
  view_token      text        NOT NULL UNIQUE,
  status          text        NOT NULL DEFAULT 'draft',
  service         text        NOT NULL,
  client_name     text        NOT NULL,
  email           text        NOT NULL,
  goals           text        NOT NULL,
  ideal_outcome   text        NOT NULL,
  fitness_plan    text        NOT NULL,
  meals           text        NOT NULL,
  schedule        text        NOT NULL,
  coach_notes     text        NOT NULL DEFAULT '',
  intake_json     jsonb       NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  published_at    timestamptz,
  CONSTRAINT client_plans_status_chk CHECK (status IN ('draft', 'published')),
  CONSTRAINT client_plans_service_chk CHECK (service IN ('personal-training', 'nutrition-coaching'))
);

CREATE INDEX IF NOT EXISTS client_plans_status_idx ON client_plans (status, updated_at);
