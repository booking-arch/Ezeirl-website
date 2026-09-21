"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { FormProduct, ImageAsset } from "@/config/assets";
import { track } from "@/lib/analytics";

/** Flatten a product's real views into an ordered list with human labels. */
export function productViews(p: FormProduct): { label: string; asset: ImageAsset }[] {
  const out: { label: string; asset: ImageAsset }[] = [];
  if (p.views.front) out.push({ label: "Front", asset: p.views.front });
  if (p.views.back) out.push({ label: "Back", asset: p.views.back });
  if (p.views.side) out.push({ label: "Side", asset: p.views.side });
  p.views.detail?.forEach((a, i) => out.push({ label: `Detail ${i + 1}`, asset: a }));
  p.views.alt?.forEach((a, i) => out.push({ label: `Alternate ${i + 1}`, asset: a }));
  return out;
}

/**
 * Real-product gallery. Renders only products that have a real front image (the manifest is empty
 * until approved imagery is supplied). Card → native <dialog> detail view with all real angles.
 * Touch never depends on hover: the hover back-view is an enhancement; tapping opens the detail.
 * No prices, sizes or availability are shown — none are confirmed. Status is always COMING SOON.
 */
export default function ProductGrid({ products }: { products: FormProduct[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<{ index: number; view: number } | null>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const shown = products.filter((p) => p.views.front);
  const current = open ? shown[open.index] : null;
  const views = current ? productViews(current) : [];
  const label = (p: FormProduct, i: number) => p.name ?? `DROP 001 / ${String(i + 1).padStart(2, "0")}`;

  return (
    <>
      <ul className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p, i) => {
          const front = p.views.front as ImageAsset;
          const back = p.views.back ?? null;
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => {
                  setOpen({ index: i, view: 0 });
                  track("merch_product_view", { product_id: p.id, surface: "merch_grid" });
                }}
                className="group block w-full text-left"
                aria-label={`View ${label(p, i)}, coming soon`}
              >
                <span className="relative block aspect-[4/5] overflow-hidden bg-form-ash">
                  <Image src={front.src} width={front.width} height={front.height} alt={front.alt} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0" />
                  {back && (
                    <Image src={back.src} width={back.width} height={back.height} alt="" aria-hidden="true" sizes="(min-width: 1024px) 33vw, 50vw" className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  )}
                </span>
                <span className="mt-4 flex items-baseline justify-between gap-4">
                  <span className="font-display text-2xl tracking-[0.06em] text-form-bone">{label(p, i)}</span>
                  <span className="font-mono text-[11px] tracking-[0.25em] text-form-stone">COMING SOON</span>
                </span>
                {p.colorway && <span className="mt-1 block text-sm text-form-stone">{p.colorway}</span>}
              </button>
            </li>
          );
        })}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === e.currentTarget && setOpen(null)}
        aria-label={current ? `${label(current, open!.index)} details` : "Product details"}
        className="m-auto max-h-[94vh] w-[min(96vw,1100px)] overflow-y-auto border border-form-line bg-form-ink p-0 text-form-bone backdrop:bg-black/85"
      >
        {current && open && (
          <div className="grid gap-0 md:grid-cols-[1.4fr_1fr]">
            <div className="bg-form-ash">
              {views[open.view] && (
                <Image
                  src={views[open.view].asset.src}
                  width={views[open.view].asset.width}
                  height={views[open.view].asset.height}
                  alt={views[open.view].asset.alt}
                  sizes="(min-width: 768px) 60vw, 96vw"
                  className="h-auto max-h-[80vh] w-full object-contain"
                />
              )}
            </div>
            <div className="flex flex-col p-6 sm:p-8">
              <p className="font-mono text-[11px] tracking-[0.25em] text-form-stone">DROP 001 — COMING SOON</p>
              <h2 className="mt-2 font-display text-4xl tracking-[0.05em]">{label(current, open.index)}</h2>
              {current.colorway && <p className="mt-1 text-sm text-form-stone">{current.colorway}</p>}
              {current.description && <p className="mt-4 text-sm leading-relaxed text-form-bone/80">{current.description}</p>}

              {views.length > 1 && (
                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Product views">
                  {views.map((v, vi) => (
                    <li key={v.label}>
                      <button
                        type="button"
                        aria-pressed={vi === open.view}
                        onClick={() => setOpen({ index: open.index, view: vi })}
                        className={`min-h-[44px] border px-4 text-xs tracking-[0.2em] transition-colors ${vi === open.view ? "border-form-bone bg-form-bone text-form-ink" : "border-form-line text-form-bone hover:border-form-bone"}`}
                      >
                        {v.label.toUpperCase()}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row md:flex-col">
                <a
                  href="#early-access"
                  onClick={() => {
                    track("merch_early_access_cta", { surface: "merch_product", product_id: current.id });
                    setOpen(null);
                  }}
                  className="inline-flex min-h-[52px] items-center justify-center bg-form-bone px-6 text-xs font-semibold uppercase tracking-[0.2em] text-form-ink hover:bg-white"
                >
                  NOTIFY ME
                </a>
                <button type="button" onClick={() => setOpen(null)} className="min-h-[52px] border border-form-line px-6 text-xs uppercase tracking-[0.2em] hover:border-form-bone">
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
