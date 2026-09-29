"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Route-segment error boundary. Next.js already strips stack traces from what ships to the
 * browser in production, but without this file a crash falls back to a generic, unbranded
 * "Application error" page. This gives visitors the same on-brand treatment as the 404 page
 * instead. The underlying error is logged server-side (where Vercel's function logs capture it);
 * nothing about it — message, stack, digest — is ever rendered to the visitor.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Server-side/build log only; never shown to the visitor.
    console.error("[route error]", error.digest ?? error.message);
  }, [error]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-brand-black px-4 text-center text-brand-white">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(31,224,130,0.06) 0%, transparent 70%)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, #1fe082, transparent)", opacity: 0.4 }}
        aria-hidden="true"
      />

      <main className="relative z-10 mx-auto max-w-xl" id="main-content">
        <p className="mb-6 text-xs font-mono uppercase tracking-[0.35em] text-brand-red-bright">Something went wrong</p>
        <h1
          className="mb-4 font-display leading-none text-brand-white"
          style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(48px, 12vw, 110px)", letterSpacing: "0.04em" }}
        >
          WE HIT A<br />
          <span className="text-brand-red">SNAG.</span>
        </h1>
        <div className="mx-auto mb-6 h-px w-16" style={{ background: "rgba(31,224,130,0.5)" }} aria-hidden="true" />
        <p className="mb-10 max-w-md text-sm leading-relaxed text-brand-muted">
          We couldn&apos;t load that right now. Please try again — if it keeps happening, reach out at{" "}
          <a href="mailto:booking@ezeirl.com" className="underline hover:text-brand-white">
            booking@ezeirl.com
          </a>
          .
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex min-h-[52px] items-center gap-2 bg-brand-red px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-black transition-colors duration-200 hover:bg-brand-red-bright focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-red focus-visible:outline-offset-4"
          >
            TRY AGAIN
          </button>
          <Link
            href="/"
            className="inline-flex min-h-[52px] items-center gap-2 border border-brand-border px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-white transition-colors duration-200 hover:border-brand-white/40"
          >
            ← BACK TO EZE IRL
          </Link>
        </div>
      </main>
    </div>
  );
}
