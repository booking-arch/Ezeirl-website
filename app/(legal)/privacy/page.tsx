import type { Metadata } from "next";
export const metadata: Metadata = { title: "Privacy Policy | EZE IRL" };

export default function PrivacyPage() {
  return (
    <article className="prose-legal">
      <h1 className="text-3xl font-display tracking-widest mb-2" style={{ fontFamily: "var(--font-bebas)" }}>Privacy Policy</h1>
      <p className="text-brand-muted text-xs font-mono mb-8">Last reviewed: August 2026 — Draft pending attorney review. Not legal advice.</p>

      <section className="space-y-6">
        <div>
          <h2 className="text-brand-white text-lg font-semibold mb-2">Overview</h2>
          <p className="text-brand-muted text-sm leading-relaxed">EZE Media operates EZE IRL at www.ezeirl.com. This policy describes how we handle information collected through the website. This is a draft and will be updated before any data collection is activated.</p>
        </div>
        <div>
          <h2 className="text-brand-white text-lg font-semibold mb-2">Information We May Collect</h2>
          <p className="text-brand-muted text-sm leading-relaxed">If you create an EZE IRL website account, we store your email address and a hash of your password so you can log in. That account is only for this website. It is not an EZE-FIT account and it does not include health or fitness data. Email signup for the waitlist stays off until that collection is turned on. We do not sell personal information.</p>
        </div>
        <div>
          <h2 className="text-brand-white text-lg font-semibold mb-2">How Information Is Used</h2>
          <p className="text-brand-muted text-sm leading-relaxed">Email addresses, when collected, are used only to send EZE IRL updates. We do not share contact information with third parties for marketing purposes without explicit consent.</p>
        </div>
        <div>
          <h2 className="text-brand-white text-lg font-semibold mb-2">Third-Party Services</h2>
          <p className="text-brand-muted text-sm leading-relaxed">The site may use third-party services for hosting and analytics. Each service has its own privacy policy. We will document active integrations here before launch.</p>
        </div>
        <div>
          <h2 className="text-brand-white text-lg font-semibold mb-2">Your Rights</h2>
          <p className="text-brand-muted text-sm leading-relaxed">You may request removal of your information at any time by emailing <a href="mailto:booking@ezeirl.com" className="text-brand-gold underline underline-offset-2">booking@ezeirl.com</a>. California residents may have additional rights under CCPA.</p>
        </div>
        <div>
          <h2 className="text-brand-white text-lg font-semibold mb-2">Contact</h2>
          <p className="text-brand-muted text-sm leading-relaxed">Privacy questions: <a href="mailto:booking@ezeirl.com" className="text-brand-gold underline underline-offset-2">booking@ezeirl.com</a></p>
        </div>
        <div className="border border-brand-border/40 p-4 mt-8">
          <p className="text-brand-subtle text-xs font-mono">⚠ This draft requires attorney review before activation of any data collection. Do not activate email signup or analytics until this policy is finalized.</p>
        </div>
      </section>
    </article>
  );
}
