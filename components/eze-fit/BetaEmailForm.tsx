"use client";

import { FormEvent, useState } from "react";
import { track } from "@/lib/analytics";

interface BetaEmailFormProps {
  compact?: boolean;
  enabled: boolean;
  interest: "eze_fit_beta" | "eze_fit_launch";
  analyticsSurface: string;
}

/**
 * Single-field email capture matching the real EZE-FIT app's own <BetaSignupForm> exactly:
 * one email input, one button, an inline status message — no name field, no checkbox.
 * Wired to this site's own gated /api/waitlist (see lib/waitlist/*); WAITLIST_ENABLED still governs
 * whether it actually collects anything, same as every other form on the site.
 */
export default function BetaEmailForm({ compact = false, enabled, interest, analyticsSurface }: BetaEmailFormProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enabled) {
      setMessage("The public waitlist is opening soon. EZE-Fit beta access is currently invitation-only.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, interests: [interest], source: "eze_fit" }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.errors?.email || body.message || "We could not add you right now.");
      track("eze_fit_beta_signup", { surface: analyticsSurface, interest });
      setMessage("If your signup is eligible, you are on the EZE-Fit Beta list. We will keep you posted as beta access opens.");
      setEmail("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "We could not add you right now.");
    } finally {
      setBusy(false);
    }
  }

  const id = compact ? "beta-email-compact" : "beta-email";
  return (
    <form onSubmit={submit} className={compact ? "flex flex-col gap-3 sm:flex-row" : "mt-6 flex flex-col gap-3 sm:flex-row"}>
      <label className="sr-only" htmlFor={id}>
        Email address
      </label>
      <input
        id={id}
        className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-base text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-400"
        type="email"
        required
        maxLength={254}
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={busy}
      />
      <button
        type="submit"
        disabled={busy}
        className="min-h-[44px] whitespace-nowrap rounded-lg bg-emerald-400 px-6 py-3 font-bold text-slate-950 disabled:opacity-50"
      >
        {busy ? "Joining…" : "Join the Beta"}
      </button>
      {message && (
        <p className="basis-full text-sm text-emerald-300" role="status">
          {message}
        </p>
      )}
    </form>
  );
}
