import { neon } from "@neondatabase/serverless";
import { CONSENT_TEXT_VERSION } from "./interests";
import type { WaitlistStore } from "./store";
import type { WaitlistSignup } from "./validate";

/**
 * One statement, atomic: upsert the contact, then upsert every requested interest.
 * - Contact: unique on email_normalized. first_name is filled only if currently empty.
 * - Interest: unique on (contact_id, interest). Existing rows keep their status/source/campaign
 *   (first touch wins); consent is recorded only if it was never given before.
 * Nothing here stores health data or client-supplied free-form metadata.
 */
const UPSERT_SQL = `
WITH c AS (
  INSERT INTO waitlist_contacts (email_normalized, email_display, first_name)
  VALUES ($1, $2, $3)
  ON CONFLICT (email_normalized) DO UPDATE SET
    first_name = COALESCE(waitlist_contacts.first_name, EXCLUDED.first_name),
    updated_at = now()
  RETURNING id
)
INSERT INTO waitlist_interests
  (contact_id, interest, source, campaign, referral, consent_at, consent_text_version)
SELECT c.id, i.interest, $4, $5, $6, $7::timestamptz, $8
FROM c, unnest($9::text[]) AS i(interest)
ON CONFLICT (contact_id, interest) DO UPDATE SET
  updated_at = now(),
  consent_at = COALESCE(waitlist_interests.consent_at, EXCLUDED.consent_at),
  consent_text_version = CASE
    WHEN waitlist_interests.consent_at IS NULL THEN EXCLUDED.consent_text_version
    ELSE waitlist_interests.consent_text_version
  END
`;

export function createNeonStore(connectionString: string): WaitlistStore {
  const sql = neon(connectionString);
  return {
    async upsert(s: WaitlistSignup) {
      const consentAt = s.consent ? new Date().toISOString() : null;
      await sql.query(UPSERT_SQL, [
        s.emailNormalized,
        s.email,
        s.firstName,
        s.source,
        s.campaign,
        s.referral,
        consentAt,
        s.consent ? CONSENT_TEXT_VERSION : null,
        s.interests,
      ]);
    },
  };
}
