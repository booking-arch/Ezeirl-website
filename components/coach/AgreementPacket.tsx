"use client";

import { useEffect, useMemo, useState } from "react";
import { AGREEMENT_FORMS, EZE_FIT_APP_DOCUMENTS, ONBOARDING_PACKET_ORDER, PERSONAL_TRAINING_AGREEMENT_DRAFT } from "@/config/agreements";
import type { PlanRecord } from "@/lib/plans/public";

export default function AgreementPacket({ plan, onSaved }: { plan: PlanRecord; onSaved: (plan: PlanRecord) => void }) {
  const [selected, setSelected] = useState<string[]>(plan.agreementSelection ?? []);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");
  const forms = useMemo(() => AGREEMENT_FORMS.filter((form) => form.services.includes(plan.service)), [plan.service]);

  useEffect(() => {
    setSelected(plan.agreementSelection ?? []);
    setSaved("");
    setError("");
  }, [plan.id, plan.agreementSelection]);

  function toggle(id: string) {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    setSaved("");
    setError("");
  }

  async function saveSelection() {
    setSaving(true);
    setSaved("");
    setError("");
    try {
      const response = await fetch(`/api/coach/plans/${plan.id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ agreementSelection: selected }),
      });
      const data = await response.json().catch(() => ({})) as { message?: string; plan?: PlanRecord };
      if (!response.ok || !data.plan) {
        setError(data.message || "The packet selection could not be saved.");
        return;
      }
      onSaved(data.plan);
      setSaved("Packet selection saved to this client’s plan.");
    } catch {
      setError("The packet selection could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section aria-labelledby="agreements-heading" className="space-y-5 border border-brand-red/30 bg-brand-card/30 p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] tracking-[0.2em] text-brand-red-bright">CLIENT PAPERWORK · E-SIGNATURE</p>
          <h3 id="agreements-heading" className="mt-2 font-display text-3xl tracking-wide text-brand-white" style={{ fontFamily: "var(--font-bebas)" }}>
            BUILD SIGNING PACKET
          </h3>
          <p className="mt-1 text-sm text-brand-muted">Choose the forms for {plan.clientName}. Your selection is saved with this client’s plan.</p>
        </div>
        <span className="inline-flex min-h-8 items-center gap-2 border border-amber-300/40 px-3 font-mono text-[10px] uppercase tracking-[0.14em] text-amber-200">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-300" aria-hidden="true" /> DOCUSIGN NOT CONNECTED
        </span>
      </div>

      <div role="status" className="border border-brand-border/70 bg-brand-black/40 p-4 text-sm leading-relaxed text-brand-muted">
        You can build and save the client-specific selection now. Sending is off until approved templates are in DocuSign, the account integration is configured, and counsel has reviewed the paperwork. Nothing will be sent from this screen yet.
      </div>

      <fieldset className="space-y-3">
        <legend className="mb-3 font-mono text-[10px] tracking-[0.18em] text-brand-white">SELECT COACHING FORMS</legend>
        {forms.map((form) => {
          const checked = selected.includes(form.id);
          return (
            <label key={form.id} className={`flex cursor-pointer gap-3 border p-4 transition-colors ${checked ? "border-brand-red/70 bg-brand-red/5" : "border-brand-border/60 bg-brand-black/20"}`}>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(form.id)}
                className="mt-1 h-5 w-5 shrink-0 accent-emerald-400"
                aria-label={`Include ${form.title} in ${plan.clientName}'s signing packet`}
              />
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2 text-sm text-brand-white">
                  {form.title}
                  {form.kind === "optional" && <span className="border border-brand-border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-brand-muted">Optional · separate consent</span>}
                  <span className="border border-amber-300/30 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-amber-200">
                    {form.status === "owner-draft" ? "Owner draft · review required" : "Outline only · wording needed"}
                  </span>
                </span>
                <span className="mt-2 block text-xs leading-relaxed text-brand-muted">{form.description}</span>
              </span>
            </label>
          );
        })}
      </fieldset>

      {selected.includes("personal-training-agreement") && (
        <details className="border border-brand-border/60 p-4">
          <summary className="cursor-pointer text-sm text-brand-white">Preview the supplied personal-training agreement draft</summary>
          <pre className="mt-4 max-h-[480px] overflow-auto whitespace-pre-wrap border-t border-brand-border/60 pt-4 font-sans text-xs leading-relaxed text-brand-muted">{PERSONAL_TRAINING_AGREEMENT_DRAFT}</pre>
          <p className="mt-4 border-l-2 border-amber-300/60 pl-3 text-xs leading-relaxed text-amber-100/80">Owner-supplied draft shown for review. It has not been edited for legal effect and is not ready to send until reviewed by an attorney for the service locations.</p>
        </details>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={saveSelection} disabled={saving} className="inline-flex min-h-[46px] items-center rounded-full bg-brand-red px-5 text-xs font-semibold uppercase tracking-[0.15em] text-brand-black disabled:opacity-60">
          {saving ? "Saving selection…" : "Save packet selection"}
        </button>
        <button type="button" disabled title="Connect DocuSign and complete attorney review before sending." className="inline-flex min-h-[46px] cursor-not-allowed items-center rounded-full border border-brand-border px-5 text-xs font-semibold uppercase tracking-[0.15em] text-brand-muted opacity-60">
          Send with DocuSign
        </button>
        <span className="text-xs text-brand-muted">{selected.length} {selected.length === 1 ? "form" : "forms"} selected</span>
      </div>
      {error && <p role="alert" className="text-sm text-brand-red-bright">{error}</p>}
      {saved && <p role="status" className="text-sm text-emerald-300">{saved}</p>}

      <details className="border-t border-brand-border/60 pt-4">
        <summary className="cursor-pointer text-xs font-mono uppercase tracking-[0.16em] text-brand-muted">Recommended onboarding order</summary>
        <ol className="mt-3 grid gap-2 text-xs text-brand-muted sm:grid-cols-2">
          {ONBOARDING_PACKET_ORDER.map((step, index) => <li key={step} className="flex gap-2"><span className="font-mono text-brand-red-bright">{String(index + 1).padStart(2, "0")}</span>{step}</li>)}
        </ol>
      </details>

      <details className="border-t border-brand-border/60 pt-4">
        <summary className="cursor-pointer text-xs font-mono uppercase tracking-[0.16em] text-brand-muted">Separate paperwork for the EZE-FIT app</summary>
        <p className="mt-2 text-xs leading-relaxed text-brand-muted">These app documents are a separate workstream; they are not included in this coaching packet.</p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-xs text-brand-muted">
          {EZE_FIT_APP_DOCUMENTS.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </details>
    </section>
  );
}
