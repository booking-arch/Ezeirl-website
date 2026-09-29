import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PartnershipSection from "@/components/PartnershipSection";
import EcosystemStrip from "@/components/ecosystem/EcosystemStrip";
import { jsonLd, SITE_URL } from "@/lib/json-ld";

const title = "Partnerships | EZE IRL";
const description =
  "EZE IRL partners with gyms, apparel, equipment, supplement, and creator brands that genuinely fit real training and real content. Reach out at booking@ezeirl.com.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/partnerships" },
  openGraph: { type: "website", url: `${SITE_URL}/partnerships`, siteName: "EZE IRL", title, description },
  twitter: { card: "summary_large_image", title, description },
};

export default function PartnershipsPage() {
  const structured = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${SITE_URL}/partnerships#page`,
    url: `${SITE_URL}/partnerships`,
    name: title,
    description,
    isPartOf: { "@type": "WebSite", name: "EZE IRL", url: SITE_URL },
    mainEntity: {
      "@type": "Organization",
      name: "EZE Media",
      url: SITE_URL,
      contactPoint: { "@type": "ContactPoint", contactType: "Partnerships", email: "booking@ezeirl.com" },
    },
  };

  return (
    <>
      <Navigation />
      <main id="main-content">
        {/* PartnershipSection's own heading is an <h2> (it also appears inline on the homepage,
            which has its own <h1> elsewhere) — this page needs its own top-level heading. */}
        <h1 className="sr-only">Partnerships — EZE IRL</h1>
        <PartnershipSection />
        <EcosystemStrip />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structured) }} />
    </>
  );
}
