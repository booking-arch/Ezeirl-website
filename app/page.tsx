import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import StorySection from "@/components/StorySection";
import TileStrip from "@/components/TileStrip";
import IRLSection from "@/components/IRLSection";
import LifestyleSection from "@/components/LifestyleSection";
import ClosingCta from "@/components/ClosingCta";
import EzeFitReveal from "@/components/home/EzeFitReveal";
import EzeFormReveal from "@/components/home/EzeFormReveal";
import StreamSection from "@/components/StreamSection";
import PerformanceLab from "@/components/PerformanceLab";
import WatchSection from "@/components/WatchSection";
import PartnershipSection from "@/components/PartnershipSection";
import CommunitySection from "@/components/CommunitySection";
import Footer from "@/components/Footer";
import { isWaitlistEnabled } from "@/lib/waitlist/config";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  const waitlistEnabled = isWaitlistEnabled();
  return (
    <>
      <Navigation />
      <main id="main-content">
        <Hero />
        <StorySection />
        <TileStrip />
        <IRLSection />
        <LifestyleSection />
        <EzeFitReveal />
        <EzeFormReveal />
        <StreamSection />
        <PerformanceLab />
        <WatchSection />
        <PartnershipSection />
        <CommunitySection enabled={waitlistEnabled} />
        <ClosingCta />
      </main>
      <Footer />
    </>
  );
}
