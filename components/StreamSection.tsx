"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { stream } from "@/config/stream";
import Button from "./UI/Button";

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function getTimeLeft(): TimeLeft {
  const diff = stream.date.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-brand-white font-display text-4xl sm:text-5xl lg:text-6xl tabular-nums" style={{ fontFamily: "var(--font-bebas)" }}>
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-brand-subtle text-xs font-mono tracking-widest uppercase">{label}</span>
    </div>
  );
}

export default function StreamSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true });
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft());
  const [mounted, setMounted] = useState(false);
  const isPast = stream.date.getTime() <= Date.now();

  useEffect(() => {
    setMounted(true);
    if (isPast) return;
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, [isPast]);

  const dateStr = stream.date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const timeStr = "6:00 – 8:00 PM Pacific";

  return (
    <section
      id="stream"
      ref={ref}
      className="py-24 sm:py-32 px-4 bg-brand-black relative overflow-hidden"
      aria-labelledby="stream-heading"
    >
      <div className="absolute top-0 left-0 right-0 h-px opacity-30" style={{ background: "linear-gradient(to right, transparent, #1fe082, transparent)" }} aria-hidden="true" />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(13,92,56,0.08) 0%, transparent 70%)" }} aria-hidden="true" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Draft badge */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 border border-brand-gold/40 px-3 py-1.5 mb-8" role="note" aria-label="Event planning status">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" aria-hidden="true" />
          <span className="text-brand-gold text-xs font-mono tracking-widest uppercase">Planned Event — Details Subject to Change</span>
        </motion.div>

        {/* Eyebrow */}
        <motion.span initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }} className="block text-brand-red-bright text-xs font-mono tracking-[0.3em] uppercase mb-4">
          First Public IRL Stream
        </motion.span>

        {/* Heading */}
        <motion.h2 id="stream-heading" initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.1 }} className="text-brand-white leading-[0.92] font-display mb-6" style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(36px, 7vw, 80px)", letterSpacing: "0.02em" }}>
          {stream.name}
        </motion.h2>

        {/* Date and time */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.2 }} className="flex flex-wrap gap-4 mb-10">
          <div className="border border-brand-border px-4 py-2">
            <p className="text-brand-muted text-xs font-mono tracking-widest uppercase mb-1">Date</p>
            <p className="text-brand-white text-sm font-semibold">{dateStr}</p>
          </div>
          <div className="border border-brand-border px-4 py-2">
            <p className="text-brand-muted text-xs font-mono tracking-widest uppercase mb-1">Time</p>
            <p className="text-brand-white text-sm font-semibold">{timeStr}</p>
          </div>
          <div className="border border-brand-border px-4 py-2">
            <p className="text-brand-muted text-xs font-mono tracking-widest uppercase mb-1">Platform</p>
            <p className="text-brand-white text-sm font-semibold">
              Planned: {stream.platform}
              {stream.platformStatus === "not-configured" && (
                <span className="ml-2 text-brand-subtle text-xs">(coming soon)</span>
              )}
            </p>
          </div>
          <div className="border border-brand-gold/30 bg-brand-gold/5 px-4 py-2">
            <p className="text-brand-gold text-xs font-mono tracking-widest uppercase mb-1">Location</p>
            <p className="text-brand-white text-sm">{stream.locationNote}</p>
          </div>
        </motion.div>

        {/* Countdown or past-event state */}
        {mounted && (
          isPast ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border border-brand-border bg-brand-card/30 p-8 mb-10 text-center">
              <p className="text-brand-muted text-sm font-mono tracking-widest uppercase mb-2">Stream Complete</p>
              <p className="text-brand-white text-lg">Check back for the replay and highlights.</p>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.3 }} className="mb-10">
              <p className="text-brand-muted text-xs font-mono tracking-widest uppercase mb-6">Countdown</p>
              <div className="flex items-start gap-6 sm:gap-10" role="timer" aria-label="Time until stream" aria-live="off">
                <CountdownUnit value={timeLeft.days} label="Days" />
                <span className="text-brand-border text-3xl sm:text-5xl font-display mt-1" aria-hidden="true">:</span>
                <CountdownUnit value={timeLeft.hours} label="Hours" />
                <span className="text-brand-border text-3xl sm:text-5xl font-display mt-1" aria-hidden="true">:</span>
                <CountdownUnit value={timeLeft.minutes} label="Minutes" />
                <span className="text-brand-border text-3xl sm:text-5xl font-display mt-1" aria-hidden="true">:</span>
                <CountdownUnit value={timeLeft.seconds} label="Seconds" />
              </div>
            </motion.div>
          )
        )}

        {/* Details grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.4 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="border border-brand-border/40 p-5">
            <p className="text-brand-red-bright text-xs font-mono tracking-widest uppercase mb-2">Concept</p>
            <p className="text-brand-muted text-sm leading-relaxed">{stream.concept}</p>
          </div>
          <div className="border border-brand-border/40 p-5">
            <p className="text-brand-red-bright text-xs font-mono tracking-widest uppercase mb-2">Crew</p>
            <p className="text-brand-muted text-sm">EZE + Brandon Leigh</p>
            <p className="text-brand-subtle text-xs mt-1">{stream.crewSize}-person production</p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.5 }} className="flex flex-col sm:flex-row gap-4 items-start">
          <Button variant="primary" size="lg" href="#community">NOTIFY ME</Button>
          {stream.platformUrl && (
            <Button variant="secondary" size="lg" href={stream.platformUrl} external>WATCH ON {stream.platform.toUpperCase()}</Button>
          )}
        </motion.div>

        <p className="mt-6 text-brand-subtle text-xs font-mono leading-relaxed">
          All event details are subject to location approval, platform setup, and final production planning. No gym or venue has been confirmed as of this date.
        </p>
      </div>
    </section>
  );
}
