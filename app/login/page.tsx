import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Log in | EZE IRL",
  description: "Log in to your EZE IRL website account.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <>
      <Navigation />
      <main id="main-content" className="bg-brand-black px-4 pb-24 pt-28 sm:pt-32">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 font-mono text-xs tracking-[0.3em] text-brand-red-bright">EZE IRL</p>
          <h1 className="font-display leading-[0.92] text-brand-white" style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(40px, 8vw, 80px)" }}>
            LOG IN
          </h1>
          <p className="mb-8 mt-4 max-w-md text-sm leading-relaxed text-brand-muted">
            Use the email and password for your EZE IRL account. This does not sign you into the private EZE-FIT app.
          </p>
          <AuthForm mode="login" />
        </div>
      </main>
      <Footer />
    </>
  );
}
