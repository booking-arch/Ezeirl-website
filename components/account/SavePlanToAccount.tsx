"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type State = "checking" | "signed-out" | "idle" | "saving" | "saved" | "taken" | "error";

/** On a plan page: lets a signed-in client keep the plan under their account. Uses the plan's own private link as proof. */
export default function SavePlanToAccount({ token }: { token: string }) {
  const [state, setState] = useState<State>("checking");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/session", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => { if (!cancelled) setState(typeof data.email === "string" ? "idle" : "signed-out"); })
      .catch(() => { if (!cancelled) setState("signed-out"); });
    return () => { cancelled = true; };
  }, []);

  async function save() {
    setState("saving");
    try {
      const response = await fetch("/api/account/plans/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token }) });
      setState(response.ok ? "saved" : response.status === 409 ? "taken" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "checking") return null;
  const box = "mx-auto mt-10 max-w-[720px] border border-white/10 px-5 py-4 text-sm leading-relaxed text-[#d7e0d8]";
  if (state === "signed-out") {
    return (
      <p className={box}>
        Want to find this plan again?{" "}
        <Link href={`/login?next=/plan/${token}`} className="underline underline-offset-4">Log in</Link> or{" "}
        <Link href={`/register?next=/plan/${token}`} className="underline underline-offset-4">create an account</Link> to save it.
      </p>
    );
  }
  if (state === "saved") return <p role="status" className={box}>Saved. You&apos;ll find it under <Link href="/account" className="underline underline-offset-4">Your coaching</Link>.</p>;
  if (state === "taken") return <p role="alert" className={box}>This plan is already saved to a different account.</p>;
  return (
    <div className={box}>
      <button type="button" onClick={save} disabled={state === "saving"} className="inline-flex min-h-[44px] items-center rounded-full border border-white/30 px-5 text-xs font-semibold uppercase tracking-[0.16em] text-white disabled:opacity-60">
        {state === "saving" ? "Saving…" : "Save to my account"}
      </button>
      {state === "error" ? <p role="alert" className="mt-3">We couldn&apos;t save that. Please try again.</p> : null}
    </div>
  );
}
