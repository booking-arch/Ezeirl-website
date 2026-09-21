"use client";

import { useEffect, useRef, useState } from "react";
import { ezeFitAssets, type FitScreenId } from "@/config/assets";
import { fitChapters } from "@/config/ecosystem";
import PhoneDevice from "@/components/ecosystem/PhoneDevice";
import PointerTilt from "@/components/ecosystem/PointerTilt";
import Reveal from "@/components/ecosystem/Reveal";

/**
 * Scroll-driven product story. NOT scroll-jacking: the page scrolls normally; the phone is simply
 * `position: sticky` on desktop and swaps which REAL screen it shows as each chapter crosses the
 * middle of the viewport (IntersectionObserver — no scroll listeners, no per-frame work).
 * Mobile: chapters read as plain stacked text, each with its own inline screen only if one exists.
 */
export default function PhoneStory() {
  const [active, setActive] = useState<FitScreenId>(fitChapters[0].id);
  const refs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.getAttribute("data-chapter") as FitScreenId);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    Object.values(refs.current).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="mx-auto grid max-w-6xl gap-x-16 px-4 lg:grid-cols-[minmax(0,320px)_1fr]">
      {/* Desktop: pinned device */}
      <div className="hidden lg:block">
        <div className="sticky top-1/2 -translate-y-1/2 py-10">
          <PointerTilt>
            <PhoneDevice screens={ezeFitAssets.screens} activeId={active} />
          </PointerTilt>
        </div>
      </div>

      <ol className="space-y-24 lg:space-y-0">
        {fitChapters.map((c, i) => {
          const screen = ezeFitAssets.screens[c.id];
          return (
            <li
              key={c.id}
              data-chapter={c.id}
              ref={(el) => {
                refs.current[c.id] = el;
              }}
              className="flex flex-col justify-center lg:min-h-[85vh]"
            >
              <Reveal>
                <p className="font-mono text-xs tracking-[0.3em] text-fit-lime">0{i + 1}</p>
                <h3 className="mt-3 font-display text-[clamp(56px,11vw,120px)] leading-[0.9] tracking-[0.02em] text-white">{c.word}</h3>
                <p className="mt-4 text-xl font-medium text-white">{c.title}</p>
                <p className="mt-3 max-w-md text-base leading-relaxed text-fit-mist">{c.body}</p>
                {c.beta && (
                  <p className="mt-4 inline-block border border-fit-teal/50 px-3 py-1 font-mono text-[11px] tracking-[0.2em] text-fit-teal">BETA</p>
                )}
                <ul className="mt-6 space-y-2">
                  {c.points.map((p) => (
                    <li key={p} className="flex items-center gap-3 text-sm text-white/80">
                      <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-fit-lime" />
                      {p}
                    </li>
                  ))}
                </ul>
              </Reveal>

              {/* Mobile/tablet: inline screen, only when a real capture exists */}
              {screen && (
                <div className="mt-10 lg:hidden">
                  <PhoneDevice screens={{ ...ezeFitAssets.screens, track: null, train: null, progress: null, understand: null, [c.id]: screen }} activeId={c.id} />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
