"use client";

import Link from "next/link";
import EZEEmblemSVG from "./3D/EZEEmblemSVG";
import { brand } from "@/config/brand";
import { social } from "@/config/social";
import { links } from "@/config/links";

const legalLinks = [
  { label: "Privacy", href: links.privacy },
  { label: "Terms", href: links.terms },
  { label: "Sponsorship Disclosure", href: links.sponsorshipDisclosure },
  { label: "Filming Policy", href: links.filmingPolicy },
  { label: "Accessibility", href: links.accessibility },
  { label: "Contact", href: links.contact },
  { label: "Sponsorships", href: links.sponsorships },
  { label: "Business Inquiries", href: links.business },
];

const socialIcons: Record<string, React.ReactNode> = {
  instagram: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>,
  tiktok: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.74a8.18 8.18 0 004.78 1.52V6.8a4.85 4.85 0 01-1.01-.11z" /></svg>,
  youtube: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.19a3 3 0 00-2.11-2.12C19.55 3.5 12 3.5 12 3.5s-7.55 0-9.39.57A3 3 0 00.5 6.19C0 8.04 0 12 0 12s0 3.96.5 5.81a3 3 0 002.11 2.12C4.45 20.5 12 20.5 12 20.5s7.55 0 9.39-.57a3 3 0 002.11-2.12C24 15.96 24 12 24 12s0-3.96-.5-5.81zM9.75 15.52V8.48L15.5 12l-5.75 3.52z" /></svg>,
  twitch: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11.64 5.93h1.43v4.28h-1.43m3.93-4.28H17v4.28h-1.43M7 2L3.43 5.57v12.86h4.28V22l3.58-3.57h2.85L20.57 12V2m-1.43 9.29l-2.85 2.85h-2.86l-2.5 2.5v-2.5H8.14V3.43h11z" /></svg>,
  x: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
};

export default function Footer() {
  return (
    <footer className="relative border-t border-brand-border/40 bg-brand-black" role="contentinfo" aria-label="Site footer">
      <div className="max-w-6xl mx-auto px-4 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <EZEEmblemSVG size={36} color="#c9a84c" animated={false} />
              <span className="text-brand-white text-xl tracking-widest" style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.15em" }}>{brand.name}</span>
            </div>
            <p className="text-brand-muted text-xs font-mono tracking-widest uppercase mb-2">{brand.tagline}</p>
            <p className="text-brand-subtle text-xs font-mono mb-4">{brand.taglineAlt}</p>
            <a href={brand.domain} className="text-brand-subtle text-xs font-mono hover:text-brand-muted transition-colors duration-200" aria-label="Visit EZE IRL website">
              {brand.domain.replace("https://", "")}
            </a>
            <nav aria-label="EZE ecosystem" className="mt-6">
              <p className="text-brand-white text-xs font-mono tracking-widest uppercase mb-3">THE ECOSYSTEM</p>
              <ul className="space-y-2">
                <li><Link href="/" className="text-brand-muted hover:text-brand-white text-sm transition-colors duration-200">EZE IRL <span className="text-brand-subtle text-xs">— the lifestyle</span></Link></li>
                <li><Link href="/eze-fit" className="text-brand-muted hover:text-white text-sm transition-colors duration-200">EZE-FIT <span className="text-brand-subtle text-xs">— the technology</span></Link></li>
                <li><Link href="/merch" className="text-brand-muted hover:text-white text-sm transition-colors duration-200">EZE // FORM <span className="text-brand-subtle text-xs">— the apparel</span></Link></li>
              </ul>
            </nav>
          </div>

          {/* Social */}
          <div>
            <p className="text-brand-white text-xs font-mono tracking-widest uppercase mb-5">FOLLOW</p>
            <nav aria-label="Social media links">
              <ul className="space-y-3">
                {Object.entries(social).map(([key, entry]) => (
                  <li key={key}>
                    {entry.url ? (
                      <a href={entry.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-brand-muted hover:text-brand-white text-sm transition-colors duration-200 group" aria-label={`Follow EZE IRL on ${entry.label}`}>
                        <span className="text-brand-subtle group-hover:text-brand-red transition-colors duration-200">{socialIcons[key]}</span>
                        {entry.label}
                      </a>
                    ) : (
                      <span className="flex items-center gap-3 text-brand-subtle/40 text-sm cursor-default" aria-label={`${entry.label} — coming soon`}>
                        <span className="opacity-30">{socialIcons[key]}</span>
                        {entry.label}
                        <span className="text-[10px] font-mono tracking-widest border border-brand-border/30 px-1.5 py-0.5 text-brand-subtle/30">SOON</span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <p className="text-brand-white text-xs font-mono tracking-widest uppercase mb-5">LEGAL & BUSINESS</p>
            <a href={`mailto:${brand.email}`} className="text-brand-muted hover:text-brand-gold text-sm font-mono transition-colors duration-200 block mb-4">{brand.email}</a>
            <nav aria-label="Legal and business links">
              <ul className="space-y-2">
                {legalLinks.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-brand-subtle hover:text-brand-muted text-xs font-mono tracking-wide transition-colors duration-200">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
      <div className="border-t border-brand-border/20">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-brand-subtle text-xs font-mono">© {new Date().getFullYear()} EZE Media. All rights reserved.</p>
          <p className="text-brand-subtle/40 text-xs font-mono">BAD DECISIONS. BETTER STORIES.</p>
        </div>
      </div>
    </footer>
  );
}
