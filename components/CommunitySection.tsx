"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import WaitlistForm from "./ecosystem/WaitlistForm";

/**
 * Real signup, wired to this site's own gated /api/waitlist (see lib/waitlist/*) — replaces the
 * previous stub that checked a never-configured `env.emailProvider` and faked success with a
 * setTimeout. WAITLIST_ENABLED still governs collection; while it's off this renders an honest
 * "opening soon" panel via WaitlistForm, same as every other signup on the site.
 *
 * `enabled` MUST be computed by a server component (isWaitlistEnabled() reads a server-only env
 * var) and passed down — calling it directly inside this "use client" component would read
 * `undefined` in the browser after hydration (client bundles only inline NEXT_PUBLIC_* vars),
 * causing the server-rendered form and the client's re-render to disagree and desync.
 */
export default function CommunitySection({ enabled }: { enabled: boolean }) {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <section id="community" className="py-24 sm:py-32 px-4 relative overflow-hidden" style={{ background: "linear-gradient(to bottom, #0a0a0a, #0b0b0b)" }} aria-labelledby="community-heading">
      <div className="absolute top-0 left-0 right-0 h-px opacity-20" style={{ background: "linear-gradient(to right, transparent, #1fe082, transparent)" }} aria-hidden="true" />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(31,224,130,0.05) 0%, transparent 70%)" }} aria-hidden="true" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div ref={headerRef}>
          <motion.span initial={{ opacity: 0, y: 10 }} animate={headerInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="block text-brand-red-bright text-xs font-mono tracking-[0.3em] uppercase mb-6">
            THE EZE CREW
          </motion.span>

          <motion.h2 id="community-heading" initial={{ opacity: 0, y: 30 }} animate={headerInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.1 }} className="text-brand-white leading-[0.92] font-display mb-6" style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(36px, 7vw, 80px)", letterSpacing: "0.02em" }}>
            THIS ISN&apos;T JUST CONTENT.
            <br />
            <span className="text-brand-muted/80">IT&apos;S A MOVEMENT.</span>
          </motion.h2>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={headerInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.3 }} className="mb-10">
            <p className="text-brand-muted text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
              Join the EZE Crew — first access to gear drops, stream alerts, challenges, and content. No spam. Only what matters.
            </p>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={headerInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.4 }} className="max-w-md mx-auto text-left">
          <WaitlistForm
            interests={["eze_irl_community"]}
            source="homepage"
            enabled={enabled}
            tone="irl"
            cta="JOIN"
            success="YOU'RE IN."
            successNote="Welcome to the EZE Crew. Watch for updates."
            disabledTitle="UPDATES COMING SOON"
            disabledNote="We're finishing setup. Check back shortly or follow on social for live updates."
            consentLabel="Send me EZE IRL updates: gear drops, streams, and challenges."
            showFirstName={false}
            analyticsEvent="eze_irl_community_signup"
            analyticsSurface="community_homepage"
          />
        </motion.div>
      </div>
    </section>
  );
}
