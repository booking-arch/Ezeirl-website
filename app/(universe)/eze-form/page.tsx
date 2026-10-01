import type { Metadata } from "next";
import FormPage from "@/components/universe/form/FormPage";
import { BRAND_TITLES } from "@/lib/universe/site";

const description = "EZE//FORM Drop 001 · Fall 2026 — form follows discipline. A capsule in progress: boards, not a live shop. Get notified.";
export const metadata: Metadata = {
  title: BRAND_TITLES["eze-form"],
  description,
  alternates: { canonical: "/eze-form" },
  openGraph: { type: "website", url: "/eze-form", siteName: "EZE IRL", title: BRAND_TITLES["eze-form"], description, images: ["/universe/form/p1.webp"] },
  twitter: { card: "summary_large_image", title: BRAND_TITLES["eze-form"], description, images: ["/universe/form/p1.webp"] },
};

export default function Page() {
  return <FormPage />;
}
