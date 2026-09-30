import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import EzeFitPage from "@/app/eze-fit/page";
import HomePage from "@/app/page";
import MerchPage from "@/app/merch/page";
import PartnershipsPage from "@/app/partnerships/page";
import ContentPage from "@/app/content/page";
import IntakePage from "@/app/intake/page";
import ClientPortalPage from "@/app/client-portal/page";

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

const html = (el: React.ReactElement) => renderToStaticMarkup(el);
const PAGES: [string, React.ReactElement][] = [
  ["/", <HomePage key="home" />],
  ["/eze-fit", <EzeFitPage key="fit" />],
  ["/merch", <MerchPage key="merch" />],
  ["/partnerships", <PartnershipsPage key="partnerships" />],
  ["/content", <ContentPage key="content" />],
  ["/intake", <IntakePage key="intake" />],
  ["/client-portal", <ClientPortalPage key="portal" />],
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
      // Every outbound href/src must be same-origin (relative, or the public ezeirl.com host) —
      // never an app host, an IP, or a bare port.
      const urls = [...out.matchAll(/(?:href|src)="(https?:\/\/[^"]+)"/g)].map((m) => m[1]);
      for (const u of urls) {
        expect(u, `${route} links off-site to ${u}`).toMatch(/^https:\/\/(www\.)?ezeirl\.com|fonts\.g/);
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
