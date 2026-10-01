import Link from "next/link";
import { IMG, SOCIALS } from "@/lib/universe/content";
import { SITE_EMAIL } from "@/lib/universe/site";
import TrackedLink from "./TrackedLink";

const mailto = `mailto:${SITE_EMAIL}`;

export default function Footer() {
  return (
    <footer id="contact" className="footer">
      <div className="footer__hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={IMG.lifestyle2} alt="" className="footer__bg" loading="lazy" />
        <div className="footer__veil" />
        <div className="footer__cta container reveal">
          <p className="footer__kicker">BIGGER WORKOUTS. BRIGHTER TOMORROWS.</p>
          <h2 className="script footer__never">You&apos;re <span className="lime">NEVER</span> FINISHED.</h2>
          <TrackedLink href={mailto} className="btn btn-solid" event="contact_click" params={{ cta_label: "JOIN THE MOVEMENT", component: "Footer", link_url: mailto }}>
            JOIN THE MOVEMENT
          </TrackedLink>
        </div>
      </div>
      <div className="footer__bar">
        <div className="footer__bar-inner container">
          <Link href="/" className="footer__logo" aria-label="EZE IRL">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMG.logoWhite} alt="EZE IRL" width={400} height={133} loading="lazy" />
          </Link>
          <p className="footer__slogan">DISCIPLINE CREATES FREEDOM.</p>
          <ul className="footer__social" aria-label="Social">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <TrackedLink href={s.href} aria-label={s.label} external event="outbound_click" params={{ cta_label: s.label, component: "Footer", platform: s.platform, link_url: s.href }}>
                  {s.short}
                </TrackedLink>
              </li>
            ))}
          </ul>
          <TrackedLink href={mailto} className="btn btn-nav" event="contact_click" params={{ cta_label: "JOIN THE MOVEMENT →", component: "Footer", link_url: mailto }}>
            JOIN THE MOVEMENT →
          </TrackedLink>
        </div>
        <nav className="footer__legal container" aria-label="Legal">
          <span>© {new Date().getFullYear()} EZE IRL · EZE-FIT private beta · Fitness made EZE</span>
          <span className="footer__legal-links">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/accessibility">Accessibility</Link>
            <Link href="/contact">Contact</Link>
          </span>
        </nav>
      </div>
    </footer>
  );
}
