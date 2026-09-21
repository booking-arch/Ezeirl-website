"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { track, type AnalyticsEvent } from "@/lib/analytics";
import type { WaitlistInterest, WaitlistSource } from "@/lib/waitlist/interests";
import { normalizeEmail, normalizeFirstName } from "@/lib/waitlist/normalize";

type Tone = "fit" | "form";
type Phase = "idle" | "submitting" | "success" | "error" | "limited";

interface WaitlistFormProps {
  interests: WaitlistInterest[];
  source: WaitlistSource;
  /** From WAITLIST_ENABLED at build/deploy time. While false the form renders an honest "opening soon" panel. */
  enabled: boolean;
  tone: Tone;
  cta: string;
  success: string;
  successNote?: string;
  disabledTitle?: string;
  disabledNote: string;
  consentLabel: string;
  showFirstName?: boolean;
  analyticsEvent: AnalyticsEvent;
  analyticsSurface: string;
}

const styles: Record<Tone, { input: string; button: string; accent: string; panel: string }> = {
  fit: {
    input: "border-fit-line bg-fit-panel text-white placeholder:text-fit-mist/60 focus:border-fit-lime",
    button: "bg-fit-lime text-fit-ink hover:bg-white",
    accent: "text-fit-lime",
    panel: "border-fit-line bg-fit-panel/60",
  },
  form: {
    input: "border-form-line bg-form-ash text-form-bone placeholder:text-form-stone/60 focus:border-form-bone",
    button: "bg-form-bone text-form-ink hover:bg-white",
    accent: "text-form-bone",
    panel: "border-form-line bg-form-ash/60",
  },
};

function utmCampaign(): string | undefined {
  const c = new URLSearchParams(window.location.search).get("utm_campaign")?.trim();
  return c && /^[a-z0-9][a-z0-9_.:-]{0,63}$/i.test(c) ? c : undefined;
}

function referrerHost(): string | undefined {
  try {
    if (!document.referrer) return undefined;
    const host = new URL(document.referrer).hostname;
    return host && host !== window.location.hostname ? host.slice(0, 100) : undefined;
  } catch {
    return undefined;
  }
}

