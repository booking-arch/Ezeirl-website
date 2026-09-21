-- 0001_waitlist.sql — marketing waitlist for EZE-FIT and EZE // FORM.
-- ADDITIVE ONLY: creates new objects, touches nothing existing. Safe to run twice (IF NOT EXISTS).
-- Rollback: DROP TABLE waitlist_interests; DROP TABLE waitlist_contacts;  (no other table depends on them)
--
-- Model: one contact per person (normalized email); one interest row per list they joined.
-- A person on all three lists is 1 contact + 3 interests — never three conflicting user records.
-- This schema must never hold fitness or health information.

-- gen_random_uuid() is built in since PostgreSQL 13 — no extension required.

CREATE TABLE IF NOT EXISTS waitlist_contacts (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email_normalized text        NOT NULL,
  email_display    text        NOT NULL,   -- as typed, for sending/display; never used for matching
  first_name       text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT waitlist_contacts_email_normalized_key UNIQUE (email_normalized),
  CONSTRAINT waitlist_contacts_email_len CHECK (char_length(email_normalized) BETWEEN 3 AND 254),
  CONSTRAINT waitlist_contacts_first_name_len CHECK (first_name IS NULL OR char_length(first_name) <= 60)
);

CREATE TABLE IF NOT EXISTS waitlist_interests (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id           uuid        NOT NULL REFERENCES waitlist_contacts(id) ON DELETE CASCADE,
  interest             text        NOT NULL,   -- which list: what the person wants
  status               text        NOT NULL DEFAULT 'active',
  source               text        NOT NULL,   -- where on the site they signed up
  campaign             text,                   -- utm_campaign (validated tag), optional
  referral             text,                   -- referrer hostname only, optional
  consent_at           timestamptz,            -- set only when the optional consent box was ticked
  consent_text_version text,                   -- wording version shown at that time
  metadata             jsonb       NOT NULL DEFAULT '{}'::jsonb,  -- server-set only; reserved
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT waitlist_interests_contact_interest_key UNIQUE (contact_id, interest),
  CONSTRAINT waitlist_interests_interest_chk CHECK (interest IN ('eze_fit_beta', 'eze_fit_launch', 'eze_form')),
  CONSTRAINT waitlist_interests_status_chk   CHECK (status IN ('active', 'invited', 'converted', 'unsubscribed')),
  CONSTRAINT waitlist_interests_source_chk   CHECK (source IN ('eze_fit', 'eze_fit_home', 'merch', 'merch_home')),
  CONSTRAINT waitlist_interests_consent_chk  CHECK (consent_at IS NULL OR consent_text_version IS NOT NULL)
);

-- Admin/segmentation readiness: filter by list + status, export by date, campaign segments.
CREATE INDEX IF NOT EXISTS waitlist_interests_interest_status_idx ON waitlist_interests (interest, status, created_at);
CREATE INDEX IF NOT EXISTS waitlist_interests_campaign_idx        ON waitlist_interests (campaign) WHERE campaign IS NOT NULL;
