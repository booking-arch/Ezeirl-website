"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const labCategories = [
  {
    id: "pre-workout",
    label: "PRE-WORKOUT",
    description: "Energy. Focus. Drive. The compounds that flip the switch before training.",
    icon: "⚡",
    status: "PARTNER SLOT OPEN",
    accent: "#cc0000",
  },
  {
    id: "protein",
    label: "PROTEIN",
    description: "Recovery starts with the right fuel.",
    icon: "◈",
    status: "PARTNER SLOT OPEN",
    accent: "#c9a84c",
  },
  {
    id: "recovery",
    label: "RECOVERY",
    description: "Sleep. Repair. Adapt. The overlooked side of serious training.",
    icon: "◇",
    status: "PARTNER SLOT OPEN",
    accent: "#c9a84c",
  },
  {
    id: "hydration",
    label: "HYDRATION",
    description: "Every product here has to earn its place.",
    icon: "◉",
    status: "PARTNER SLOT OPEN",
    accent: "#cc0000",
  },
  {
    id: "performance",
    label: "PERFORMANCE",
    description: "Creatine. Nootropics. The compounds that sharpen output over time.",
    icon: "◆",
    status: "PARTNER SLOT OPEN",
    accent: "#c9a84c",
  },
];

function LabCard({ cat, index }: { cat: typeof labCategories[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative border border-brand-border/60 bg-brand-graphite/30 p-5 sm:p-6 overflow-hidden hover:border-brand-border transition-all duration-300"
      style={{ cursor: "default" }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(to right, transparent, ${cat.accent}80, transparent)` }}
        aria-hidden="true"
      />

      {/* Product image placeholder */}
      <div
        className="w-full aspect-video mb-5 flex items-center justify-center relative overflow-hidden"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.06)" }}
        data-placeholder={`${cat.id}-product-image`}
        aria-label={`${cat.label} product image placeholder`}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-3xl opacity-20" aria-hidden="true">{cat.icon}</span>
          <span className="text-brand-subtle text-xs font-mono tracking-widest uppercase">
            PRODUCT IMAGE
          </span>
        </div>
      </div>

      {/* Label */}
      <h3
        className="text-brand-white text-lg font-display tracking-widest mb-1"
        style={{ fontFamily: "var(--font-bebas)", color: cat.accent === "#c9a84c" ? "#e8c87a" : "#f5f5f5" }}
      >
        {cat.label}
      </h3>

      {/* Description */}
      <p className="text-brand-muted text-xs leading-relaxed mb-4">{cat.description}</p>

      {/* Partner slot badge */}
      <div
        className="inline-flex items-center gap-2 text-xs font-mono tracking-widest px-2 py-1"
        style={{
          border: `1px dashed ${cat.accent}40`,
          color: `${cat.accent}80`,
        }}
        aria-label="Partnership status"
      >
        <span className="w-1 h-1 rounded-full" style={{ backgroundColor: cat.accent, opacity: 0.5 }} aria-hidden="true" />
        {cat.status}
      </div>

      {/* Disclosure placeholder */}
      <p className="mt-3 text-brand-subtle/40 text-[10px] font-mono leading-tight">
        *Sponsorship disclosure will appear here when applicable.
      </p>
    </motion.div>
  );
}

export default function PerformanceLab() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <section
      id="lab"
      className="py-24 sm:py-32 px-4 bg-brand-black relative overflow-hidden"
      aria-labelledby="lab-heading"
    >
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-15"
        style={{ background: "linear-gradient(to right, transparent, #cc0000, transparent)" }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className="mb-14 sm:mb-18">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={headerInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="block text-brand-red text-xs font-mono tracking-[0.3em] uppercase mb-4"
          >
            EZE PERFORMANCE LAB
          </motion.span>
          <motion.h2
            id="lab-heading"
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-brand-white leading-[0.92] font-display mb-6"
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(36px, 7vw, 80px)",
              letterSpacing: "0.02em",
            }}
          >
            WHAT I TRAIN WITH.
            <br />
            <span className="text-brand-muted/50">WHAT I TEST.</span>
            <br />
            <span className="text-brand-muted/30">WHAT EARNS A SPOT.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-brand-muted text-sm max-w-lg leading-relaxed"
          >
            Nothing goes in the EZE Performance Lab without being used in real training. No
            random affiliate links. No products I haven&apos;t personally tested. This section will expand
            as partnerships are established and products earn the stamp.
          </motion.p>
        </div>

        {/* Cards */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
          role="list"
          aria-label="Performance Lab categories"
        >
          {labCategories.map((cat, i) => (
            <div key={cat.id} role="listitem">
              <LabCard cat={cat} index={i} />
            </div>
          ))}
        </div>

        {/* Sponsorship note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 border border-brand-border/40 p-5 bg-brand-graphite/20"
          role="note"
          aria-label="Sponsorship information"
        >
          <p className="text-brand-subtle text-xs font-mono leading-relaxed">
            <span className="text-brand-muted">PARTNERSHIPS & SPONSORSHIPS:</span> EZE IRL
            selectively partners with brands that align with real training and real standards. All
            sponsored content will be clearly disclosed. For partnership inquiries:{" "}
            <a
              href="mailto:booking@ezeirl.com?subject=Sponsorship+Inquiry"
              className="text-brand-gold hover:text-brand-gold-bright underline transition-colors"
            >
              booking@ezeirl.com
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