export default function WaitlistForm(props: WaitlistFormProps) {
  const { interests, source, enabled, tone, cta, success, successNote, disabledNote, consentLabel, showFirstName = true } = props;
  const s = styles[tone];
  const uid = useId();
  const successRef = useRef<HTMLHeadingElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [errors, setErrors] = useState<{ email?: string; firstName?: string; form?: string }>({});
  const [serverDisabled, setServerDisabled] = useState(false);

  useEffect(() => {
    if (phase === "success") successRef.current?.focus();
  }, [phase]);

  if (!enabled || serverDisabled) {
    return (
      <div className={`border p-6 ${s.panel}`}>
        <p className={`font-display text-2xl tracking-[0.08em] ${s.accent}`}>{props.disabledTitle ?? "OPENING SOON"}</p>
        <p className="mt-2 text-sm leading-relaxed text-white/70">{disabledNote}</p>
      </div>
    );
  }

  if (phase === "success") {
    return (
      <div className={`border p-6 ${s.panel}`} role="status">
        <h3 ref={successRef} tabIndex={-1} className={`font-display text-3xl tracking-[0.08em] outline-none ${s.accent}`}>
          {success}
        </h3>
        {successNote && <p className="mt-2 text-sm leading-relaxed text-white/70">{successNote}</p>}
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const email = String(form.get("email") ?? "");
    const firstName = String(form.get("firstName") ?? "");
    const next: typeof errors = {};
    if (!normalizeEmail(email)) next.email = "Enter a valid email address.";
    if (normalizeFirstName(firstName) === undefined) next.firstName = "Use letters only for your first name.";
    setErrors(next);
    if (next.email || next.firstName) {
      // Move focus to the first invalid field (by name: React has not re-rendered aria-invalid yet).
      (formEl.elements.namedItem(next.email ? "email" : "firstName") as HTMLElement | null)?.focus();
      return;
    }

    setPhase("submitting");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName: firstName || undefined,
          interests,
          source,
          consent: form.get("consent") === "on",
          campaign: utmCampaign(),
          referral: referrerHost(),
          website: String(form.get("website") ?? ""),
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setPhase("success");
        track(props.analyticsEvent, { surface: props.analyticsSurface, interest: interests[0], campaign: utmCampaign(), referrer_host: referrerHost() });
        return;
      }
      if (res.status === 503 && data.code === "disabled") return setServerDisabled(true);
      if (res.status === 422 && data.errors) {
        setErrors({ email: data.errors.email, firstName: data.errors.firstName, form: data.errors.email || data.errors.firstName ? undefined : "Something looks off. Please check and try again." });
        return setPhase("idle");
      }
      if (res.status === 429) return setPhase("limited");
      setPhase("error");
    } catch {
      setPhase("error");
    }
  }

  const busy = phase === "submitting";
  const emailId = `${uid}-email`;
  const nameId = `${uid}-name`;

  return (
    <form onSubmit={onSubmit} noValidate aria-label={cta} className="space-y-4">
      {/* Honeypot: hidden from people and assistive tech. Bots fill it; the server discards those. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className={`grid gap-4 ${showFirstName ? "sm:grid-cols-2" : ""}`}>
        <div>
          <label htmlFor={emailId} className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.2em] text-white/70">
            Email <span className="text-white/50">(required)</span>
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            enterKeyHint="send"
            required
            disabled={busy}
            aria-required="true"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? `${emailId}-err` : undefined}
            placeholder="you@email.com"
            className={`min-h-[48px] w-full border px-4 py-3 text-base outline-none transition-colors disabled:opacity-60 ${s.input}`}
          />
          {errors.email && (
            <p id={`${emailId}-err`} role="alert" className="mt-1.5 font-mono text-xs text-red-400">
              {errors.email}
            </p>
          )}
        </div>

        {showFirstName && (
          <div>
            <label htmlFor={nameId} className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.2em] text-white/70">
              First name <span className="text-white/50">(optional)</span>
            </label>
            <input
              id={nameId}
              name="firstName"
              type="text"
              autoComplete="given-name"
              disabled={busy}
              aria-invalid={errors.firstName ? true : undefined}
              aria-describedby={errors.firstName ? `${nameId}-err` : undefined}
              className={`min-h-[48px] w-full border px-4 py-3 text-base outline-none transition-colors disabled:opacity-60 ${s.input}`}
            />
            {errors.firstName && (
              <p id={`${nameId}-err`} role="alert" className="mt-1.5 font-mono text-xs text-red-400">
                {errors.firstName}
              </p>
            )}
          </div>
        )}
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-sm leading-snug text-white/70">
        <input type="checkbox" name="consent" disabled={busy} className="mt-0.5 h-5 w-5 shrink-0 accent-current" style={{ accentColor: tone === "fit" ? "#c6f432" : "#ece6da" }} />
        <span>
          {consentLabel} <span className="text-white/50">(optional)</span>
        </span>
      </label>

      <button
        type="submit"
        disabled={busy}
        aria-busy={busy}
        className={`inline-flex min-h-[52px] w-full items-center justify-center px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] transition-colors disabled:opacity-60 sm:w-auto ${s.button}`}
      >
        {busy ? "SENDING…" : cta}
      </button>

      <div aria-live="polite" className="min-h-[1.25rem]">
        {phase === "error" && (
          <p role="alert" className="font-mono text-xs text-red-400">
            Something went wrong. Please try again in a moment.
          </p>
        )}
        {phase === "limited" && (
          <p role="alert" className="font-mono text-xs text-red-400">
            Too many attempts. Please wait a few minutes and try again.
          </p>
        )}
        {errors.form && (
          <p role="alert" className="font-mono text-xs text-red-400">
            {errors.form}
          </p>
        )}
      </div>

      <p className="font-mono text-[11px] leading-relaxed text-white/50">
        We only use your email to contact you about this list. See our{" "}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-white">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}
