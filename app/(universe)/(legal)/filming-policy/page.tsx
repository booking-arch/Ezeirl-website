import type { Metadata } from "next";
export const metadata: Metadata = { title: "Filming & Privacy Policy | EZE IRL" };

export default function FilmingPolicyPage() {
  return (
    <article>
      <h1 className="text-3xl font-display tracking-widest mb-2" style={{ fontFamily: "var(--font-oswald)" }}>Filming & Content Privacy Policy</h1>
      <p className="text-brand-muted text-xs font-mono mb-8">Effective: August 2026</p>
      <div className="space-y-6">
        <div>
          <h2 className="text-brand-white text-lg font-semibold mb-2">Our Commitment</h2>
          <p className="text-brand-muted text-sm leading-relaxed">EZE IRL respects the privacy, safety, and dignity of everyone who appears in our content. We film and stream only with proper authorization.</p>
        </div>
        <div>
          <h2 className="text-brand-white text-lg font-semibold mb-2">Location Authorization</h2>
          <p className="text-brand-muted text-sm leading-relaxed">We film at private facilities only with written permission from management. We comply with all facility rules and policies. No filming or livestreaming begins without written authorization.</p>
        </div>
        <div>
          <h2 className="text-brand-white text-lg font-semibold mb-2">Consent</h2>
          <p className="text-brand-muted text-sm leading-relaxed">We obtain consent from individuals who are meaningfully featured in our content. We do not knowingly feature minors without parental or guardian consent.</p>
        </div>
        <div>
          <h2 className="text-brand-white text-lg font-semibold mb-2">Protected Areas</h2>
          <p className="text-brand-muted text-sm leading-relaxed">We do not film in locker rooms, bathrooms, medical areas, or any space where a reasonable expectation of privacy exists.</p>
        </div>
        <div>
          <h2 className="text-brand-white text-lg font-semibold mb-2">Music Rights</h2>
          <p className="text-brand-muted text-sm leading-relaxed">We make reasonable efforts to avoid capturing copyrighted background music. We will mute or edit audio where necessary.</p>
        </div>
        <div>
          <h2 className="text-brand-white text-lg font-semibold mb-2">Removal Requests</h2>
          <p className="text-brand-muted text-sm leading-relaxed">If you believe you appear in our content without consent and wish to be removed, contact us immediately at <a href="mailto:booking@ezeirl.com" className="text-brand-gold underline underline-offset-2">booking@ezeirl.com</a>. We will respond within 72 hours and take prompt corrective action where warranted.</p>
        </div>
        <div>
          <h2 className="text-brand-white text-lg font-semibold mb-2">Platform Compliance</h2>
          <p className="text-brand-muted text-sm leading-relaxed">All content complies with the terms of service of the platforms on which it is published (YouTube, TikTok, Twitch, Instagram, etc.).</p>
        </div>
        <div>
          <h2 className="text-brand-white text-lg font-semibold mb-2">Contact</h2>
          <p className="text-brand-muted text-sm leading-relaxed"><a href="mailto:booking@ezeirl.com" className="text-brand-gold underline underline-offset-2">booking@ezeirl.com</a></p>
        </div>
      </div>
    </article>
  );
}
