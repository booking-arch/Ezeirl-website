/** Small Web Animations helpers (no animation library). All of them are no-ops under prefers-reduced-motion. */
export const EASE_OUT = "cubic-bezier(.22, 1, .36, 1)";

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Reveal `.reveal` elements as they scroll into view. Returns a cleanup function. */
export function observeReveals(root: ParentNode = document): () => void {
  const targets = Array.from(root.querySelectorAll<HTMLElement>(".reveal"));
  const show = (el: HTMLElement) => {
    el.style.opacity = "1";
    el.style.transform = "none";
  };
  if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
    targets.forEach(show);
    return () => {};
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        io.unobserve(el);
        const anim = el.animate(
          [{ opacity: 0, transform: "translateY(36px)" }, { opacity: 1, transform: "none" }],
          { duration: 1000, easing: EASE_OUT, fill: "forwards" },
        );
        anim.finished.then(() => { show(el); anim.cancel(); }).catch(() => show(el));
      }
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
  );
  targets.forEach((el) => io.observe(el));
  return () => io.disconnect();
}
