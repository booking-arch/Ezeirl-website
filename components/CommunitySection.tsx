"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { env } from "@/config/env";

type FormState = "idle" | "submitting" | "success" | "error" | "no-provider";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CommunitySection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<FormState>(env.emailProvider ? "idle" : "no-provider");
  const [emailError, setEmailError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError("");
    if (!EMAIL_REGEX.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    if (!env.emailProvider) {
      setFormState("no-provider");
      return;
    }
    setFormState("submitting");
    try {
      // TODO: wire to env.emailProvider when approved
      // await submitEmail(email);
      await new Promise((res) => setTimeout(res, 800));
      setFormState("success");
      setEmail("");
    } catch {
      setFormState("error");
    }
  };

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

        <motion.div initial={{ opacity: 0, y: 30 }} animate={headerInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.4 }} className="max-w-md mx-auto">
          <AnimatePresence mode="wait">
            {formState === "no-provider" && (
              <motion.div key="no-provider" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border border-brand-border p-6 text-center">
                <p className="text-brand-white text-sm mb-1">Updates coming soon.</p>
                <p className="text-brand-subtle text-xs font-mono">We&apos;re finishing setup. Check back shortly or follow on social for live updates.</p>
              </motion.div>
            )}

            {formState === "success" && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }} className="border border-brand-red/40 p-8 text-center" role="status" aria-live="polite">
                <div className="w-8 h-8 border-2 border-brand-red rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M1 5L5 9L13 1" stroke="#1fe082" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <p className="text-brand-white font-display text-xl tracking-widest mb-2" style={{ fontFamily: "var(--font-bebas)" }}>YOU&apos;RE IN.</p>
                <p className="text-brand-muted text-sm">Welcome to the EZE Crew. Watch for updates.</p>
              </motion.div>
            )}

            {(formState === "idle" || formState === "submitting" || formState === "error") && (
              <motion.form key="form" onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3" noValidate aria-label="Join EZE IRL email signup">
                <div className="flex flex-col sm:flex-row gap-3">
                  <label htmlFor="community-email" className="sr-only">Email address</label>
                  <input id="community-email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setEmailError(""); }} placeholder="your@email.com" required disabled={formState === "submitting"} className="flex-1 bg-brand-graphite/60 border border-brand-border text-brand-white placeholder-brand-subtle px-4 py-3 text-sm font-mono focus:outline-none focus:border-brand-red/60 transition-colors duration-200 disabled:opacity-50" aria-required="true" aria-describedby={emailError ? "email-error" : undefined} aria-invalid={!!emailError} autoComplete="email" />
                  <button type="submit" disabled={formState === "submitting" || !email} className="px-6 py-3 bg-brand-red text-brand-black text-xs font-semibold tracking-widest uppercase hover:bg-brand-red-bright transition-colors duration-200 disabled:opacity-40 disabled:pointer-events-none" aria-label="Submit email signup">
                    {formState === "submitting" ? "JOINING..." : "JOIN"}
                  </button>
                </div>
                {emailError && <p id="email-error" className="text-brand-red-bright text-xs font-mono text-left" role="alert" aria-live="assertive">{emailError}</p>}
                {formState === "error" && <p className="text-brand-red-bright text-xs font-mono" role="alert" aria-live="assertive">Something went wrong. Please try again.</p>}
                <p className="text-brand-subtle text-xs font-mono leading-relaxed text-left">
                  By joining, you agree to receive occasional updates from EZE IRL. No spam. Unsubscribe anytime. See our <a href="/privacy" className="underline hover:text-brand-muted transition-colors">Privacy Policy</a>.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
