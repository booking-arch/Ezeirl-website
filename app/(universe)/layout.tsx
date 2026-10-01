import type { Metadata } from "next";
import Script from "next/script";
import Footer from "@/components/universe/Footer";
import Nav from "@/components/universe/Nav";
import SoundDock from "@/components/universe/SoundDock";
import UniverseMotion from "@/components/universe/UniverseMotion";
import { SITE_ORIGIN } from "@/lib/universe/site";
import "./universe.css";
import "./universe-extra.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
};

// Google Analytics is OFF unless NEXT_PUBLIC_GA_ID is set (the live site used G-QQK088RQ5E). Setting it is a privacy-policy decision: AGENTS.md.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function UniverseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="universe"
      style={{ "--font-display": 'var(--font-oswald), "Bebas Neue", system-ui, sans-serif', "--font-condensed": "var(--font-oswald), sans-serif", "--font-script": "var(--font-caveat), cursive", "--font-body": "var(--font-inter), system-ui, sans-serif" } as React.CSSProperties}
    >
      <noscript>
        <style>{`.universe .reveal{opacity:1!important;transform:none!important}`}</style>
      </noscript>
      <Nav />
      <main id="main-content">{children}</main>
      <Footer />
      <SoundDock />
      <UniverseMotion />
      {GA_ID && /^G-[A-Z0-9]{6,12}$/.test(GA_ID) && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{send_page_view:true,anonymize_ip:true});`}</Script>
        </>
      )}
    </div>
  );
}
