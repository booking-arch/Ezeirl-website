"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/universe/motion";

/** Decorative animated lime grid behind the EZE-FIT hero. Canvas 2D, capped at 2x DPR, static under reduced motion. */
export default function VoxelField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const still = prefersReducedMotion();
    let frame = 0;
    let t = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      const cellW = (w - 60) / 14;
      const cellH = (h - 44) / 10;
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 14; col++) {
          const v = (Math.sin(col * 0.55 + t) * Math.cos(row * 0.4 + t * 0.7) + 1) * 0.5;
          if (v < 0.35) continue;
          ctx.fillStyle = `rgba(124, 255, 85, ${0.08 + v * 0.28})`;
          ctx.fillRect(4 + col * (cellW + 4), 4 + row * (cellH + 4) - v * 6, cellW, cellH * (0.55 + v * 0.45));
        }
      }
      if (!still) { t += 0.018; frame = requestAnimationFrame(draw); }
    };
    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="voxel" aria-hidden />;
}
