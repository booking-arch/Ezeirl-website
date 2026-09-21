"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useMotionTier } from "@/hooks/useMotionTier";
import type { ImageAsset } from "@/config/assets";
import Photo from "./Photo";

interface Props {
  asset: ImageAsset;
  sizes: string;
  priority?: boolean;
  focal?: string;
  ungraded?: boolean;
  /** Vertical travel in % of the image height. Restrained by default. */
  travel?: number;
  className?: string;
}

/**
 * Photo with restrained scroll parallax. Only the `full` motion tier moves; touch, small screens,
 * constrained devices and reduced motion get the plain static crop. Transform-only.
 */
export default function ParallaxPhoto({ asset, sizes, priority, focal, ungraded, travel = 7, className = "" }: Props) {
  const tier = useMotionTier();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${travel}%`, `${travel}%`]);
  const moving = tier === "full";

  return (
    <div ref={ref} className={`relative h-full w-full overflow-hidden ${className}`}>
      <motion.div className="absolute inset-0" style={moving ? { y, scale: 1 + (travel * 2.2) / 100, willChange: "transform" } : undefined}>
        <Photo asset={asset} sizes={sizes} priority={priority} focal={focal} ungraded={ungraded} />
      </motion.div>
    </div>
  );
}
