import type { Metadata } from "next";
export const metadata: Metadata = { title: "Accessibility | EZE IRL" };

export default function AccessibilityPage() {
  return (
    <article>
      <h1 className="text-3xl font-display tracking-widest mb-2" style={{ fontFamily: "var(--font-bebas)" }}>Accessibility</h1>
      <p className="text-brand-muted text-xs font-mono mb-8">Commitment as of August 2026</p>
      <div className="space-y-6">
        <div>
          <h2 className="text-brand-white text-lg font-semibold mb-2">Our Goal</h2>
          <p className="text-brand-muted text-sm leading-relaxed">EZE IRL aims to make this website usable by as many people as possible, including people using assistive technologies.</p>
        </div>
        <div>
          <h2 className="text-brand-white text-lg font-semibold mb-2">Current Implementation</h2>
          <ul className="text-brand-muted text-sm leading-relaxed space-y-1 list-disc pl-5">
            <li>Skip-to-content link</li>
            <li>Semantic HTML landmarks</li>
            <li>Keyboard-navigable interactive elements</li>
            <li>Visible focus styles</li>
            <li>Reduced-motion support via prefers-reduced-motion</li>
            <li>Alt text on meaningful images</li>
            <li>ARIA labels on interactive controls</li>
            <li>3D content has static fallbacks</li>
            <li>Color contrast checked for primary text</li>
          </ul>
        </div>
        <div>
          <h2 className="text-brand-white text-lg font-semibold mb-2">Known Limitations</h2>
          <p className="text-brand-muted text-sm leading-relaxed">The site is in active development. Some areas may not meet WCAG 2.1 AA standards yet. We are working to improve compliance continuously.</p>
        </div>
        <div>
          <h2 className="text-brand-white text-lg font-semibold mb-2">Feedback</h2>
          <p className="text-brand-muted text-sm leading-relaxed">If you encounter a barrier, please contact us: <a href="mailto:booking@ezeirl.com" className="text-brand-gold hover:underline">booking@ezeirl.com</a>. We take accessibility reports seriously.</p>
        </div>
      </div>
    </article>
  );
}
