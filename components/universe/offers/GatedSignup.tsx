"use client";

import Link from "next/link";

/**
 * Email field UI for the free guide.
 *
 * The site-wide legal gate is `WAITLIST_ENABLED` (`isWaitlistEnabled`), passed in from the
 * server page so this client component never reads the env itself.
 *
 * Collection stays off either way:
 * - the controls are disabled
 * - submit is cancelled
 * - there is no POST and no email provider
 *
 * TODO(guide-signup): after an attorney reviews the privacy policy, add a waitlist interest
 * and source, then submit through the existing gated `/api/waitlist`. Do not add a provider here.
 */
export default function GatedSignup({ enabled }: { enabled: boolean }) {
  return (
    <form
      className="offer__form"
      aria-label="Get the Faith & Fitness Starter Guide"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <p className="offer__badge">Signup off</p>
      <p id="guide-signup-status" className="offer__note">
        {enabled
          ? "The site-wide waitlist gate is open, but this form is still not connected. It does not send or store your email."
          : "Email signup stays off until the privacy policy is attorney-reviewed. This form does not send or store your email."}
      </p>

      <label htmlFor="guide-email">Email</label>
      <input
        id="guide-email"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="you@email.com"
        disabled
        aria-disabled="true"
        aria-describedby="guide-signup-status"
      />

      <label className="offer__check">
        <input type="checkbox" name="consent" disabled aria-disabled="true" />
        <span>
          Email me when the free guide is ready to send.{" "}
          <span className="offer__optional">(optional — not collected)</span>
        </span>
      </label>

      <button type="submit" className="btn btn-solid" disabled aria-disabled="true">
        Get the free guide
      </button>

      <p className="offer__note">
        See the{" "}
        <Link href="/privacy">Privacy Policy</Link>
        {" "}
        (draft, pending attorney review).
      </p>
    </form>
  );
}
