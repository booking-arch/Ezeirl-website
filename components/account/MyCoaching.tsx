"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { AccountPlanSummary } from "@/lib/plans/public";

const SERVICE_LABEL: Record<AccountPlanSummary["service"], string> = {
  "personal-training": "Personal training",
  "nutrition-coaching": "Nutrition coaching",
};

const date = (iso: string) => new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

/** The signed-in client's coaching plans. Shows only status for drafts; the plan opens on its private page once published. */
export default function MyCoaching() {
  const [plans, setPlans] = useState<AccountPlanSummary[] | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/account/plans", { cache: "no-store" })
      .then(async (response) => {
        if (cancelled) return;
        if (!response.ok) { setUnavailable(true); return; }
        const data = (await response.json()) as { plans: AccountPlanSummary[] };
        setPlans(data.plans);
      })
      .catch(() => { if (!cancelled) setUnavailable(true); });
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="border border-brand-border/60 bg-brand-card/20 p-5 sm:p-7" aria-labelledby="my-coaching-heading">
      <h2 id="my-coaching-heading" className="font-display text-2xl tracking-widest text-brand-white" style={{ fontFamily: "var(--font-oswald)" }}>YOUR COACHING</h2>
      {unavailable ? (
        <p className="mt-3 text-sm leading-relaxed text-brand-muted">Coaching isn&apos;t available right now. Please check back soon.</p>
      ) : plans === null ? (
        <p className="mt-3 text-sm text-brand-muted">Loading your coaching…</p>
      ) : plans.length === 0 ? (
        <>
          <p className="mt-3 text-sm leading-relaxed text-brand-muted">
            Nothing here yet. Start a questionnaire while you&apos;re signed in and your plan will appear here once your coach publishes it.
            Already have a plan link? Open it while signed in and choose &ldquo;Save to my account&rdquo;.
          </p>
          <Link href="/client-portal" className="mt-5 inline-flex min-h-[48px] items-center justify-center rounded-full bg-brand-red px-6 text-xs font-semibold uppercase tracking-[0.18em] text-brand-black">
            Start coaching
          </Link>
        </>
      ) : (
        <ul className="mt-4 space-y-3">
          {plans.map((plan) => (
            <li key={plan.viewToken} className="flex flex-wrap items-center justify-between gap-3 border border-brand-border/60 px-4 py-3">
              <div>
                <p className="text-sm text-brand-white">{SERVICE_LABEL[plan.service]}</p>
                <p className="mt-1 font-mono text-[10px] tracking-[0.16em] text-brand-muted">
                  {plan.status === "published" ? `READY · PUBLISHED ${date(plan.publishedAt ?? plan.createdAt).toUpperCase()}` : `IN REVIEW · SENT ${date(plan.createdAt).toUpperCase()}`}
                </p>
              </div>
              {plan.status === "published" ? (
                <Link href={`/plan/${plan.viewToken}`} className="inline-flex min-h-[44px] items-center text-xs font-semibold uppercase tracking-[0.16em] text-brand-red-bright underline underline-offset-4">
                  Open plan
                </Link>
              ) : (
                <span className="text-xs text-brand-muted">Your coach is working on it</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
