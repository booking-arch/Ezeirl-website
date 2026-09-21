import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import IRLSection from "@/components/IRLSection";
import EzeFitReveal from "@/components/home/EzeFitReveal";
import EzeFormReveal from "@/components/home/EzeFormReveal";
import StreamSection from "@/components/StreamSection";
import PerformanceLab from "@/components/PerformanceLab";
import WatchSection from "@/components/WatchSection";
import PartnershipSection from "@/components/PartnershipSection";
import CommunitySection from "@/components/CommunitySection";
import Footer from "@/components/Footer";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main id="main-content">
        <Hero />
        <IRLSection />
        <EzeFitReveal />
        <EzeFormReveal />
        <StreamSection />
        <PerformanceLab />
        <WatchSection />
        <PartnershipSection />
        <CommunitySection />
      </main>
      <Footer />
    </>
  );
}
