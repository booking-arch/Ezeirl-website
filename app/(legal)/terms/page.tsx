import type { Metadata } from "next";
export const metadata: Metadata = { title: "Terms of Use | EZE IRL" };

export default function TermsPage() {
  return (
    <article>
      <h1 className="text-3xl font-display tracking-widest mb-2" style={{ fontFamily: "var(--font-bebas)" }}>Terms of Use</h1>
      <p className="text-brand-muted text-xs font-mono mb-8">Last reviewed: August 2026 — Draft pending attorney review. Not legal advice.</p>
      <div className="space-y-6">
        <div>
          <h2 className="text-brand-white text-lg font-semibold mb-2">Acceptance</h2>
          <p className="text-brand-muted text-sm leading-relaxed">By accessing www.ezeirl.com you agree to these terms. If you do not agree, do not use the site.</p>
        </div>
        <div>
          <h2 className="text-brand-white text-lg font-semibold mb-2">Content</h2>
          <p className="text-brand-muted text-sm leading-relaxed">All content on this site is owned by or licensed to EZE Media. You may not reproduce, distribute, or use content for commercial purposes without written permission.</p>
        </div>
        <div>
          <h2 className="text-brand-white text-lg font-semibold mb-2">No Medical Advice</h2>
          <p className="text-brand-muted text-sm leading-relaxed">Nothing on this site constitutes medical, nutritional, or fitness advice. Consult qualified professionals before beginning any fitness or supplement regimen.</p>
        </div>
        <div>
          <h2 className="text-brand-white text-lg font-semibold mb-2">Limitation of Liability</h2>
          <p className="text-brand-muted text-sm leading-relaxed">EZE Media is not liable for damages arising from use of this site or reliance on its content. The site is provided as-is.</p>
        </div>
        <div>
          <h2 className="text-brand-white text-lg font-semibold mb-2">Changes</h2>
          <p className="text-brand-muted text-sm leading-relaxed">We may update these terms at any time. Continued use of the site constitutes acceptance of updated terms.</p>
        </div>
        <div>
          <h2 className="text-brand-white text-lg font-semibold mb-2">Contact</h2>
          <p className="text-brand-muted text-sm leading-relaxed"><a href="mailto:booking@ezeirl.com" className="text-brand-gold hover:underline">booking@ezeirl.com</a></p>
        </div>
        <div className="border border-brand-border/40 p-4 mt-8">
          <p className="text-brand-subtle text-xs font-mono">⚠ Draft pending attorney review.</p>
        </div>
      </div>
    </article>
  );
}
