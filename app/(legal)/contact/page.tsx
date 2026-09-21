import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | EZE IRL",
  description:
    "Get in touch with EZE IRL for bookings, sponsorships, business inquiries, and press.",
};

export default function ContactPage() {
  return (
    <div>
      <p className="text-brand-red text-xs font-mono tracking-[0.3em] uppercase mb-4">
        GET IN TOUCH
      </p>

      <h1
        className="text-brand-white leading-none font-display mb-6"
        style={{
          fontFamily: "var(--font-bebas)",
          fontSize: "clamp(40px, 8vw, 80px)",
          letterSpacing: "0.02em",
        }}
      >
        CONTACT
      </h1>

      <div
        className="w-12 h-px mb-8"
        style={{ background: "rgba(204,0,0,0.6)" }}
        aria-hidden="true"
      />

      <p className="text-brand-muted text-sm leading-relaxed mb-10 max-w-lg">
        For bookings, sponsorships, business inquiries, collaborations, and press
        — all communications go through one inbox. Response time is typically 24–48 hours.
      </p>

      {/* Primary contact */}
      <div className="border border-brand-border bg-brand-card/10 p-6 sm:p-8 mb-8 max-w-lg">
        <p className="text-brand-muted text-xs font-mono tracking-widest uppercase mb-2">
          General Contact
        </p>
        <a
          href="mailto:booking@ezeirl.com"
          className="text-brand-white text-lg font-mono hover:text-brand-gold transition-colors duration-200 break-all"
          aria-label="Send email to booking at ezeirl dot com"
        >
          booking@ezeirl.com
        </a>
      </div>

      {/* Subject-specific links */}
      <div className="space-y-4 max-w-lg">
        <div className="border border-brand-border/40 p-5">
          <p className="text-brand-muted text-xs font-mono tracking-widest uppercase mb-2">
            Sponsorships &amp; Brand Partnerships
          </p>
          <a
            href="mailto:booking@ezeirl.com?subject=Sponsorship+Inquiry"
            className="text-brand-white text-sm font-mono hover:text-brand-gold transition-colors duration-200"
          >
            booking@ezeirl.com — subject: Sponsorship Inquiry
          </a>
        </div>

        <div className="border border-brand-border/40 p-5">
          <p className="text-brand-muted text-xs font-mono tracking-widest uppercase mb-2">
            Business &amp; Licensing
          </p>
          <a
            href="mailto:booking@ezeirl.com?subject=Business+Inquiry"
            className="text-brand-white text-sm font-mono hover:text-brand-gold transition-colors duration-200"
          >
            booking@ezeirl.com — subject: Business Inquiry
          </a>
        </div>
      </div>

      <p className="text-brand-subtle text-xs font-mono leading-relaxed mt-10 max-w-lg">
        EZE IRL does not have a publicist, manager, or agency on file. All correspondence is
        handled directly. No unsolicited promotions or cold pitches.
      </p>
    </div>
  );
}
