"use client";

import Link from "next/link";
import { useState } from "react";
import { normalizeEmail } from "@/lib/waitlist/normalize";
import { safeNext } from "@/lib/auth/validate";

type Mode = "login" | "register";

const inputClass =
  "mt-2 w-full border border-brand-border bg-brand-graphite/60 px-3 py-3 text-base text-brand-white placeholder:text-brand-subtle focus:border-brand-red/60 focus:outline-none";

export default function AuthForm({ mode }: { mode: Mode }) {
  const register = mode === "register";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [consent, setConsent] = useState(false);
  const [company, setCompany] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (pending) return;
    const nextErrors: Record<string, string> = {};
    if (!normalizeEmail(email)) nextErrors.email = "Enter a valid email address.";
    if (password.length < 10 || password.length > 72 || !/[a-z]/i.test(password) || !/[0-9]/.test(password)) {
      nextErrors.password = "Use 10 to 72 characters, with at least one letter and one number.";
    }
    if (register && password !== confirm) nextErrors.confirm = "Passwords do not match.";
    if (register && !consent) nextErrors.consent = "Agree to the privacy policy to create an account.";
    setErrors(nextErrors);
    setFormError("");
    if (Object.keys(nextErrors).length) return;

    setPending(true);
    try {
      const response = await fetch(register ? "/api/auth/register" : "/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password, consent, company }),
      });
      const data = (await response.json().catch(() => ({}))) as { message?: string; errors?: Record<string, string> };
      if (!response.ok) {
        if (data.errors) setErrors(data.errors);
        setFormError(data.message || "We couldn't do that right now. Please try again.");
        return;
      }
      const next = safeNext(new URLSearchParams(window.location.search).get("next"));
      window.location.assign(next ?? "/account");
    } catch {
      setFormError("We couldn't do that right now. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md border border-brand-border/60 bg-brand-card/20 p-5 sm:p-7" noValidate>
      <label className="absolute -left-[9999px]" aria-hidden="true">
        Company
        <input tabIndex={-1} autoComplete="off" value={company} onChange={(event) => setCompany(event.target.value)} />
      </label>

      <label className="block text-xs font-mono tracking-[0.2em] text-brand-muted" htmlFor="account-email">
        EMAIL
        <input
          id="account-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={inputClass}
          required
        />
      </label>
      {errors.email ? <p className="mt-2 text-sm text-brand-red-bright">{errors.email}</p> : null}

      <label className="mt-5 block text-xs font-mono tracking-[0.2em] text-brand-muted" htmlFor="account-password">
        PASSWORD
        <input
          id="account-password"
          name="password"
          type="password"
          autoComplete={register ? "new-password" : "current-password"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={inputClass}
          required
        />
      </label>
      {errors.password ? <p className="mt-2 text-sm text-brand-red-bright">{errors.password}</p> : null}

      {register ? (
        <>
          <label className="mt-5 block text-xs font-mono tracking-[0.2em] text-brand-muted" htmlFor="account-confirm">
            CONFIRM PASSWORD
            <input
              id="account-confirm"
              name="confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              className={inputClass}
              required
            />
          </label>
          {errors.confirm ? <p className="mt-2 text-sm text-brand-red-bright">{errors.confirm}</p> : null}
          <label className="mt-5 flex items-start gap-3 text-sm leading-relaxed text-brand-muted" htmlFor="account-consent">
            <input
              id="account-consent"
              name="consent"
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              className="mt-1 h-4 w-4"
            />
            <span>
              I agree to the <Link href="/privacy" className="underline underline-offset-2">privacy policy</Link>. This account is for EZE IRL only.
            </span>
          </label>
          {errors.consent ? <p className="mt-2 text-sm text-brand-red-bright">{errors.consent}</p> : null}
        </>
      ) : null}

      {formError ? (
        <p role="alert" className="mt-5 text-sm text-brand-red-bright">
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-brand-red px-6 text-sm font-semibold uppercase tracking-[0.18em] text-brand-black disabled:opacity-60"
      >
        {pending ? "Please wait" : register ? "Create account" : "Log in"}
      </button>

      <p className="mt-5 text-sm text-brand-muted">
        {register ? (
          <Link href="/login" className="underline underline-offset-2">Already have an account? Log in</Link>
        ) : (
          <Link href="/register" className="underline underline-offset-2">New here? Create an account</Link>
        )}
      </p>
    </form>
  );
}
