"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

// useLayoutEffect warns during SSR; this resolves to a no-op there.
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger in ms for siblings revealed together. */
  delay?: number;
  as?: "div" | "li" | "section" | "p" | "h2" | "h3";
}

/**
 * Scroll reveal built on CSS + IntersectionObserver (no animation library, no hydration cost).
 * Server HTML is fully visible, so it works without JavaScript. After mount, content that is
 * already on screen is left alone (never delays LCP); content below the fold is hidden and then
 * eased in once. Reduced motion: never hidden.
 */
export default function Reveal({ children, className = "", delay = 0, as = "div" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) return; // already visible on load

    el.dataset.reveal = "hidden";
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.dataset.reveal = "shown";
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as as React.ElementType;
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </Tag>
  );
}
