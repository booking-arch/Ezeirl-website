import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import EcosystemStrip from "@/components/ecosystem/EcosystemStrip";
import TrackView from "@/components/ecosystem/TrackView";
import PhoneStory from "@/components/eze-fit/PhoneStory";
import { BetaAccess, BetaExplainer, FitDisclaimer, FitFaq, FitHero, StillTesting, StorySectionHeader } from "@/components/eze-fit/sections";
import { fitFaq } from "@/config/ecosystem";
import { jsonLd, SITE_URL } from "@/lib/json-ld";
import { isWaitlistEnabled } from "@/lib/waitlist/config";

const title = "EZE-FIT | Fitness Made EZE — Private Beta";
const description =
  "EZE-FIT is a fitness app for tracking meals, planning workouts and following progress. Now in private beta, available by invitation. Request beta access or join the launch waitlist.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/eze-fit" },
  openGraph: { type: "website", url: `${SITE_URL}/eze-fit`, siteName: "EZE IRL", title, description },
  twitter: { card: "summary_large_image", title, description },
};

export default function EzeFitPage() {
  const enabled = isWaitlistEnabled();

  const structured = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${SITE_URL}/eze-fit#page`,
      url: `${SITE_URL}/eze-fit`,
      name: title,
      description,
      isPartOf: { "@type": "WebSite", name: "EZE IRL", url: SITE_URL },
    },
    {
      // Facts only: no ratings, prices or store links exist, so none are claimed.
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "EZE-FIT",
      description: "Fitness app for tracking meals, planning workouts and following progress. Private beta, by invitation.",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Web",
      url: `${SITE_URL}/eze-fit`,
      publisher: { "@type": "Organization", name: "EZE Media", url: SITE_URL },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: fitFaq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  return (
    <div className="theme-fit bg-fit-ink text-white">
      <Navigation />
      <main id="main-content">
        <FitHero />
        <StorySectionHeader />
        <PhoneStory />
        <StillTesting />
        <BetaExplainer />
        <BetaAccess enabled={enabled} />
        <FitFaq />
        <FitDisclaimer />
        <EcosystemStrip current="fit" />
      </main>
      <Footer />
      <TrackView event="eze_fit_view" surface="eze_fit_page" />
      {structured.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(d) }} />
      ))}
    </div>
  );
}
