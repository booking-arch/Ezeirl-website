import type { Metadata } from "next";
import AccountPanel from "@/components/auth/AccountPanel";

export const metadata: Metadata = {
  title: "Account | EZE IRL",
  description: "Your EZE IRL website account.",
  alternates: { canonical: "/account" },
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <>
      <div className="bg-brand-black px-4 pb-24 pt-28 sm:pt-32">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 font-mono text-xs tracking-[0.3em] text-brand-red-bright">EZE IRL</p>
          <h1 className="mb-8 font-display leading-[0.92] text-brand-white" style={{ fontFamily: "var(--font-oswald)", fontSize: "clamp(40px, 8vw, 80px)" }}>
            YOUR ACCOUNT
          </h1>
          <AccountPanel />
        </div>
      </div>
    </>
  );
}
