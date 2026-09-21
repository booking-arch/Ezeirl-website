"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const pillars = [
  {
    id: "fitness",
    label: "FITNESS",
    description:
      "Training hard in real gyms. Real weight. Real results. No performance, no filter.",
    accent: "#cc0000",
    symbol: "01",
  },
  {
    id: "competition",
    label: "COMPETITION",
    description:
      "Challenges with real stakes. Public goals. No excuses. The content that makes you put the phone down.",
    accent: "#cc0000",
    symbol: "02",
  },
  {
    id: "comedy",
    label: "COMEDY",
    description:
      "If you're not laughing at the process, you're missing the point. Wins, fails, and everything awkward in between.",
    accent: "#c9a84c",
    symbol: "03",
  },
  {
    id: "real-life",
    label: "REAL LIFE",
    description:
      "Conversations worth having. Adventures worth taking. The stuff that doesn't fit a template.",
    accent: "#c9a84c",
    symbol: "04",
  },
];

function PillarCard({ pillar, index }: { pillar: typeof pillars[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="group relative border border-brand-border bg-brand-card/30 p-6 sm:p-8 overflow-hidden cursor-default"
    >
      {/* Hover fill */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse 80% 80% at 50% 120%, ${pillar.accent}12 0%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* Number */}
      <span
        className="block text-xs font-mono mb-4 transition-colors duration-200"
        style={{ color: pillar.accent, letterSpacing: "0.2em" }}
      >
        {pillar.symbol}
      </span>

      {/* Label */}
      <h3
        className="text-brand-white text-2xl sm:text-3xl mb-3 font-display tracking-widest transition-colors duration-200 group-hover:opacity-90"
        style={{ fontFamily: "var(--font-bebas)" }}
      >
        {pillar.label}
      </h3>

      {/* Divider */}
      <div
        className="h-px w-10 mb-4 transition-all duration-300 group-hover:w-16"
        style={{ backgroundColor: pillar.accent }}
        aria-hidden="true"
      />

      {/* Description */}
      <p className="text-brand-muted text-sm leading-relaxed">
        {pillar.description}
      </p>

      {/* Corner accent */}
      <div
        className="absolute top-0 right-0 w-16 h-16 opacity-5 group-hover:opacity-10 transition-opacity duration-300"
        style={{ background: `linear-gradient(135deg, ${pillar.accent} 0%, transparent 100%)` }}
        aria-hidden="true"
      />
    </motion.div>
  );
}

export default function IRLSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <section
      id="irl"
      className="py-24 sm:py-32 px-4 bg-brand-black relative overflow-hidden"
      aria-labelledby="irl-heading"
    >
      {/* Section divider */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-20"
        style={{
          background: "linear-gradient(to right, transparent, #cc0000, transparent)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className="mb-16 sm:mb-20">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={headerInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="block text-brand-red text-xs font-mono tracking-[0.3em] uppercase mb-4"
          >
            THE IRL
          </motion.span>

          <motion.h2
            id="irl-heading"
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-brand-white leading-[0.92] font-display"
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(40px, 8vw, 90px)",
              letterSpacing: "0.02em",
            }}
          >
            FITNESS. COMEDY.
            <br />
            <span className="text-brand-muted/60">REAL CONVERSATIONS.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-6 text-brand-muted text-sm sm:text-base max-w-xl leading-relaxed"
          >
            EZE IRL follows the wins, mistakes, gains and unpredictable moments that make life worth watching.
          </motion.p>
        </div>

        {/* Pillars grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
          role="list"
          aria-label="Brand pillars"
        >
          {pillars.map((pillar, i) => (
            <div key={pillar.id} role="listitem">
              <PillarCard pillar={pillar} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
