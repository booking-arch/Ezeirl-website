"use client";

import { useEffect, useState } from "react";

/**
 * static — prefers-reduced-motion: no movement at all, clean static layout.
 * lite   — touch / small screen / constrained device / data-saver: simple fades only, no tilt or parallax.
 * full   — capable desktop with a fine pointer: pointer-reactive depth and scroll-linked motion.
 *
 * The first render (server and client) is always "lite" so hydration matches; the real tier is
 * resolved in an effect. "lite" is a safe default: it never moves anything aggressively.
 */
export type MotionTier = "static" | "lite" | "full";

interface NavigatorHints extends Navigator {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
}

export function resolveMotionTier(): MotionTier {
  if (typeof window === "undefined") return "lite";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "static";

  const nav = navigator as NavigatorHints;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const wide = window.matchMedia("(min-width: 1024px)").matches;
  const saveData = nav.connection?.saveData === true;
  const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4;
  const fewCores = typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 4;

  return finePointer && wide && !saveData && !lowMemory && !fewCores ? "full" : "lite";
}

export function useMotionTier(): MotionTier {
  const [tier, setTier] = useState<MotionTier>("lite");

  useEffect(() => {
    const update = () => setTier(resolveMotionTier());
    update();
    const queries = [
      window.matchMedia("(prefers-reduced-motion: reduce)"),
      window.matchMedia("(hover: hover) and (pointer: fine)"),
      window.matchMedia("(min-width: 1024px)"),
    ];
    queries.forEach((q) => q.addEventListener("change", update));
    return () => queries.forEach((q) => q.removeEventListener("change", update));
  }, []);

  return tier;
}
