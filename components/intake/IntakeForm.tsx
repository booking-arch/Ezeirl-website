"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { type IntakeQuestion } from "@/config/intake";
import { getCoachingIntake, type CoachingService } from "@/config/coaching";
import { validateAnswer, type IntakeAnswer } from "@/lib/intake/validate";

type Phase = "idle" | "submitting" | "success" | "error" | "limited";
type Answers = Record<string, IntakeAnswer>;
type Errors = Record<string, string>;

const field = "min-h-[48px] w-full border border-brand-border bg-brand-graphite/60 px-4 py-3 text-base text-brand-white outline-none transition-colors placeholder:text-brand-subtle focus:border-brand-red/60 disabled:opacity-60";
const labelCls = "mb-1.5 block text-sm leading-snug text-brand-white";
const errCls = "mt-1.5 font-mono text-xs text-red-400";

export default function IntakeForm({ enabled, service = "personal-training", guided = false }: { enabled: boolean; service?: CoachingService; guided?: boolean }) {
  const intake = getCoachingIntake(service);
  const sections = intake.sections;
  const uid = useId();
  const successRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const didStep = useRef(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [phase, setPhase] = useState<Phase>("idle");
  const [serverDisabled, setServerDisabled] = useState(false);

  useEffect(() => {
    if (phase === "success") successRef.current?.focus();
  }, [phase]);

  useEffect(() => {
    if (didStep.current) stepHeading.current?.focus();
    didStep.current = true;
  }, [step]);

  if (!enabled || serverDisabled) {
    return (
      <div className="rounded border border-brand-border bg-brand-card/40 p-6">
        <p className="font-display text-2xl tracking-[0.08em] text-brand-red-bright">OPENING SOON</p>
        <p className="mt-2 text-sm leading-relaxed text-white/70">
          The new-client questionnaire isn’t open yet. Check back soon, or reach out through the{" "}
          <Link href="/contact" className="underline underline-offset-2 hover:text-white">contact page</Link>.
        </p>
      </div>
    );
  }

  if (phase === "success") {
    return (
      <div className="border border-brand-border bg-brand-card/40 p-6" role="status">
        <h2 ref={successRef} tabIndex={-1} className="font-display text-3xl tracking-[0.08em] text-brand-red-bright outline-none">
          THANK YOU — GOT IT.
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-white/70">Your {intake.title.toLowerCase()} questionnaire was received. I’ll review it and reach out to plan next steps.</p>
        {guided && <Link href="/client-portal" className="mt-6 inline-block text-sm text-brand-red-bright underline underline-offset-4">Back to your portal</Link>}
      </div>
    );
  }

  const set = (id: string, v: IntakeAnswer) => {
    setAnswers((a) => ({ ...a, [id]: v }));
    if (errors[id]) setErrors((e) => Object.fromEntries(Object.entries(e).filter(([k]) => k !== id)));
  };

  function focusError(id: string) {
    requestAnimationFrame(() => {
      const el = formRef.current?.querySelector<HTMLElement>(`[data-q="${id}"]`);
      el?.scrollIntoView({ block: "center", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      el?.querySelector<HTMLElement>("input,textarea")?.focus({ preventScroll: true });
    });
  }

  function nextStep() {
    const next: Errors = {};
    for (const q of sections[step].questions) {
      const result = validateAnswer(q, answers[q.id]);
      if ("error" in result) next[q.id] = result.error;
    }
    setErrors(next);
    if (Object.keys(next).length) return focusError(Object.keys(next)[0]);
    setStep((value) => value + 1);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (phase === "submitting") return;
    if (guided && step < sections.length) return nextStep();
    const formEl = e.currentTarget;
    const next: Errors = {};
    for (const q of sections.flatMap((s) => s.questions)) {
      const r = validateAnswer(q, answers[q.id]);
      if ("error" in r) next[q.id] = r.error;
    }
    if (!consent) next.consent = "Please confirm to continue.";
    setErrors(next);
    const firstBad = Object.keys(next)[0];
    if (firstBad) {
      if (guided && firstBad !== "consent") setStep(sections.findIndex((s) => s.questions.some((q) => q.id === firstBad)));
      focusError(firstBad);
      return;
    }

    setPhase("submitting");
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service, answers, consent, website: String(new FormData(formEl).get("website") ?? "") }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok === true) { setAnswers({}); setConsent(false); return setPhase("success"); }
      if (res.status === 503 && data.code === "disabled") return setServerDisabled(true);
      if (res.status === 422 && data.errors) {
        setErrors(data.errors);
        const first = Object.keys(data.errors)[0];
        const index = sections.findIndex((s) => s.questions.some((q) => q.id === first));
        if (guided && index >= 0) setStep(index);
        focusError(first);
        return setPhase("idle");
      }
      setPhase(res.status === 429 ? "limited" : "error");
    } catch {
      setPhase("error");
    }
  }

  const busy = phase === "submitting";

  function renderQuestion(q: IntakeQuestion) {
    const id = `${uid}-${q.id}`;
    const err = errors[q.id];
    const describedBy = err ? `${id}-err` : undefined;
    const errEl = err && (
      <p id={`${id}-err`} role="alert" className={errCls}>
        {err}
      </p>
    );
    const required = q.required ? <span className="text-brand-subtle"> (required)</span> : <span className="text-brand-subtle"> (optional)</span>;

    switch (q.type) {
      case "text":
      case "email":
      case "tel":
        return (
          <div data-q={q.id}>
            <label htmlFor={id} className={labelCls}>{q.label}{required}</label>
            <input
              id={id}
              type={q.type}
              inputMode={q.type === "tel" ? "tel" : q.type === "email" ? "email" : undefined}
              autoComplete={q.autoComplete}
              maxLength={q.max}
              disabled={busy}
              aria-required={q.required}
              aria-invalid={err ? true : undefined}
              aria-describedby={describedBy}
              value={(answers[q.id] as string) ?? ""}
              onChange={(e) => set(q.id, e.target.value)}
              className={field}
            />
            {errEl}
          </div>
        );
      case "textarea":
        return (
          <div data-q={q.id}>
            <label htmlFor={id} className={labelCls}>{q.label}{required}</label>
            {q.hint && <p className="mb-1.5 font-mono text-[11px] text-brand-subtle">{q.hint}</p>}
            <textarea
              id={id}
              rows={4}
              maxLength={q.max}
              disabled={busy}
              aria-required={q.required}
              aria-invalid={err ? true : undefined}
              aria-describedby={describedBy}
              value={(answers[q.id] as string) ?? ""}
              onChange={(e) => set(q.id, e.target.value)}
              className={`${field} resize-y`}
            />
            {errEl}
          </div>
        );
      case "yesno":
      case "radio":
      case "scale": {
        const opts =
          q.type === "yesno"
            ? [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]
            : q.type === "scale"
              ? Array.from({ length: q.max - q.min + 1 }, (_, i) => ({ value: String(q.min + i), label: String(q.min + i) }))
              : q.options;
        const inline = q.type !== "radio";
        return (
          <fieldset data-q={q.id} disabled={busy} aria-describedby={describedBy} className="min-w-0">
            <legend className={labelCls}>{q.label}{required}</legend>
            {q.type === "scale" && (
              <p className="mb-1.5 font-mono text-[11px] text-brand-subtle">1 = {q.lowLabel} · 5 = {q.highLabel}</p>
            )}
            <div className={inline ? "flex flex-wrap gap-3" : "space-y-2"}>
              {opts.map((o) => (
                <label key={o.value} className="flex min-h-[44px] cursor-pointer items-center gap-3 border border-brand-border bg-brand-graphite/40 px-4 py-2 text-sm text-white/85 has-[:checked]:border-brand-red/70 has-[:checked]:text-white">
                  <input
                    type="radio"
                    name={id}
                    value={o.value}
                    checked={answers[q.id] === o.value}
                    onChange={() => set(q.id, o.value)}
                    className="h-5 w-5 shrink-0"
                    style={{ accentColor: "#58f0a6" }}
                  />
                  {o.label}
                </label>
              ))}
            </div>
            {errEl}
          </fieldset>
        );
      }
      case "multi": {
        const sel = (answers[q.id] as string[] | undefined) ?? [];
        const full = q.maxSelect !== undefined && sel.length >= q.maxSelect;
        const short = q.options.every((o) => o.label.length <= 4);
        return (
          <fieldset data-q={q.id} disabled={busy} aria-describedby={describedBy} className="min-w-0">
            <legend className={labelCls}>{q.label}{required}</legend>
            <div className={short ? "flex flex-wrap gap-3" : "space-y-2"}>
              {q.options.map((o) => {
                const checked = sel.includes(o.value);
                return (
                  <label key={o.value} className="flex min-h-[44px] cursor-pointer items-center gap-3 border border-brand-border bg-brand-graphite/40 px-4 py-2 text-sm text-white/85 has-[:checked]:border-brand-red/70 has-[:checked]:text-white has-[:disabled]:opacity-50">
                    <input
                      type="checkbox"
                      value={o.value}
                      checked={checked}
                      disabled={!checked && full}
                      onChange={() => set(q.id, checked ? sel.filter((x) => x !== o.value) : [...sel, o.value])}
                      className="h-5 w-5 shrink-0"
                      style={{ accentColor: "#58f0a6" }}
                    />
                    {o.label}
                  </label>
                );
              })}
            </div>
            {errEl}
          </fieldset>
        );
      }
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-label={`${intake.title} questionnaire`} className="space-y-8">
      {guided && <div>
        <div className="mb-3 flex justify-between font-mono text-[10px] uppercase tracking-widest text-white/60"><span>{step === sections.length ? "Review & send" : `Step ${step + 1} of ${sections.length + 1}`}</span><span>{Math.round(step / sections.length * 100)}% complete</span></div>
        <div role="progressbar" aria-label="Questionnaire progress" aria-valuemin={0} aria-valuemax={sections.length} aria-valuenow={step} className="h-1 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-brand-red transition-all" style={{ width: `${step / sections.length * 100}%` }} /></div>
        <p className="mt-3 text-xs text-white/50">Your answers stay in this tab until you submit. Keep it open while you complete the form.</p>
      </div>}
      {/* Honeypot: hidden from people and assistive tech. Bots fill it; the server discards those. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {sections.map((s, i) => (!guided || step === i) && (
        <section key={s.id} aria-labelledby={`${uid}-${s.id}`} className="space-y-6">
          <div className="border-b border-brand-border pb-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-red-bright">Section {i + 1}</p>
            <h2 ref={guided ? stepHeading : undefined} tabIndex={guided ? -1 : undefined} id={`${uid}-${s.id}`} className="font-display text-3xl tracking-[0.06em] text-brand-white outline-none">{s.title}</h2>
            {s.intro && <p className="mt-2 text-sm text-white/70">{s.intro}</p>}
          </div>
          {s.questions.map((q) => (
            <div key={q.id}>{renderQuestion(q)}</div>
          ))}
        </section>
      ))}

      {guided && step < sections.length && <div className="flex items-center justify-between border-t border-white/10 pt-6">
        <button type="button" disabled={step === 0} onClick={() => { setErrors({}); setStep((value) => value - 1); }} className="min-h-12 px-4 text-sm text-white/70 disabled:invisible">← Back</button>
        <button type="submit" className="min-h-12 rounded-sm bg-brand-red px-7 text-sm font-semibold text-brand-black hover:bg-brand-red-bright">{step === sections.length - 1 ? "Review answers" : "Continue"} →</button>
      </div>}

      {guided && step === sections.length && <section aria-labelledby={`${uid}-review`}>
        <h2 id={`${uid}-review`} ref={stepHeading} tabIndex={-1} className="mb-2 font-display text-4xl outline-none">MAKE SURE IT FEELS LIKE YOU.</h2>
        <p className="mb-6 text-sm text-white/60">Review your answers, then send them to your coach.</p>
        <div className="space-y-4">{sections.map((section, index) => <div key={section.id} className="rounded border border-white/10 bg-white/[.02] p-5">
          <div className="mb-4 flex items-center justify-between gap-4"><h3 className="font-display text-2xl">{section.title}</h3><button type="button" disabled={busy} onClick={() => setStep(index)} aria-label={`Edit ${section.title}`} className="min-h-11 px-3 text-xs text-brand-red-bright underline underline-offset-4">Edit</button></div>
          <dl className="space-y-4">{section.questions.map((q) => {
            const answer = answers[q.id];
            const values = Array.isArray(answer) ? answer : [answer];
            const display = values.map((value) => {
              if (!value) return "Not provided";
              if (q.type === "radio" || q.type === "multi") return q.options.find((option) => option.value === value)?.label ?? value;
              if (q.type === "yesno") return value === "yes" ? "Yes" : "No";
              return value;
            }).join(", ");
            return <div key={q.id}><dt className="text-xs text-white/50">{q.label}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm text-white/85">{display}</dd></div>;
          })}</dl>
        </div>)}</div>
      </section>}

      {(!guided || step === sections.length) && <section className="space-y-4" data-q="consent">
        <p className="text-sm leading-relaxed text-white/70">{intake.disclaimer}</p>
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-snug text-white/85">
          <input
            type="checkbox"
            checked={consent}
            disabled={busy}
            onChange={(e) => { setConsent(e.target.checked); if (e.target.checked) setErrors((e) => Object.fromEntries(Object.entries(e).filter(([k]) => k !== "consent"))); }}
            aria-invalid={errors.consent ? true : undefined}
            className="mt-0.5 h-5 w-5 shrink-0"
            style={{ accentColor: "#58f0a6" }}
          />
          <span>{intake.consent} <span className="text-brand-subtle">(required)</span></span>
        </label>
        {errors.consent && <p role="alert" className={errCls}>{errors.consent}</p>}

        <button
          type="submit"
          disabled={busy}
          aria-busy={busy}
          className="inline-flex min-h-[52px] w-full items-center justify-center bg-brand-red px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-brand-black transition-colors hover:bg-brand-red-bright disabled:opacity-60 sm:w-auto"
        >
          {busy ? "SENDING…" : "SUBMIT QUESTIONNAIRE"}
        </button>

        <div aria-live="polite" className="min-h-[1.25rem]">
          {phase === "error" && <p role="alert" className="font-mono text-xs text-red-400">Something went wrong. Please try again in a moment.</p>}
          {phase === "limited" && <p role="alert" className="font-mono text-xs text-red-400">Too many attempts. Please wait a few minutes and try again.</p>}
          {Object.keys(errors).length > 0 && phase === "idle" && <p role="alert" className="font-mono text-xs text-red-400">Please fix the highlighted questions above.</p>}
        </div>

        <p className="font-mono text-[11px] leading-relaxed text-white/50">
          Your answers are used to inform your {intake.title.toLowerCase()}. See our{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-white">Privacy Policy</Link>.
        </p>
      </section>}
    </form>
  );
}
