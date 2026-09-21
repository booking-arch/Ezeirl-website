"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import EZEEmblemSVG from "./3D/EZEEmblemSVG";
import { navItems, navCta, secondaryNav } from "@/config/ecosystem";
import { track } from "@/lib/analytics";

type Tone = "irl" | "fit" | "form";

const toneOf = (pathname: string): Tone => (pathname.startsWith("/eze-fit") ? "fit" : pathname.startsWith("/merch") ? "form" : "irl");

const hover: Record<Tone, string> = {
  irl: "hover:text-brand-white focus-visible:text-brand-white",
  fit: "hover:text-fit-lime focus-visible:text-fit-lime",
  form: "hover:text-form-bone focus-visible:text-form-bone",
};
const activeText: Record<Tone, string> = { irl: "text-brand-gold", fit: "text-fit-lime", form: "text-form-bone" };
const ctaClass: Record<Tone, string> = {
  irl: "bg-brand-red border-brand-red text-white hover:bg-brand-red-bright hover:border-brand-red-bright",
  fit: "bg-fit-lime border-fit-lime text-fit-ink hover:bg-white hover:border-white",
  form: "bg-form-bone border-form-bone text-form-ink hover:bg-white hover:border-white",
};

function isActive(id: string, pathname: string): boolean {
  if (id === "eze-fit") return pathname.startsWith("/eze-fit");
  if (id === "merch") return pathname.startsWith("/merch");
  if (id === "home") return pathname === "/";
  return false;
}

export default function Navigation() {
  const pathname = usePathname() ?? "/";
  const isHome = pathname === "/";
  const tone = toneOf(pathname);
  const cta = pathname.startsWith("/eze-fit") ? navCta["/eze-fit"] : pathname.startsWith("/merch") ? navCta["/merch"] : navCta.default;

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu on route change.
  useEffect(() => setMenuOpen(false), [pathname]);

  // Mobile menu: lock page scroll, close on Escape, move focus in, return it on close.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const button = menuButtonRef.current;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      button?.focus();
    };
  }, [menuOpen]);

  const onCta = () => {
    setMenuOpen(false);
    if (pathname.startsWith("/eze-fit")) track("eze_fit_beta_cta", { surface: "nav" });
    if (pathname.startsWith("/merch")) track("merch_early_access_cta", { surface: "nav" });
  };

  return (
    <>
      <motion.nav
        initial={isHome ? { y: -80, opacity: 0 } : false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: isHome ? 1.5 : 0 }}
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "border-b border-white/10 bg-black/90 backdrop-blur-md" : "bg-transparent"
        }`}
        aria-label="Main navigation"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between sm:h-20">
            <Link href="/" className="group flex min-h-[44px] items-center gap-2.5" aria-label="EZE IRL home">
              <EZEEmblemSVG size={32} color="#c9a84c" animated={false} />
              <span className="font-display text-xl tracking-[0.15em] text-brand-white transition-colors duration-200 group-hover:text-brand-gold" style={{ fontFamily: "var(--font-bebas)" }}>
                EZE IRL
              </span>
            </Link>

            <ul className="hidden items-center gap-8 lg:flex">
              {navItems.slice(1).map((item) => {
                const active = isActive(item.id, pathname);
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`text-xs font-semibold uppercase tracking-widest transition-colors duration-200 ${active ? activeText[tone] : `text-white/70 ${hover[tone]}`}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="hidden items-center gap-3 lg:flex">
              <Link
                href={cta.href}
                onClick={onCta}
                className={`inline-flex min-h-[40px] items-center border px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-colors duration-200 ${ctaClass[tone]}`}
              >
                {cta.label}
              </Link>
            </div>

            <button
              ref={menuButtonRef}
              onClick={() => setMenuOpen((o) => !o)}
              className="-mr-2 flex h-12 w-12 items-center justify-center text-brand-white lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <span className="flex w-6 flex-col gap-1.5" aria-hidden="true">
                <motion.span animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} className="block h-px origin-center bg-brand-white" />
                <motion.span animate={menuOpen ? { opacity: 0 } : { opacity: 1 }} className="block h-px bg-brand-white" />
                <motion.span animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} className="block h-px origin-center bg-brand-white" />
              </span>
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 flex flex-col bg-black/95 px-6 pb-8 pt-24 backdrop-blur-xl lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <button ref={closeRef} onClick={() => setMenuOpen(false)} className="absolute right-3 top-3 flex h-12 w-12 items-center justify-center text-brand-white" aria-label="Close menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <ul className="flex flex-1 flex-col justify-center gap-1">
              {navItems.map((item) => {
                const active = isActive(item.id, pathname);
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`block py-2.5 font-display text-[clamp(38px,11vw,56px)] leading-none tracking-[0.06em] transition-colors ${active ? activeText[tone] : "text-brand-white"}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <ul className="mb-6 flex gap-6 font-mono text-xs tracking-[0.25em] text-white/70">
              {secondaryNav.map((s) => (
                <li key={s.label}>
                  <Link href={s.href} onClick={() => setMenuOpen(false)} className="inline-flex min-h-[44px] items-center hover:text-white">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href={cta.href}
              onClick={onCta}
              className={`inline-flex min-h-[56px] items-center justify-center border px-6 text-sm font-semibold uppercase tracking-[0.2em] transition-colors ${ctaClass[tone]}`}
            >
              {cta.label}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
