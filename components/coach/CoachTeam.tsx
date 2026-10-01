"use client";

import { useCallback, useEffect, useState } from "react";

type Member = { email: string; role: "coach" | "admin" | "client"; fixed: boolean };

const input = "mt-2 w-full border border-brand-border bg-brand-graphite/60 px-3 py-3 text-base text-brand-white focus:border-brand-red/60 focus:outline-none";

/** Admin-only: grant or revoke coach access for existing accounts. Owner admins come from server settings and cannot be changed here. */
export default function CoachTeam() {
  const [staff, setStaff] = useState<Member[] | null>(null);
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const response = await fetch("/api/coach/team", { cache: "no-store" });
    if (!response.ok) return;
    setStaff(((await response.json()) as { staff: Member[] }).staff);
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function setRole(target: string, role: "coach" | "client") {
    if (pending) return;
    setPending(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/coach/team", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: target, role }) });
      const data = (await response.json().catch(() => ({}))) as { message?: string };
      if (!response.ok) { setError(data.message || "That change could not be saved."); return; }
      setMessage(role === "coach" ? "Coach access granted." : "Coach access removed.");
      if (role === "coach") setEmail("");
      await load();
    } catch {
      setError("That change could not be saved.");
    } finally {
      setPending(false);
    }
  }

  if (!staff) return null;
  return (
    <section className="mt-10 border border-brand-border/60 p-4" aria-labelledby="team-heading">
      <h3 id="team-heading" className="font-mono text-[10px] tracking-[0.2em] text-brand-muted">COACHING TEAM</h3>
      <ul className="mt-3 space-y-2">
        {staff.map((member) => (
          <li key={member.email} className="flex items-center justify-between gap-3 text-sm text-brand-white">
            <span className="break-all">{member.email} <span className="font-mono text-[10px] tracking-[0.14em] text-brand-muted">· {member.role.toUpperCase()}{member.fixed ? " · SET BY SERVER" : ""}</span></span>
            {!member.fixed ? (
              <button type="button" disabled={pending} onClick={() => setRole(member.email, "client")} className="shrink-0 text-xs uppercase tracking-[0.14em] text-brand-muted underline underline-offset-4 disabled:opacity-60">
                Remove
              </button>
            ) : null}
          </li>
        ))}
      </ul>
      <form className="mt-4" onSubmit={(event) => { event.preventDefault(); void setRole(email, "coach"); }}>
        <label className="block text-xs font-mono tracking-[0.16em] text-brand-muted" htmlFor="team-email">
          GIVE COACH ACCESS TO AN EXISTING ACCOUNT
          <input id="team-email" type="email" autoComplete="off" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="trainer@example.com" className={input} required />
        </label>
        <button type="submit" disabled={pending} className="mt-3 inline-flex min-h-[44px] items-center rounded-full border border-brand-border px-5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-white disabled:opacity-60">
          Grant coach access
        </button>
      </form>
      {error ? <p role="alert" className="mt-3 text-sm text-brand-red-bright">{error}</p> : null}
      {message ? <p role="status" className="mt-3 text-sm text-brand-white">{message}</p> : null}
    </section>
  );
}
