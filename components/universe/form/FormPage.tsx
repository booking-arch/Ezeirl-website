"use client";

import { useMemo, useState } from "react";
import { FORM_ACCENTS, FORM_FILTERS, FORM_LOOKS, FORM_PILLARS, FORM_PRODUCTS, MAILTO_FORM, type FormMode } from "@/lib/universe/content";
import BrandSwitcher from "../BrandSwitcher";
import ConversionBar from "../ConversionBar";
import TrackedLink from "../TrackedLink";

const notify = (component: string) => ({ cta_label: "GET NOTIFIED", component, link_url: MAILTO_FORM });

export default function FormPage() {
  const [filter, setFilter] = useState<"all" | FormMode>("all");
  const products = useMemo(() => (filter === "all" ? FORM_PRODUCTS : FORM_PRODUCTS.filter((p) => p.mode === filter)), [filter]);
  return (
    <>
      <BrandSwitcher active="eze-form" />
      <section id="eze-form" className="form">
        <div className="form__hero container reveal">
          <p className="section-label">DROP 001 · FALL 2026 · UNDER CONSTRUCTION</p>
          <h1 className="form__title">EZE<span className="lime">{"//"}</span>FORM</h1>
          <p className="form__subtitle">FORM FOLLOWS DISCIPLINE.</p>
          <p className="form__lede">BODY · MIND · FORM · YOU ARE NEVER FINISHED</p>
          <p className="form__body form__body--wide">
            More than clothing. A mindset. Drop 001 is a capsule in progress — boards from the Fall 2026 collection, not a live shop. No prices. No
            inventory. Notify when the drop opens.
          </p>
          <div className="form__ctas">
            <TrackedLink href={MAILTO_FORM} className="btn btn-outline" event="form_notify_click" params={notify("EzeForm")}>GET NOTIFIED</TrackedLink>
            <a href="#form-capsule" className="btn btn-ghost-lime">VIEW CAPSULE</a>
          </div>
        </div>
        <div className="form__accents container reveal" aria-hidden>
          {FORM_ACCENTS.map((a) => <span key={a} className="form__accent">{a}</span>)}
        </div>
        <div className="form__pillars container reveal">
          <p className="section-label">PILLARS</p>
          <h2 className="form__section-title">What the drop stands on</h2>
          <div className="form__pillar-grid">
            {FORM_PILLARS.map((p) => <article key={p.title} className="form__pillar"><h3>{p.title}</h3><p>{p.body}</p></article>)}
          </div>
        </div>
        <div id="form-capsule" className="form__capsule container">
          <div className="form__capsule-head reveal">
            <div>
              <p className="section-label">CAPSULE · DROP 001</p>
              <h2 className="form__section-title">Fall 2026 boards</h2>
              <p className="form__body">
                Product storyboards from the collection build. Status on every card: COMING · FALL 2026. Filter by mode — FORM (minimal) or CHAOS (statement).
              </p>
            </div>
            <div className="form__filters" role="tablist" aria-label="Mode filter">
              {FORM_FILTERS.map(([id, label]) => (
                <button key={id} type="button" role="tab" aria-selected={filter === id} className={`form__filter${filter === id ? " is-active" : ""}`} onClick={() => setFilter(id)}>{label}</button>
              ))}
            </div>
          </div>
          <div className="form__grid">
            {products.map((p) => (
              <article key={p.id} className="form__card reveal">
                <div className="form__card-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.alt} loading="lazy" width={1400} height={1400} />
                  <span className="form__badge">COMING</span>
                  <span className={`form__mode form__mode--${p.mode}`}>{p.mode === "form" ? "FORM" : "CHAOS"}</span>
                </div>
                <div className="form__card-body">
                  <p className="form__card-kicker">FALL 2026</p>
                  <h3>{p.name}</h3>
                  <p className="form__card-sub">{p.subtitle}</p>
                  <p className="form__card-spec">{p.spec}</p>
                  <TrackedLink href={MAILTO_FORM} className="form__notify" event="form_notify_click" params={notify("EzeForm")}>GET NOTIFIED →</TrackedLink>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="form__lookbook container reveal">
          <p className="section-label">IDENTITY · LOOKBOOK</p>
          <h2 className="form__section-title">Marks before merchandise</h2>
          <p className="form__body form__body--wide" style={{ marginInline: 0 }}>
            Logo concept boards — wordmark, EF monogram, distorted mark. Reference frames for the system, not buyable SKUs.
          </p>
          <div className="form__look-strip">
            {FORM_LOOKS.map((l) => (
              <figure key={l.img} className="form__look">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={l.img} alt={l.caption} loading="lazy" width={1400} height={1400} />
                <figcaption><strong>{l.label}</strong><span>{l.caption}</span></figcaption>
              </figure>
            ))}
          </div>
        </div>
        <div className="form__closing container reveal">
          <p className="script lime form__closing-script">You are never finished.</p>
          <p className="form__closing-copy">UNDER CONSTRUCTION. When Drop 001 opens, it will speak for itself — until then, train in what you have and wear the standard.</p>
          <TrackedLink href={MAILTO_FORM} className="btn btn-solid" event="form_notify_click" params={notify("EzeForm")}>GET NOTIFIED</TrackedLink>
        </div>
      </section>
      <BrandSwitcher active="eze-form" compact />
      <ConversionBar brand="eze-form" />
    </>
  );
}
