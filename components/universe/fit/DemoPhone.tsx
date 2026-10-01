"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { DEMO_BOARD, DEMO_SCREENS, DEMO_TRACK_BARS, DEMO_TRAIN_CARDS, type DemoScreenId } from "@/lib/universe/content";
import { EASE_OUT, prefersReducedMotion } from "@/lib/universe/motion";

const AUTOPLAY_MS = 3200;

/**
 * Stylized interactive HUD inside a phone frame. It is a marketing demo, NOT the real app: every screen carries a
 * "demo / not live data" label (AGENTS.md: never fabricate app screens).
 */
const SCREENS: Record<DemoScreenId, () => ReactNode> = {
  home: () => (
    <div className="demo-screen demo-screen--home">
      <div className="demo-hud-row">
        <span className="demo-hud-chip">SYS ONLINE</span>
        <span className="demo-hud-chip demo-hud-chip--pulse">FP LINK</span>
      </div>
      <p className="demo-kicker">PLAYER READY</p>
      <div className="demo-ring" aria-hidden>
        <div className="demo-ring__aura" />
        <svg viewBox="0 0 120 120" className="demo-ring__svg">
          <circle cx="60" cy="60" r="48" className="demo-ring__track" />
          <circle cx="60" cy="60" r="48" className="demo-ring__progress" />
          <circle cx="60" cy="60" r="40" className="demo-ring__inner" />
        </svg>
        <div className="demo-ring__core">
          <span className="demo-ring__label">FitPoints</span>
          <span className="demo-ring__mark">FP</span>
          <span className="demo-ring__sub">DEMO RING</span>
        </div>
      </div>
      <p className="demo-badge">PRIVATE BETA</p>
      <p className="demo-hint">Stylized HUD · not live data</p>
    </div>
  ),
  train: () => (
    <div className="demo-screen demo-screen--train">
      <p className="demo-kicker">TRAIN</p>
      <h3 className="demo-title">Session picks</h3>
      <ul className="demo-cards">
        {DEMO_TRAIN_CARDS.map((c) => (
          <li key={c.name} className="demo-card">
            <span className="demo-card__tag">{c.tag}</span>
            <span className="demo-card__name">{c.name}</span>
            <span className="demo-card__chev" aria-hidden>→</span>
          </li>
        ))}
      </ul>
    </div>
  ),
  track: () => (
    <div className="demo-screen demo-screen--track">
      <p className="demo-kicker">TRACK</p>
      <h3 className="demo-title">Fuel style</h3>
      <p className="demo-hint">Visual percent bars · demo only</p>
      <ul className="demo-bars">
        {DEMO_TRACK_BARS.map((b) => (
          <li key={b.name} className="demo-bar">
            <div className="demo-bar__meta"><span>{b.name}</span><span className="lime">{b.pct}%</span></div>
            <div className="demo-bar__track"><div className="demo-bar__fill" style={{ width: `${b.pct}%` }} /></div>
          </li>
        ))}
      </ul>
    </div>
  ),
  grow: () => (
    <div className="demo-screen demo-screen--grow">
      <p className="demo-kicker">GROW</p>
      <h3 className="demo-title">Leaderboard</h3>
      <ul className="demo-board">
        {DEMO_BOARD.map((r) => (
          <li key={r.name} className={`demo-board__row${r.highlight ? " is-you" : ""}`}>
            <span className="demo-board__rank">{r.rank}</span>
            <span className="demo-board__name">{r.name}</span>
            <span className="demo-board__dot" aria-hidden />
          </li>
        ))}
      </ul>
      <p className="demo-hint">Placeholder names · promo style</p>
    </div>
  ),
  challenge: () => (
    <div className="demo-screen demo-screen--challenge">
      <p className="demo-kicker">CHALLENGE</p>
      <div className="demo-challenge">
        <p className="demo-challenge__week">WEEKEND CHALLENGE</p>
        <p className="demo-challenge__accept">CHALLENGE ACCEPTED</p>
        <div className="demo-challenge__pulse" aria-hidden />
        <div className="demo-challenge__scan" aria-hidden />
      </div>
      <p className="demo-badge">DEMO</p>
    </div>
  ),
};

export default function DemoPhone({ className = "" }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const panel = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const reduced = useRef(false);
  const count = DEMO_SCREENS.length;

  const go = useCallback((to: number, dir: 1 | -1 = 1) => {
    setDirection(dir);
    setIndex(((to % count) + count) % count);
  }, [count]);

  const restartAutoplay = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    if (reduced.current) return;
    timer.current = setInterval(() => { setDirection(1); setIndex((i) => (i + 1) % count); }, AUTOPLAY_MS);
  }, [count]);

  useEffect(() => {
    reduced.current = prefersReducedMotion();
    restartAutoplay();
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [restartAutoplay]);

  // Glitch-in transition for each new screen.
  useEffect(() => {
    const el = panel.current;
    if (!el || reduced.current) return;
    el.animate(
      [{ opacity: 0, transform: `translateX(${direction * 28}px)`, filter: "brightness(1.6) contrast(1.2)" }, { opacity: 1, transform: "none", filter: "brightness(1) contrast(1)" }],
      { duration: 420, easing: EASE_OUT },
    );
    el.parentElement?.querySelector<HTMLElement>(".demo-glitch")?.animate([{ opacity: 0.55 }, { opacity: 0 }], { duration: 350, easing: "ease-out" });
  }, [index, direction]);

  const current = DEMO_SCREENS[index];
  return (
    <div className={`phone phone--demo ${className}`}>
      <div className="phone__bezel">
        <div className="phone__notch" />
        <div className="phone__screen phone__screen--demo" role="region" aria-label="EZE-FIT app demo">
          <div className="demo-scanlines" aria-hidden />
          <div className="demo-grid" aria-hidden />
          <div className="demo-glitch" aria-hidden />
          <div className="demo-chrome">
            <span className="demo-chrome__mark">EZE-FIT</span>
            <span className="demo-chrome__demo"><span className="demo-chrome__live" aria-hidden />DEMO · PRIVATE BETA</span>
          </div>
          <div key={current.id} className="demo-panel" ref={panel}>{SCREENS[current.id]()}</div>
          <div className="demo-controls">
            <button type="button" className="demo-chev" aria-label="Previous demo screen" onClick={() => { go(index - 1, -1); restartAutoplay(); }}>‹</button>
            <div className="demo-nav" role="tablist" aria-label="Demo screens">
              {DEMO_SCREENS.map((s, i) => (
                <button key={s.id} type="button" role="tab" aria-selected={i === index} aria-label={s.label} className={`demo-dot${i === index ? " is-active" : ""}`} onClick={() => { go(i, i > index ? 1 : -1); restartAutoplay(); }} />
              ))}
            </div>
            <button type="button" className="demo-chev" aria-label="Next demo screen" onClick={() => { go(index + 1, 1); restartAutoplay(); }}>›</button>
          </div>
          <div className="phone__glass" />
          <div className="demo-edge-glow" aria-hidden />
        </div>
        <div className="phone__home" />
      </div>
      <div className="phone__glow phone__glow--demo" />
      <div className="phone__glow phone__glow--demo-outer" />
    </div>
  );
}
