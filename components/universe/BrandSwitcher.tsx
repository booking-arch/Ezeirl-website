"use client";

import Link from "next/link";
import { BRANDS, type BrandId } from "@/lib/universe/content";
import { track } from "@/lib/universe/track";

/** "THE EZE UNIVERSE" strip that switches between the three brand pages. */
export default function BrandSwitcher({ active, compact = false }: { active: BrandId; compact?: boolean }) {
  return (
    <section className={`brand-switch ${compact ? "brand-switch--compact" : ""}`} aria-label="The EZE Universe">
      <div className={`brand-switch__inner ${compact ? "" : "container"}`}>
        <p className="brand-switch__label">
          <span className="brand-switch__pulse" aria-hidden />
          THE EZE UNIVERSE
        </p>
        <nav className="brand-switch__links" aria-label="Brands">
          {BRANDS.map((b, i) => (
            <span key={b.id} className="brand-switch__item">
              {i > 0 && <span className="brand-switch__sep" aria-hidden />}
              <Link
                href={b.href}
                className={`brand-switch__link ${active === b.id ? "is-active" : ""}`}
                aria-current={active === b.id ? "page" : undefined}
                onClick={() => track("brand_nav_click", { cta_label: b.label, component: "BrandSwitcher", to_route: b.id, from_route: active })}
              >
                {b.label}
              </Link>
            </span>
          ))}
        </nav>
      </div>
    </section>
  );
}
