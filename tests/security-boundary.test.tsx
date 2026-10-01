import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import EzeFitPage from "@/app/eze-fit/beta/page";
import HomePage from "@/app/(universe)/page";
import UniverseFitPage from "@/app/(universe)/eze-fit/page";
import UniverseFormPage from "@/app/(universe)/eze-form/page";
import Footer from "@/components/universe/Footer";
import PartnershipsPage from "@/app/(universe)/partnerships/page";
import ContentPage from "@/app/(universe)/content/page";
import LoginPage from "@/app/(universe)/login/page";
import RegisterPage from "@/app/(universe)/register/page";
import AccountPage from "@/app/(universe)/account/page";
import IntakePage from "@/app/(universe)/intake/page";
import ClientPortalPage from "@/app/client-portal/page";
import CoachPage from "@/app/coach/page";
import PlanDocument from "@/components/plans/PlanDocument";

/**
 * Critical security rule (explicit project requirement): the public website must never expose
 * Tailscale/tailnet URLs, localhost, internal hostnames, private EZE-Fit application routes, admin
 * routes, or server infrastructure details. This suite enforces it two ways:
 *  1. Against server-rendered HTML of every public page (fast, runs every `npm test`).
 *  2. Against the actual compiled `.next` output, when present (`npm run build` first) — this is
 *     what a browser really downloads, so it also catches anything baked into client JS/OG images.
 */
const PRIVATE_PATTERNS = [
  /127\.0\.0\.1/,
  /\bts\.net\b/i,
  /tailscale/i,
  /tailnet/i,
  /baires-ai/i,
  /fit-mate/i,
  /localhost:\d{4}\b/, // "localhost" alone matches legitimate framework internals; a port makes it app-specific
  /:3005\b/,
  /:3110\b/,
  /\b10\.255\.\d+\.\d+\b/,
  /\b192\.168\.\d+\.\d+\b/,
];

/** Public hosts a page may link to: our own domain, font CDN, and the music/social profiles already published on the live site. */
const PUBLIC_HOSTS = /^https:\/\/((www\.)?ezeirl\.com|fonts\.g|open\.spotify\.com|music\.apple\.com|music\.youtube\.com|soundcloud\.com|(www\.)?instagram\.com|(www\.)?tiktok\.com|(www\.)?youtube\.com|x\.com)(\/|$|\?)/;

const html = (el: React.ReactElement) => renderToStaticMarkup(el);
const PAGES: [string, React.ReactElement][] = [
  ["/", <HomePage key="home" />],
  ["/eze-fit", <UniverseFitPage key="ufit" />],
  ["/eze-form", <UniverseFormPage key="uform" />],
  ["/eze-fit/beta", <EzeFitPage key="fit" />],
  ["(footer)", <Footer key="footer" />],
  ["/partnerships", <PartnershipsPage key="partnerships" />],
  ["/content", <ContentPage key="content" />],
  ["/login", <LoginPage key="login" />],
  ["/register", <RegisterPage key="register" />],
  ["/account", <AccountPage key="account" />],
  ["/intake", <IntakePage key="intake" />],
  ["/client-portal", <ClientPortalPage key="portal" />],
  ["/coach", <CoachPage key="coach" />],
  ["/plan/waiting", <PlanDocument key="waiting" plan={{ status: "draft", clientName: "Alex" }} />],
  ["/plan/published", <PlanDocument key="published" plan={{ status: "published", clientName: "Alex", serviceLabel: "Personal training", goals: "Strength", idealOutcome: "Feel better", fitnessPlan: "Practice a squat.", meals: "Eat foods you already like.", schedule: "Monday — Training" }} />],
];

describe("security boundary: no private infrastructure ever reaches the public site", () => {
  for (const [route, el] of PAGES) {
    it(`${route}: rendered HTML has no private URLs, hosts or IPs`, () => {
      const out = html(el);
      for (const re of PRIVATE_PATTERNS) expect(out, `${route} leaked ${re}`).not.toMatch(re);
    });
  }

  it("no page links directly into the private EZE-Fit application", () => {
    for (const [route, el] of PAGES) {
      const out = html(el);
      // Every outbound href/src must be same-origin (relative, or the public ezeirl.com host) or one of the
      // named public music / social hosts below — never an app host, an IP, or a bare port.
      const urls = [...out.matchAll(/(?:href|src)="(https?:\/\/[^"]+)"/g)].map((m) => m[1]);
      for (const u of urls) {
        expect(u, `${route} links off-site to ${u}`).toMatch(PUBLIC_HOSTS);
      }
    }
  });

  it("does not link to /admin, /api/admin, or any authenticated-app route", () => {
    for (const [route, el] of PAGES) {
      const out = html(el);
      expect(out, route).not.toMatch(/href="\/?(admin|dashboard|api\/admin)/i);
    }
  });

  const nextDir = ".next";
  const hasBuild = existsSync(nextDir);
  (hasBuild ? it : it.skip)("compiled .next/static output (what the browser downloads) is clean — run `npm run build` first", () => {
    const walk = (d: string): string[] => readdirSync(d).flatMap((n) => { const p = `${d}/${n}`; return statSync(p).isDirectory() ? walk(p) : [p]; });
    const files = walk(`${nextDir}/static`).filter((f) => /\.(js|css|json)$/.test(f) && !f.endsWith(".map"));
    for (const f of files) {
      const text = readFileSync(f, "utf8");
      for (const re of [/tail2931c4\.ts\.net/, /baires-ai/i, /fit-mate-prod/i, /:3005\b/, /:3110\b/]) {
        expect(text, `${f} leaked ${re}`).not.toMatch(re);
      }
    }
  });
});
