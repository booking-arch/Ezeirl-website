"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useMotionTier } from "@/hooks/useMotionTier";

/**
 * Slow horizontal drift of oversized type as it scrolls through the viewport. `full` tier only;
 * everywhere else it is a plain static block. Transform-only, no layout work, no scroll hijacking.
 */
export default function ScrollDrift({ children, from = 4, to = -4, className = "" }: { children: React.ReactNode; from?: number; to?: number; className?: string }) {
  const tier = useMotionTier();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], [`${from}%`, `${to}%`]);

  if (tier !== "full") return <div className={className}>{children}</div>;
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ x, willChange: "transform" }}>{children}</motion.div>
    </div>
  );
}
