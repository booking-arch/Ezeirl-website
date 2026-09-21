import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 — Page Not Found | EZE IRL",
  description: "This page doesn't exist. But the content does.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-black text-brand-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(204,0,0,0.06) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Top rule */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, #cc0000, transparent)",
          opacity: 0.4,
        }}
        aria-hidden="true"
      />

      <main className="relative z-10 text-center max-w-xl mx-auto" id="main-content">
        {/* Eyebrow */}
        <p className="text-brand-red-bright text-xs font-mono tracking-[0.35em] uppercase mb-6">
          Error 404
        </p>

        {/* Main heading */}
        <h1
          className="text-brand-white leading-none font-display mb-4"
          style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "clamp(64px, 18vw, 160px)",
            letterSpacing: "0.04em",
          }}
        >
          PAGE
          <br />
          <span className="text-brand-red">NOT FOUND</span>
        </h1>

        {/* Divider */}
        <div
          className="w-16 h-px mx-auto mb-6"
          style={{ background: "rgba(204,0,0,0.5)" }}
          aria-hidden="true"
        />

        {/* Body copy */}
        <p className="text-brand-muted text-sm font-mono tracking-wide leading-relaxed mb-2">
          This page doesn&apos;t exist. Bad decision to end up here.
        </p>
        <p className="text-brand-subtle text-xs font-mono leading-relaxed mb-10">
          But hey — better stories start with wrong turns.
        </p>

        {/* CTA */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-brand-red text-white text-xs font-semibold tracking-[0.2em] uppercase px-8 py-4 hover:bg-red-700 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-red focus-visible:outline-offset-4"
        >
          ← BACK TO EZE IRL
        </Link>
      </main>

      {/* Bottom rule */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, #2a2a2a, transparent)",
          opacity: 0.6,
        }}
        aria-hidden="true"
      />
    </div>
  );
}
