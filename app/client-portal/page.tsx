import type { Metadata } from "next";
import ClientPortal from "@/components/portal/ClientPortal";

export const metadata: Metadata = {
  title: "Your Next Level | EZE IRL Client Portal",
  description: "Your next chapter starts here. Choose personal training or nutrition coaching with EZE IRL.",
  alternates: { canonical: "/client-portal" },
  robots: { index: false, follow: false },
};

export default function ClientPortalPage() {
  return <ClientPortal />;
}
