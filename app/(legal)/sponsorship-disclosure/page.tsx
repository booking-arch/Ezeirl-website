import type { Metadata } from "next";
export const metadata: Metadata = { title: "Sponsorship & Affiliate Disclosure | EZE IRL" };

export default function SponsorshipDisclosurePage() {
  return (
    <article>
      <h1 className="text-3xl font-display tracking-widest mb-2" style={{ fontFamily: "var(--font-bebas)" }}>Sponsorship & Affiliate Disclosure</h1>
      <p className="text-brand-muted text-xs font-mono mb-8">Effective: August 2026</p>
      <div className="space-y-6">
        <div>
          <h2 className="text-brand-white text-lg font-semibold mb-2">Our Commitment</h2>
          <p className="text-brand-muted text-sm leading-relaxed">EZE IRL is committed to transparency. When content is sponsored, gifted, or includes affiliate links, it will be clearly labeled.</p>
        </div>
        <div>
          <h2 className="text-brand-white text-lg font-semibold mb-2">Sponsored Content</h2>
          <p className="text-brand-muted text-sm leading-relaxed">Content created in exchange for payment or free products will be labeled &quot;Sponsored,&quot; &quot;Ad,&quot; or &quot;#ad&quot; in compliance with FTC guidelines.</p>
        </div>
        <div>
          <h2 className="text-brand-white text-lg font-semibold mb-2">Affiliate Links</h2>
          <p className="text-brand-muted text-sm leading-relaxed">Links marked as affiliate links may earn EZE IRL a commission if you make a purchase. This does not affect the price you pay.</p>
        </div>
        <div>
          <h2 className="text-brand-white text-lg font-semibold mb-2">Supplement & Health Products</h2>
          <p className="text-brand-muted text-sm leading-relaxed">EZE does not make medical claims. Individual results vary. Any supplement partnerships will be clearly disclosed and EZE will only represent products he personally uses and believes in. Nothing here is medical advice.</p>
        </div>
        <div>
          <h2 className="text-brand-white text-lg font-semibold mb-2">Current Status</h2>
          <p className="text-brand-muted text-sm leading-relaxed">No active paid sponsorships or affiliate agreements exist as of August 2026. This page will be updated as partnerships are established.</p>
        </div>
        <div>
          <h2 className="text-brand-white text-lg font-semibold mb-2">Questions</h2>
          <p className="text-brand-muted text-sm leading-relaxed"><a href="mailto:booking@ezeirl.com" className="text-brand-gold hover:underline">booking@ezeirl.com</a></p>
        </div>
      </div>
    </article>
  );
}
