"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useMotionTier } from "@/hooks/useMotionTier";

interface PointerTiltProps {
  children: React.ReactNode;
  className?: string;
  /** Max rotation in degrees. Kept small: depth, not spectacle. */
  max?: number;
}

/**
 * Pointer-reactive tilt. Active only on the `full` tier (fine pointer, wide, capable device).
 * On touch, small screens, constrained devices and reduced motion it renders children untouched,
 * so nothing ever depends on hover. Uses transform only (compositor-friendly).
 */
export default function PointerTilt({ children, className = "", max = 7 }: PointerTiltProps) {
  const tier = useMotionTier();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-max, max]), { stiffness: 120, damping: 20 });
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [max, -max]), { stiffness: 120, damping: 20 });

  if (tier !== "full") return <div className={className}>{children}</div>;

  return (
    <div
      className={className}
      style={{ perspective: 1200 }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width - 0.5);
        y.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d", willChange: "transform" }}>{children}</motion.div>
    </div>
  );
}
