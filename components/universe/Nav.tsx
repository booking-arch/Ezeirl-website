"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BRANDS, HOME_SECTIONS, IMG, type BrandId } from "@/lib/universe/content";
import { prefersReducedMotion, EASE_OUT } from "@/lib/universe/motion";
import { track } from "@/lib/universe/track";
import AuthLink from "@/components/auth/AuthLink";
import { activeBrand } from "./brand-route";

export default function Nav() {
  const pathname = usePathname();
  const active: BrandId = activeBrand(pathname);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    document.querySelector(".nav")?.animate(
      [{ transform: "translateY(-28px)", opacity: 0 }, { transform: "none", opacity: 1 }],
      { duration: 900, delay: 150, easing: EASE_OUT, fill: "backwards" },
    );
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  const brandClick = (to: BrandId, label: string) => {
    setOpen(false);
    track("brand_nav_click", { cta_label: label, component: "Nav", to_route: to, from_route: active });
  };
  const contactClick = (label: string) => {
    setOpen(false);
    track("contact_click", { cta_label: label, component: "Nav", link_url: "#contact" });
  };

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""} ${open ? "nav--open" : ""}`}>
      <div className="nav__inner container">
        <Link href="/" className="nav__logo" aria-label="EZE IRL home" onClick={() => brandClick("irl", "logo")}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={IMG.logoWhite} alt="EZE IRL" className="nav__logo-img" width={400} height={133} />
        </Link>
        <nav className="nav__links" aria-label="Primary">
          {BRANDS.map((b) => (
            <Link key={b.id} href={b.href} className={active === b.id ? "is-active" : undefined} aria-current={active === b.id ? "page" : undefined} onClick={() => brandClick(b.id, b.label)}>
              {b.label}
            </Link>
          ))}
          {active === "irl" && HOME_SECTIONS.map((s) => (
            <Link key={s.href} href={s.href} className="nav__secondary" onClick={() => setOpen(false)}>{s.label}</Link>
          ))}
          <a href="#contact" onClick={() => contactClick("CONTACT")}>CONTACT</a>
          <AuthLink onNavigate={() => setOpen(false)} className="nav__auth" />
        </nav>
        <a href="#contact" className="btn btn-nav nav__cta" onClick={() => contactClick("JOIN THE MOVEMENT")}>
          JOIN THE MOVEMENT <span aria-hidden>→</span>
        </a>
        <button type="button" className="nav__burger" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <span /><span /><span />
        </button>
      </div>
      <div className={`nav__drawer ${open ? "is-open" : ""}`}>
        {BRANDS.map((b) => (
          <Link key={b.id} href={b.href} className={active === b.id ? "is-active" : undefined} onClick={() => brandClick(b.id, b.label)}>{b.label}</Link>
        ))}
        {active === "irl" && HOME_SECTIONS.map((s) => (
          <Link key={s.href} href={s.href} onClick={() => setOpen(false)}>{s.label}</Link>
        ))}
        <a href="#contact" onClick={() => contactClick("CONTACT")}>CONTACT</a>
        <AuthLink onNavigate={() => setOpen(false)} />
        <a href="#contact" className="btn btn-ghost-lime" onClick={() => contactClick("JOIN THE MOVEMENT →")}>JOIN THE MOVEMENT →</a>
      </div>
    </header>
  );
}
