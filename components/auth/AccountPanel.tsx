"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const inputClass =
  "mt-2 w-full border border-brand-border bg-brand-graphite/60 px-3 py-3 text-base text-brand-white focus:border-brand-red/60 focus:outline-none";

export default function AccountPanel() {
  const [email, setEmail] = useState<string | null>(null);
  const [coach, setCoach] = useState(false);
  const [ready, setReady] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/session", { cache: "no-store" })
      .then((response) => response.json())
      .then(async (data) => {
        if (cancelled) return;
        const signedIn = typeof data.email === "string" ? data.email : null;
        setEmail(signedIn);
        if (!signedIn) return;
        const coachResponse = await fetch("/api/coach/me", { cache: "no-store" }).catch(() => null);
        if (!cancelled) setCoach(Boolean(coachResponse?.ok));
      })
      .catch(() => {
        if (!cancelled) setEmail(null);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function logout() {
    setPending(true);
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    window.location.assign("/login");
  }

  async function changePassword(event: React.FormEvent) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = (await response.json().catch(() => ({}))) as { message?: string; errors?: { password?: string } };
      if (!response.ok) {
        setError(data.errors?.password || data.message || "We couldn't update that password. Please try again.");
        return;
      }
      setCurrentPassword("");
      setNewPassword("");
      setMessage("Password updated.");
    } catch {
      setError("We couldn't update that password. Please try again.");
    } finally {
      setPending(false);
    }
  }

  if (!ready) {
    return <p className="text-sm text-brand-muted">Checking your account…</p>;
  }

  if (!email) {
    return (
      <div className="max-w-md border border-brand-border/60 bg-brand-card/20 p-6">
        <p className="text-sm leading-relaxed text-brand-muted">Log in to open your EZE IRL account.</p>
        <Link href="/login?next=/account" className="mt-5 inline-flex min-h-[48px] items-center justify-center rounded-full bg-brand-red px-6 text-sm font-semibold uppercase tracking-[0.18em] text-brand-black">
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg space-y-8">
      <div className="border border-brand-border/60 bg-brand-card/20 p-5 sm:p-7">
        <p className="font-mono text-xs tracking-[0.2em] text-brand-muted">SIGNED IN AS</p>
        <p className="mt-2 break-all text-lg text-brand-white">{email}</p>
        <p className="mt-4 text-sm leading-relaxed text-brand-muted">
          This is your EZE IRL website account. It does not open the private EZE-FIT app.
        </p>
        <ul className="mt-5 space-y-2 text-sm">
          <li><Link className="inline-flex min-h-[44px] items-center underline underline-offset-2" href="/content">Browse the photographs</Link></li>
          <li><Link className="inline-flex min-h-[44px] items-center underline underline-offset-2" href="/eze-fit">EZE-FIT beta interest</Link></li>
          <li><Link className="inline-flex min-h-[44px] items-center underline underline-offset-2" href="/client-portal">Coaching portal</Link></li>
          {coach ? <li><Link className="inline-flex min-h-[44px] items-center underline underline-offset-2" href="/coach">Coach desk</Link></li> : null}
        </ul>
        <button type="button" onClick={logout} disabled={pending} className="mt-4 inline-flex min-h-[44px] items-center text-xs font-semibold uppercase tracking-[0.18em] text-brand-white underline underline-offset-4">
          Log out
        </button>
      </div>

      <form onSubmit={changePassword} className="border border-brand-border/60 bg-brand-card/20 p-5 sm:p-7">
        <h2 className="font-display text-2xl tracking-widest text-brand-white" style={{ fontFamily: "var(--font-oswald)" }}>CHANGE PASSWORD</h2>
        <label className="mt-4 block text-xs font-mono tracking-[0.2em] text-brand-muted" htmlFor="current-password">
          CURRENT PASSWORD
          <input id="current-password" type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className={inputClass} required />
        </label>
        <label className="mt-4 block text-xs font-mono tracking-[0.2em] text-brand-muted" htmlFor="new-password">
          NEW PASSWORD
          <input id="new-password" type="password" autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className={inputClass} required />
        </label>
        {error ? <p role="alert" className="mt-4 text-sm text-brand-red-bright">{error}</p> : null}
        {message ? <p role="status" className="mt-4 text-sm text-brand-white">{message}</p> : null}
        <button type="submit" disabled={pending} className="mt-5 inline-flex min-h-[48px] items-center justify-center rounded-full border border-brand-red/70 px-6 text-xs font-semibold uppercase tracking-[0.18em] text-brand-white disabled:opacity-60">
          {pending ? "Please wait" : "Update password"}
        </button>
      </form>
    </div>
  );
}
