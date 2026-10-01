"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { PlanRecord, PlanSummary } from "@/lib/plans/public";
import AgreementPacket from "./AgreementPacket";
import CoachTeam from "./CoachTeam";

const field =
  "mt-2 w-full border border-brand-border bg-brand-graphite/60 px-3 py-3 text-base leading-relaxed text-brand-white focus:border-brand-red/60 focus:outline-none";

type Detail = PlanRecord;
type Filter = "all" | "review" | "draft" | "published";

const FILTERS: readonly { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "review", label: "Needs review" },
  { id: "draft", label: "Drafts" },
  { id: "published", label: "Published" },
];

function matches(item: PlanSummary, filter: Filter, query: string): boolean {
  if (filter === "review" && !item.needsReview) return false;
  if (filter === "draft" && item.status !== "draft") return false;
  if (filter === "published" && item.status !== "published") return false;
  const q = query.trim().toLowerCase();
  return !q || item.clientName.toLowerCase().includes(q) || item.email.toLowerCase().includes(q);
}

export default function CoachDesk() {
  const [ready, setReady] = useState(false);
  const [denied, setDenied] = useState<"login" | "forbidden" | null>(null);
  const [plans, setPlans] = useState<PlanSummary[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [plan, setPlan] = useState<Detail | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<"coach" | "admin">("coach");

  async function loadList() {
    const response = await fetch("/api/coach/plans", { cache: "no-store" });
    if (response.status === 401) {
      setDenied("login");
      return;
    }
    if (!response.ok) {
      setDenied("forbidden");
      return;
    }
    const data = (await response.json()) as { plans: PlanSummary[] };
    setPlans(data.plans);
    setDenied(null);
    const me = await fetch("/api/coach/me", { cache: "no-store" }).then((r) => (r.ok ? (r.json() as Promise<{ role?: string }>) : null)).catch(() => null);
    setRole(me?.role === "admin" ? "admin" : "coach");
  }

  useEffect(() => {
    loadList()
      .catch(() => setDenied("forbidden"))
      .finally(() => setReady(true));
  }, []);

  async function openPlan(id: string) {
    setSelected(id);
    setMessage("");
    setError("");
    setReviewed(false);
    const response = await fetch(`/api/coach/plans/${id}`, { cache: "no-store" });
    if (!response.ok) {
      setError("That plan could not be opened.");
      return;
    }
    const data = (await response.json()) as { plan: Detail };
    setPlan(data.plan);
  }

  function edit(key: keyof Pick<Detail, "goals" | "idealOutcome" | "fitnessPlan" | "meals" | "schedule" | "coachNotes">, value: string) {
    setPlan((current) => (current ? { ...current, [key]: value } : current));
  }

  async function save(publish: boolean | null) {
    if (!plan || pending) return;
    setPending(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch(`/api/coach/plans/${plan.id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          goals: plan.goals,
          idealOutcome: plan.idealOutcome,
          fitnessPlan: plan.fitnessPlan,
          meals: plan.meals,
          schedule: plan.schedule,
          coachNotes: plan.coachNotes,
          agreementSelection: plan.agreementSelection,
          ...(publish === null ? {} : { publish, reviewed }),
        }),
      });
      const data = (await response.json().catch(() => ({}))) as { message?: string; plan?: Detail };
      if (!response.ok || !data.plan) {
        setError(data.message || "The plan could not be saved.");
        return;
      }
      setPlan(data.plan);
      setMessage(data.plan.status === "published" ? "Published. The client link now shows this plan." : publish === false ? "Hidden from the client." : "Draft saved. The client still cannot see it.");
      await loadList();
    } catch {
      setError("The plan could not be saved.");
    } finally {
      setPending(false);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    window.location.assign("/login?next=/coach");
  }

  if (!ready) return <p className="text-sm text-brand-muted">Opening the coach desk…</p>;

  if (denied === "login") {
    return (
      <div className="max-w-md border border-brand-border/60 bg-brand-card/20 p-6">
        <p className="text-sm leading-relaxed text-brand-muted">Log in with your coach account to review plans before a client sees them.</p>
        <Link href="/login?next=/coach" className="mt-5 inline-flex min-h-[48px] items-center rounded-full bg-brand-red px-6 text-sm font-semibold uppercase tracking-[0.18em] text-brand-black">
          Log in
        </Link>
      </div>
    );
  }

  if (denied) {
    return <p className="max-w-md text-sm leading-relaxed text-brand-muted">This account cannot open the coach desk.</p>;
  }

  const link = plan ? `${window.location.origin}/plan/${plan.viewToken}` : "";
  const visible = plans.filter((item) => matches(item, filter, query));
  const count = (id: Filter) => plans.filter((item) => matches(item, id, "")).length;

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside>
        <div className="mb-4 flex items-center justify-between">
          <p className="font-mono text-[10px] tracking-[0.22em] text-brand-muted">CLIENTS</p>
          <button type="button" onClick={logout} className="text-xs uppercase tracking-[0.16em] text-brand-muted underline underline-offset-4">
            Log out
          </button>
        </div>
        {plans.length > 0 ? (
          <div className="mb-4 space-y-3">
            <label className="block text-[10px] font-mono tracking-[0.18em] text-brand-muted" htmlFor="coach-search">
              SEARCH
              <input id="coach-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name or email" className="mt-2 w-full border border-brand-border bg-brand-graphite/60 px-3 py-2 text-sm text-brand-white focus:border-brand-red/60 focus:outline-none" />
            </label>
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter clients">
              {FILTERS.map((f) => (
                <button key={f.id} type="button" role="tab" aria-selected={filter === f.id} onClick={() => setFilter(f.id)} className={`min-h-[36px] rounded-full border px-3 text-[10px] font-semibold uppercase tracking-[0.14em] ${filter === f.id ? "border-brand-red/70 text-brand-white" : "border-brand-border/60 text-brand-muted"}`}>
                  {f.label} ({count(f.id)})
                </button>
              ))}
            </div>
          </div>
        ) : null}
        {plans.length === 0 ? (
          <p className="text-sm leading-relaxed text-brand-muted">No questionnaires yet. A draft appears here after someone submits the portal form.</p>
        ) : visible.length === 0 ? (
          <p className="text-sm leading-relaxed text-brand-muted">No clients match that filter.</p>
        ) : (
          <ul className="space-y-2">
            {visible.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => openPlan(item.id)}
                  className={`w-full border px-3 py-3 text-left ${selected === item.id ? "border-brand-red/70 bg-brand-card/40" : "border-brand-border/60"}`}
                >
                  <span className="block text-sm text-brand-white">{item.clientName}</span>
                  <span className="mt-1 block font-mono text-[10px] tracking-[0.14em] text-brand-muted">
                    {item.status === "published" ? "PUBLISHED" : "DRAFT"}
                    {item.needsReview ? " · REVIEW HEALTH" : ""}
                    {item.linked ? " · ACCOUNT" : ""}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {role === "admin" ? <CoachTeam /> : null}
      </aside>

      {plan ? (
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            void save(null);
          }}
        >
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] text-brand-muted">{plan.email}</p>
            <h2 className="mt-1 font-display text-4xl tracking-wide text-brand-white" style={{ fontFamily: "var(--font-oswald)" }}>
              {plan.clientName}
            </h2>
            <p className="mt-2 text-sm text-brand-muted">{plan.status === "published" ? "The client can see the published sections." : "The client link is a waiting page until you publish."}</p>
          </div>

          {plan.needsReview ? (
            <p role="status" className="border border-brand-red/50 bg-brand-card/30 p-4 text-sm leading-relaxed text-brand-white">
              Health answers need your review. Read them below, edit the plan, and confirm before you publish.
            </p>
          ) : null}

          <label className="block text-xs font-mono tracking-[0.16em] text-brand-muted">
            CLIENT LINK
            <input readOnly value={link} className={field} onFocus={(event) => event.currentTarget.select()} />
          </label>

          <section className="border border-brand-border/60 p-4">
            <h3 className="font-mono text-[10px] tracking-[0.2em] text-brand-muted">QUESTIONNAIRE</h3>
            <dl className="mt-3 space-y-3">
              {plan.intake.map((row) => (
                <div key={row.label}>
                  <dt className="text-xs text-brand-muted">{row.label}</dt>
                  <dd className="mt-1 whitespace-pre-wrap text-sm text-brand-white">{row.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <AgreementPacket plan={plan} onSaved={setPlan} />

          {([
            ["goals", "GOALS"],
            ["idealOutcome", "IDEAL OUTCOME"],
            ["fitnessPlan", "FITNESS PLAN"],
            ["meals", "RECOMMENDED MEALS"],
            ["schedule", "SCHEDULE"],
            ["coachNotes", "COACH NOTES — THE CLIENT NEVER SEES THIS"],
          ] as const).map(([key, title]) => (
            <label key={key} className="block text-xs font-mono tracking-[0.16em] text-brand-muted">
              {title}
              <textarea value={plan[key]} onChange={(event) => edit(key, event.target.value)} className={`${field} min-h-[140px]`} />
            </label>
          ))}

          {plan.needsReview ? (
            <label className="flex items-start gap-3 text-sm leading-relaxed text-brand-muted">
              <input type="checkbox" checked={reviewed} onChange={(event) => setReviewed(event.target.checked)} className="mt-1 h-4 w-4" />
              I reviewed the health answers and I am ready for the client to see the plan above.
            </label>
          ) : null}

          {error ? <p role="alert" className="text-sm text-brand-red-bright">{error}</p> : null}
          {message ? <p role="status" className="text-sm text-brand-white">{message}</p> : null}

          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={pending} className="inline-flex min-h-[48px] items-center rounded-full border border-brand-border px-5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-white disabled:opacity-60">
              Save draft
            </button>
            <button type="button" disabled={pending} onClick={() => save(true)} className="inline-flex min-h-[48px] items-center rounded-full bg-brand-red px-5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-black disabled:opacity-60">
              Publish for client
            </button>
            {plan.status === "published" ? (
              <button type="button" disabled={pending} onClick={() => save(false)} className="inline-flex min-h-[48px] items-center px-3 text-xs font-semibold uppercase tracking-[0.16em] text-brand-muted underline underline-offset-4">
                Hide from client
              </button>
            ) : null}
          </div>
        </form>
      ) : (
        <p className="text-sm text-brand-muted">Choose a client to review the draft.</p>
      )}
    </div>
  );
}
