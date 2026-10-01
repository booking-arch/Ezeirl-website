import type { Metadata } from "next";
import FitPage from "@/components/universe/fit/FitPage";
import { BRAND_TITLES } from "@/lib/universe/site";

const description = "EZE-FIT private beta — track, train, fuel, learn, grow. Fitness made EZE. Join the early testers.";
export const metadata: Metadata = {
  title: BRAND_TITLES["eze-fit"],
  description,
  alternates: { canonical: "/eze-fit" },
  openGraph: { type: "website", url: "/eze-fit", siteName: "EZE IRL", title: BRAND_TITLES["eze-fit"], description, images: ["/universe/carousel/en-1.webp"] },
  twitter: { card: "summary_large_image", title: BRAND_TITLES["eze-fit"], description, images: ["/universe/carousel/en-1.webp"] },
};

export default function Page() {
  return <FitPage />;
}
