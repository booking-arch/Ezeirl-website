import type { ReactNode } from "react";
import { IMG, MAILTO_FIT, MAILTO_FORM, SPOTIFY_URL } from "@/lib/universe/content";
import TrackedLink from "../TrackedLink";

type Card = {
  id: string; mark: ReactNode; title: string; body: string; cta: string; href: string;
  secondary: { label: string; href: string; brand?: string }; img: string; event: string; platform?: string; external?: boolean;
};

const CARDS: Card[] = [
  { id: "fit", mark: <>EZE<span className="lime">-FIT</span></>, title: "Private beta", body: "Track · train · fuel · learn · grow. Fitness made EZE — join the early testers.", cta: "TRY BETA", href: MAILTO_FIT, secondary: { label: "OPEN PAGE", href: "/eze-fit", brand: "eze-fit" }, img: "/universe/carousel/en-1.webp", event: "beta_signup_click" },
  { id: "form", mark: <>EZE<span className="lime">{"//"}</span>FORM</>, title: "Drop 001 · Fall 2026", body: "Under construction. Capsule boards live on the FORM page — notify when it opens.", cta: "GET NOTIFIED", href: MAILTO_FORM, secondary: { label: "OPEN PAGE", href: "/eze-form", brand: "eze-form" }, img: "/universe/form/p1.webp", event: "form_notify_click" },
  { id: "music", mark: <>EZEKIEL CRUZ</>, title: "The soundtrack", body: "Stream the artist behind the movement — Spotify and the full listen strip.", cta: "LISTEN", href: SPOTIFY_URL, secondary: { label: "ON PAGE", href: "/#music" }, img: IMG.lifestyle2, event: "outbound_click", platform: "spotify", external: true },
];

export default function EcosystemRail() {
  return (
    <section className="rail" aria-labelledby="rail-heading">
      <div className="rail__inner container">
        <header className="rail__header reveal">
          <p className="section-label">ECOSYSTEM</p>
          <h2 id="rail-heading">Three pathways. One standard.</h2>
          <p>App, apparel, sound — convert across the universe without fake checkout or invented stock.</p>
        </header>
        <div className="rail__grid">
          {CARDS.map((c) => (
            <article key={c.id} className="rail__card reveal">
              <div className="rail__media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img} alt="" loading="lazy" width={1200} height={1200} />
              </div>
              <div className="rail__body">
                <p className="rail__brand">{c.mark}</p>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
                <div className="rail__ctas">
                  <TrackedLink href={c.href} className="btn btn-solid" external={c.external} event={c.event} params={{ cta_label: c.cta, component: "ProductsRail", link_url: c.href, platform: c.platform }}>
                    {c.cta}
                  </TrackedLink>
                  <TrackedLink href={c.secondary.href} className="btn btn-ghost-lime" event={c.secondary.brand ? "brand_nav_click" : undefined} params={c.secondary.brand ? { cta_label: c.secondary.label, component: "ProductsRail", to_route: c.secondary.brand, from_route: "irl" } : undefined}>
                    {c.secondary.label}
                  </TrackedLink>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
