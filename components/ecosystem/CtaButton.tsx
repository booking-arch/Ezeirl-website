"use client";

import Link from "next/link";
import { track, type AnalyticsEvent } from "@/lib/analytics";

type Tone = "fit" | "fit-outline" | "form" | "form-outline" | "irl" | "irl-outline";

const tones: Record<Tone, string> = {
  fit: "bg-fit-lime text-fit-ink border-fit-lime hover:bg-white hover:border-white",
  "fit-outline": "bg-transparent text-white border-white/30 hover:border-fit-lime hover:text-fit-lime",
  form: "bg-form-bone text-form-ink border-form-bone hover:bg-white hover:border-white",
  "form-outline": "bg-transparent text-form-bone border-form-bone/40 hover:border-form-bone",
  irl: "bg-brand-red text-white border-brand-red hover:bg-brand-red-bright hover:border-brand-red-bright",
  "irl-outline": "bg-transparent text-brand-white border-brand-border hover:border-brand-white/50",
};

interface CtaButtonProps {
  href: string;
  tone: Tone;
  children: React.ReactNode;
  /** Analytics event fired on click. Never receives personal data. */
  event?: AnalyticsEvent;
  surface?: string;
  className?: string;
}

/** Link styled as a button (navigation, not form submission). 48px+ touch target. */
export default function CtaButton({ href, tone, children, event, surface, className = "" }: CtaButtonProps) {
  return (
    <Link
      href={href}
      onClick={event ? () => track(event, { surface }) : undefined}
      className={`inline-flex min-h-[52px] items-center justify-center border px-7 py-4 text-center text-xs font-semibold uppercase tracking-[0.2em] transition-colors duration-200 sm:text-sm ${tones[tone]} ${className}`}
    >
      {children}
    </Link>
  );
}
