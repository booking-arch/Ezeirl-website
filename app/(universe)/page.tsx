import type { Metadata } from "next";
import BrandSwitcher from "@/components/universe/BrandSwitcher";
import About from "@/components/universe/irl/About";
import Categories from "@/components/universe/irl/Categories";
import ContentHub from "@/components/universe/irl/ContentHub";
import EcosystemRail from "@/components/universe/irl/EcosystemRail";
import Hero from "@/components/universe/irl/Hero";
import Listen from "@/components/universe/irl/Listen";
import { BRAND_TITLES } from "@/lib/universe/site";

const description = "EZE IRL — Discipline creates freedom. Fitness. Lifestyle. EZE-FIT private beta. Built in Los Angeles.";
export const metadata: Metadata = {
  title: BRAND_TITLES.irl,
  description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", siteName: "EZE IRL", title: BRAND_TITLES.irl, description },
  twitter: { card: "summary_large_image", title: BRAND_TITLES.irl, description },
};

export default function HomePage() {
  return (
    <>
      <BrandSwitcher active="irl" />
      <Hero />
      <Categories />
      <About />
      <Listen />
      <BrandSwitcher active="irl" compact />
      <ContentHub />
      <EcosystemRail />
    </>
  );
}
