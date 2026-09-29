"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Button from "./UI/Button";
import { track } from "@/lib/analytics";

const categories = [
  { label: "Gyms & Fitness Facilities", description: "Filming collaborations, location partnerships, and member acquisition stories.", accent: "#1fe082" },
  { label: "Fitness Apparel", description: "Performance clothing that gets worn during actual training — not just photoshoots.", accent: "#d9d6cf" },
  { label: "Workout Accessories", description: "Straps, wraps, belts, bags — the gear that earns its place in the routine.", accent: "#d9d6cf" },
  { label: "Cameras & Livestream Gear", description: "Production equipment partnerships for quality real-life content.", accent: "#1fe082" },
  { label: "Supplements", description: "Pre-workout, protein, recovery, hydration — tested in real training. All disclosures included.", accent: "#d9d6cf" },
  { label: "Creators & Events", description: "Collab opportunities with aligned creators, competitions, and local events.", accent: "#1fe082" },
];

export default function PartnershipSection() {
  const ref = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <section
      id="partnerships"
      ref={ref}
      className="py-24 sm:py-32 px-4 relative overflow-hidden"
      style={{ background: "linear-gradient(to bottom, #0a0a0a, #0c0c0c, #0a0a0a)" }}
      aria-labelledby="partnership-heading"
    >
      <div className="absolute top-0 left-0 right-0 h-px opacity-15" style={{ background: "linear-gradient(to right, transparent, #d9d6cf, transparent)" }} aria-hidden="true" />

      <div className="max-w-6xl mx-auto">
        <div ref={headerRef} className="mb-14 sm:mb-18">
          <motion.span initial={{ opacity: 0, x: -20 }} animate={headerInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }} className="block text-brand-gold text-xs font-mono tracking-[0.3em] uppercase mb-4">
            PARTNERSHIPS
          </motion.span>
          <motion.h2 id="partnership-heading" initial={{ opacity: 0, y: 30 }} animate={headerInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.1 }} className="text-brand-white leading-[0.92] font-display mb-6" style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(36px, 7vw, 80px)", letterSpacing: "0.02em" }}>
            BUILT ON
            <br />
            <span className="text-brand-gold">AUTHENTICITY.</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={headerInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.25 }} className="text-brand-muted text-sm sm:text-base max-w-2xl leading-relaxed">
            EZE IRL is building authentic partnerships with gyms, fitness brands, equipment makers, apparel companies, supplement companies, events and creators. We promote only products and experiences that genuinely fit the content and audience.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12" role="list" aria-label="Partnership categories">
          {categories.map((cat, i) => (
            <motion.div key={cat.label} role="listitem" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.08 }} className="border border-brand-border/60 p-5 hover:border-brand-border transition-colors duration-300 group">
              <div className="w-6 h-px mb-4 group-hover:w-10 transition-all duration-300" style={{ backgroundColor: cat.accent }} aria-hidden="true" />
              <h3 className="text-brand-white text-sm font-semibold mb-2">{cat.label}</h3>
              <p className="text-brand-muted text-xs leading-relaxed">{cat.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Supplement disclosure */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="border border-brand-border/40 p-5 mb-8 bg-brand-graphite/10" role="note">
          <p className="text-brand-subtle text-xs font-mono leading-relaxed">
            <span className="text-brand-muted font-semibold">SUPPLEMENT DISCLOSURE POLICY:</span> Any future supplement partnerships will be clearly marked as sponsored or affiliate content. EZE IRL does not make medical claims or guarantee specific fitness outcomes. Individual results vary. Consult a qualified healthcare professional before starting any supplement regimen. EZE will only represent products he personally uses and believes in.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <p className="text-brand-muted text-sm mb-4">Ready to build something real together?</p>
          <Button
            variant="gold"
            size="lg"
            href="mailto:booking@ezeirl.com?subject=Partnership+Inquiry"
            onClick={() => track("partnership_cta", { surface: "partnerships" })}
          >
            PARTNERSHIP INQUIRY
          </Button>
          <p className="mt-3 text-brand-subtle text-xs font-mono">booking@ezeirl.com</p>
        </motion.div>
      </div>
    </section>
  );
}
