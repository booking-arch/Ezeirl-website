import { CATEGORIES } from "@/lib/universe/content";
import TrackedLink from "../TrackedLink";

export default function Categories() {
  return (
    <section className="cats" aria-label="Explore EZE IRL">
      <h2 className="sr-only">Explore EZE IRL</h2>
      <div className="cats__grid">
        {CATEGORIES.map((c) => (
          <TrackedLink
            key={c.id}
            href={c.href}
            className="cats__card reveal"
            event={"brand" in c ? "brand_nav_click" : undefined}
            params={"brand" in c ? { cta_label: c.title, component: "CategoryGrid", to_route: c.brand, from_route: "irl" } : undefined}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.img} alt="" loading="lazy" width={1200} height={1200} />
            <div className="cats__veil" />
            <div className="cats__meta">
              <h3>{c.title}</h3>
              <span>{c.sub}</span>
            </div>
          </TrackedLink>
        ))}
      </div>
    </section>
  );
}
