"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { observeReveals } from "@/lib/universe/motion";

/** Mounted once in the universe layout: scroll-reveals `.reveal` blocks and re-arms on every route change. */
export default function UniverseMotion() {
  const pathname = usePathname();
  useEffect(() => {
    window.scrollTo(0, 0);
    return observeReveals();
  }, [pathname]);
  return null;
}
