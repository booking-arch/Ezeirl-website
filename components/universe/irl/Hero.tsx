"use client";

import { useEffect, useRef } from "react";
import { IMG } from "@/lib/universe/content";
import { EASE_OUT, prefersReducedMotion } from "@/lib/universe/motion";

const RAIL_LEFT = ["FITNESS", "LIFESTYLE", "DISCIPLINE", "MORE"];
const RAIL_STACK = ["TRAIN", "FUEL", "IMPROVE", "EXPLORE", "BUILD", "REPEAT"];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  // Entrance: background settles, then eyebrow / title lines / subtitle / buttons / rails fade up in sequence.
  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const run = (selector: string, from: Keyframe, at: number, duration: number, stagger = 0) =>
      el.querySelectorAll<HTMLElement>(selector).forEach((node, i) =>
        node.animate([from, { opacity: 1, transform: "none" }], { duration: duration * 1000, delay: (at + i * stagger) * 1000, easing: EASE_OUT, fill: "backwards" }),
      );
    run(".hero__bg img", { opacity: 0.4, transform: "scale(1.12)" }, 0, 1.6);
    run(".hero__eyebrow", { opacity: 0, transform: "translateY(20px)" }, 0.25, 0.7);
    run(".hero__title > span", { opacity: 0, transform: "translateY(60px)" }, 0.35, 0.9, 0.12);
    run(".hero__sub", { opacity: 0, transform: "translateY(24px)" }, 0.7, 0.7);
    run(".hero__ctas .btn", { opacity: 0, transform: "translateY(18px)" }, 0.85, 0.6, 0.1);
    run(".hero__rail", { opacity: 0 }, 0.9, 1);
  }, []);

  return (
    <section id="home" className="hero" ref={root}>
      <div className="hero__bg" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={IMG.hero1} alt="" fetchPriority="high" width={941} height={1672} />
        <div className="hero__veil" />
      </div>
      <aside className="hero__rail hero__rail--left" aria-hidden>
        {RAIL_LEFT.map((t) => <span key={t}>{t}</span>)}
      </aside>
      <div className="hero__content container">
        <p className="hero__eyebrow">EZE IRL · LA 2026</p>
        <h1 className="hero__title">
          <span className="hero__title-line">DISCIPLINE CREATES</span>
          <span className="hero__title-freedom script lime">FREEDOM</span>
        </h1>
        <p className="hero__sub">MORE THAN A WORKOUT. A HIGHER STATE.</p>
        <div className="hero__ctas">
          <a href="#content" className="btn btn-outline">WATCH THE JOURNEY</a>
          <a href="#about" className="btn btn-outline">EXPLORE EZE IRL</a>
        </div>
      </div>
      <aside className="hero__rail hero__rail--right" aria-hidden>
        <div className="hero__rail-block">
          <span>SAME MINDSET.</span>
          <span>A HIGHER YOU.</span>
        </div>
        <div className="hero__rail-block hero__rail-block--stack">
          {RAIL_STACK.map((t) => <span key={t}>{t}</span>)}
        </div>
        <p className="script lime hero__rail-script">Better THAN Yesterday.</p>
        <p className="hero__rail-year">LOS ANGELES 2026</p>
      </aside>
      <div className="hero__scroll" aria-hidden>
        <span>SCROLL</span>
        <i />
      </div>
    </section>
  );
}
