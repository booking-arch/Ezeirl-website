import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import EcosystemStrip from "@/components/ecosystem/EcosystemStrip";
import TrackView from "@/components/ecosystem/TrackView";
import { Collection, EarlyAccess, EditorialStatement, MerchFaq, MerchHero } from "@/components/merch/sections";
import { jsonLd, SITE_URL } from "@/lib/json-ld";
import { isWaitlistEnabled } from "@/lib/waitlist/config";

const title = "EZE // FORM | Drop 001 — Coming Soon";
const description =
  "EZE // FORM is the apparel line from EZE. Built for the work. Designed for everything after. Drop 001 is coming soon. Join the waitlist for first access.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/merch" },
  openGraph: { type: "website", url: `${SITE_URL}/merch`, siteName: "EZE IRL", title, description },
  twitter: { card: "summary_large_image", title, description },
};

export default function MerchPage() {
  const enabled = isWaitlistEnabled();

  // A collection page with NO products listed: no product, offer or price markup until they are real.
  const structured = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${SITE_URL}/merch#page`,
      url: `${SITE_URL}/merch`,
      name: title,
      description,
      isPartOf: { "@type": "WebSite", name: "EZE IRL", url: SITE_URL },
      about: { "@type": "Brand", name: "EZE // FORM" },
    },
  ];

  return (
    <div className="theme-form bg-form-ink text-form-bone">
      <Navigation />
      <main id="main-content">
        <MerchHero />
        <EditorialStatement />
        <Collection />
        <EarlyAccess enabled={enabled} />
        <MerchFaq />
        <EcosystemStrip current="form" />
      </main>
      <Footer />
      <TrackView event="merch_view" surface="merch_page" />
      {structured.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(d) }} />
      ))}
    </div>
  );
}
