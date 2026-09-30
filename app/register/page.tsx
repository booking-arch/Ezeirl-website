import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Create account | EZE IRL",
  description: "Create an EZE IRL website account.",
  alternates: { canonical: "/register" },
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <>
      <Navigation />
      <main id="main-content" className="bg-brand-black px-4 pb-24 pt-28 sm:pt-32">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 font-mono text-xs tracking-[0.3em] text-brand-red-bright">EZE IRL</p>
          <h1 className="font-display leading-[0.92] text-brand-white" style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(40px, 8vw, 80px)" }}>
            CREATE ACCOUNT
          </h1>
          <p className="mb-8 mt-4 max-w-md text-sm leading-relaxed text-brand-muted">
            One email and a password. You can log in on this website after that. EZE-FIT stays a separate private beta.
          </p>
          <AuthForm mode="register" />
        </div>
      </main>
      <Footer />
    </>
  );
}
