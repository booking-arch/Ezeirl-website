import type { WaitlistInterest, WaitlistSource, WaitlistStatus } from "./interests";
import { CONSENT_TEXT_VERSION } from "./interests";
import type { WaitlistSignup } from "./validate";

export interface MemoryContact {
  emailNormalized: string;
  emailDisplay: string;
  firstName: string | null;
  interests: Map<
    WaitlistInterest,
    {
      status: WaitlistStatus;
      source: WaitlistSource;
      campaign: string | null;
      referral: string | null;
      consentAt: Date | null;
      consentTextVersion: string | null;
    }
  >;
}

/** Mirrors the SQL semantics in neon-store.ts. Test/dev only — see resolveWaitlistStore(). */
export function createMemoryStore() {
  const contacts = new Map<string, MemoryContact>();

  return {
    contacts,
    async upsert(s: WaitlistSignup): Promise<void> {
      let c = contacts.get(s.emailNormalized);
      if (!c) {
        c = { emailNormalized: s.emailNormalized, emailDisplay: s.email, firstName: s.firstName, interests: new Map() };
        contacts.set(s.emailNormalized, c);
      } else if (c.firstName === null && s.firstName !== null) {
        c.firstName = s.firstName; // fill only if empty — a later submission can't overwrite it
      }

      for (const interest of s.interests) {
        const existing = c.interests.get(interest);
        if (!existing) {
          c.interests.set(interest, {
            status: "active",
            source: s.source,
            campaign: s.campaign,
            referral: s.referral,
            consentAt: s.consent ? new Date() : null,
            consentTextVersion: s.consent ? CONSENT_TEXT_VERSION : null,
          });
        } else if (existing.consentAt === null && s.consent) {
          existing.consentAt = new Date();
          existing.consentTextVersion = CONSENT_TEXT_VERSION;
        }
      }
    },
  };
}
