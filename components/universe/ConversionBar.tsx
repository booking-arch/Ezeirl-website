"use client";

import Link from "next/link";
import { IMG, MAILTO_FIT, MAILTO_FORM } from "@/lib/universe/content";
import { track } from "@/lib/universe/track";

/** Sticky bottom bar on /eze-fit and /eze-form: one primary action plus a link to the other brands. */
export default function ConversionBar({ brand }: { brand: "eze-fit" | "eze-form" }) {
  const fit = brand === "eze-fit";
  const href = fit ? MAILTO_FIT : MAILTO_FORM;
  const label = fit ? "TRY BETA" : "GET NOTIFIED";
  const other = fit ? { to: "eze-form" as const, href: "/eze-form", label: "EZE//FORM" } : { to: "eze-fit" as const, href: "/eze-fit", label: "EZE-FIT" };
  return (
    <aside className="conv-bar" aria-label="Conversion">
      <div className="conv-bar__inner">
        <div className="conv-bar__mark">
          {fit ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG.logoCircle} alt="" className="conv-bar__icon" width={64} height={64} />
              <span>EZE<span className="lime">-FIT</span></span>
            </>
          ) : (
            <span>EZE<span className="lime">{"//"}</span>FORM</span>
          )}
        </div>
        <a href={href} className="btn btn-solid conv-bar__cta" onClick={() => track(fit ? "beta_signup_click" : "form_notify_click", { cta_label: label, component: "ConversionBar", brand_route: brand, link_url: href })}>
          {label}
        </a>
        <nav className="conv-bar__links" aria-label="Other brands">
          <Link href="/" onClick={() => track("brand_nav_click", { cta_label: "EZE IRL", component: "ConversionBar", to_route: "irl", from_route: brand })}>EZE IRL</Link>
          <Link href={other.href} onClick={() => track("brand_nav_click", { cta_label: other.label, component: "ConversionBar", to_route: other.to, from_route: brand })}>{other.label}</Link>
        </nav>
      </div>
    </aside>
  );
}
