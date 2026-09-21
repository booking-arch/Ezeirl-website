"use client";

import { useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import dynamic from "next/dynamic";
import Button from "./UI/Button";
import { brand } from "@/config/brand";
import { links } from "@/config/links";

const HeroEmblem3D = dynamic(() => import("./3D/HeroEmblem3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
      <div className="w-32 h-32 border border-brand-gold/20 animate-pulse rounded-sm" />
    </div>
  ),
});

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const parallaxX = useTransform(springX, [-0.5, 0.5], [-12, 12]);
  const parallaxY = useTransform(springY, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      id="home"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-brand-black"
      aria-labelledby="hero-heading"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(139,0,0,0.18) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(rgba(245,245,245,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,245,245,0.3) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
      </div>

      {/* 3D Emblem */}
      <motion.div style={{ x: parallaxX, y: parallaxY }} className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
        <div className="w-80 h-80 sm:w-96 sm:h-96 lg:w-[480px] lg:h-[480px] opacity-70">
          <HeroEmblem3D />
        </div>
      </motion.div>

      {/* Red flash */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 0.6, 0] }} transition={{ duration: 1.8, delay: 0.3, ease: "easeOut" }} className="absolute inset-0 z-5 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 40%, rgba(204,0,0,0.25) 0%, transparent 70%)" }} aria-hidden="true" />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-4 pt-20">
        <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.4 }} className="block text-brand-red-bright text-xs font-mono tracking-[0.35em] uppercase mb-6" aria-hidden="true">
          EZE IRL
        </motion.span>

        <h1 id="hero-heading" className="sr-only">EZE IRL — Bad Decisions. Better Stories.</h1>

        <div aria-hidden="true" className="overflow-hidden mb-3">
          <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}>
            <span className="block text-brand-white leading-none select-none" style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(52px, 11vw, 120px)", letterSpacing: "0.04em" }}>
              BAD DECISIONS.
            </span>
            <span className="block text-brand-red leading-none select-none" style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(52px, 11vw, 120px)", letterSpacing: "0.04em" }}>
              BETTER STORIES.
            </span>
          </motion.div>
        </div>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 2.4 }} className="text-brand-gold text-xs sm:text-sm font-mono tracking-[0.35em] uppercase mb-4">
          {brand.taglineAlt}
        </motion.p>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 2.7 }} className="text-brand-muted text-xs tracking-[0.2em] uppercase mb-10">
          {brand.themes.join(" • ")}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 2.9 }} className="flex flex-col sm:flex-row items-center gap-4">
          <Button variant="primary" size="lg" href={links.enterIRL}>ENTER THE IRL</Button>
          <Button variant="secondary" size="lg" href={links.joinMovement}>JOIN THE MOVEMENT</Button>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 3.6 }} className="mt-16 flex flex-col items-center gap-2" aria-hidden="true">
          <span className="text-brand-subtle text-xs tracking-widest uppercase font-mono">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="w-px h-8 bg-gradient-to-b from-brand-subtle to-transparent" />
        </motion.div>
      </div>

      {/* Creator portrait placeholder */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-15 w-64 sm:w-80 lg:w-96 pointer-events-none select-none" aria-hidden="true" data-placeholder="hero-creator-portrait">
        <div className="w-full aspect-[3/4] opacity-0" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-48 z-15 pointer-events-none" style={{ background: "linear-gradient(to top, #0a0a0a 0%, transparent 100%)" }} aria-hidden="true" />
    </section>
  );
}
