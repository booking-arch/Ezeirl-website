import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import EzeFitPage, { metadata as fitMeta } from "@/app/eze-fit/page";
import MerchPage, { metadata as merchMeta } from "@/app/merch/page";
import HomePage from "@/app/page";
import sitemap from "@/app/sitemap";
import ProductGrid from "@/components/merch/ProductGrid";
import { ezeFitAssets, ezeFormAssets, type FormProduct } from "@/config/assets";
import { navItems, secondaryNav } from "@/config/ecosystem";

const html = (el: React.ReactElement) => renderToStaticMarkup(el);
/** Page-specific content only: the shared EZE IRL header/footer legitimately mention gym challenges etc. */
const main = (el: React.ReactElement) =>
  (html(el).match(/<main[\s\S]*<\/main>/)?.[0] ?? "").split('aria-labelledby="ecosystem-heading"')[0]; // drop the cross-link strip: it describes the *other* brands

afterEach(() => vi.unstubAllEnvs());

describe("navigation", () => {
  it("has the agreed primary structure and routes", () => {
    expect(navItems.map((n) => n.label)).toEqual(["EZE IRL", "EZE-FIT", "MERCH", "STREAM", "PARTNERSHIPS"]);
    expect(navItems.find((n) => n.id === "eze-fit")?.href).toBe("/eze-fit");
    expect(navItems.find((n) => n.id === "merch")?.href).toBe("/merch");
  });
  it("uses absolute anchors so links work from /eze-fit and /merch", () => {
    for (const n of [...navItems, ...secondaryNav]) expect(n.href.startsWith("/")).toBe(true);
  });
  it("keeps WATCH and COMMUNITY reachable", () => {
    expect(secondaryNav.map((s) => s.label)).toEqual(["WATCH", "COMMUNITY"]);
  });
});

describe("/eze-fit", () => {
  it("renders the required beta content", () => {
    const out = html(<EzeFitPage />);
    for (const s of ["FITNESS", "PRIVATE BETA", "AVAILABLE BY INVITATION", "REQUEST BETA ACCESS", "JOIN THE LAUNCH WAITLIST", "HELP BUILD WHAT COMES NEXT.", "EZE-FIT IS CURRENTLY IN PRIVATE BETA.", "TRACK.", "TRAIN.", "PROGRESS.", "UNDERSTAND."]) {
      expect(out).toContain(s);
    }
    expect(out).toContain('id="main-content"');
    expect(out).toContain('id="beta-access"');
    expect(out).toContain('id="launch-waitlist"');
  });

  it("shows honest 'opening soon' panels and NO inputs while the legal gate is closed", () => {
    vi.stubEnv("WAITLIST_ENABLED", "false");
    const out = html(<EzeFitPage />);
    expect(out).toContain("BETA REQUESTS OPEN SOON");
    expect(out).toContain("LAUNCH LIST OPENS SOON");
    expect(out).not.toContain('type="email"');
  });

  it("renders both forms, as separate lists, once WAITLIST_ENABLED=true (config-only change)", () => {
    vi.stubEnv("WAITLIST_ENABLED", "true");
    const out = html(<EzeFitPage />);
    expect(out).toContain("REQUEST AN INVITE");
    expect(out).toContain("NOTIFY ME AT LAUNCH");
    expect((out.match(/type="email"/g) ?? []).length).toBe(2);
    expect(out).toContain('name="website"'); // honeypot present
  });

  it("makes no claim outside the verified feature matrix", () => {
    const out = main(<EzeFitPage />).toLowerCase();
    expect(out.length).toBeGreaterThan(1000);
    for (const banned of [
      "fit-mate", "fitmate", "ai coach", "ai coaching", "form feedback", "muscle visualization", "leaderboard", "challenge",
      "apple health", "health connect", "samsung", "photo analysis", "body fat", "usda", "supplement", "peptide", "diagnos", "app store badge",
      "guaranteed", "lose weight", "burn fat", "download now", "testimonial",
      "in waves", "reach out", "be in touch", "one email", "hear first", "consistent",
    ]) {
      // "diagnos" is allowed only inside the negated disclaimer ("does not diagnose")
      if (banned === "diagnos") expect(out.replace("does not diagnose, treat, cure or prevent", "")).not.toContain(banned);
      else expect(out, `unexpected claim: ${banned}`).not.toContain(banned);
    }
  });

  it("includes the medical/beta disclaimer", () => {
    const out = html(<EzeFitPage />);
    expect(out).toContain("not medical advice");
    expect(out).toContain("beta software");
  });

  it("never shows an invented app interface: with no real captures it shows the brand splash only", () => {
    expect(Object.values(ezeFitAssets.screens).every((s) => s === null)).toBe(true);
    const out = html(<EzeFitPage />);
    expect(out).toContain("FITNESS MADE EZE");
    expect(out).not.toMatch(/<img[^>]+screens\//);
  });

  it("has SEO metadata, canonical and structured data without ratings/offers", () => {
    expect(fitMeta.alternates?.canonical).toBe("/eze-fit");
    expect(String(fitMeta.title)).toContain("EZE-FIT");
    expect(String(fitMeta.description).length).toBeGreaterThan(80);
    const out = html(<EzeFitPage />);
    expect(out).toContain("application/ld+json");
    expect(out).not.toContain("aggregateRating");
    expect(out).not.toContain('"offers"');
  });
});

describe("/merch", () => {
  it("renders the launch page content", () => {
    const out = html(<MerchPage />);
    for (const s of ["EZE // FORM", "DROP 001", "COMING SOON", "GET EARLY ACCESS", "GET FIRST ACCESS TO DROP 001", "THE COLLECTION"]) expect(out).toContain(s);
    expect(out).toContain('id="early-access"');
  });

  it("does not invent price, material, size, stock or a release date", () => {
    const out = main(<MerchPage />);
    expect(out.length).toBeGreaterThan(1000);
    expect(out).not.toMatch(/\$\s?\d/);
    for (const banned of ["cotton", "polyester", "fleece", "fabric", "oversized fit", "in stock", "sold out", "add to cart", "checkout", "free shipping", "size chart", "xxl"]) {
      expect(out.toLowerCase(), `unexpected: ${banned}`).not.toContain(banned);
    }
    expect(out).not.toMatch(/\b(S|M|L|XL)\s*[\/,]\s*(M|L|XL)\b/);
  });

  it("collects the waitlist for eze_form from source 'merch' when enabled", () => {
    vi.stubEnv("WAITLIST_ENABLED", "true");
    const out = html(<MerchPage />);
    expect(out).toContain("JOIN THE WAITLIST");
    expect(out).toContain("Email me about Drop 001");
  });

  it("in PRODUCTION never renders placeholder product slots, only typographic content", () => {
    vi.stubEnv("NODE_ENV", "production");
    const out = html(<MerchPage />);
    expect(out).not.toContain("data-asset-placeholder");
    expect(out).not.toContain("AWAITING APPROVED ASSET");
    expect(out).toContain("PRODUCT IMAGERY IS ON THE WAY.");
    expect(ezeFormAssets.products).toHaveLength(0);
  });

  it("in development labels the missing assets so the gap is obvious", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(html(<MerchPage />)).toContain("AWAITING APPROVED ASSET");
  });

  it("has SEO metadata and a CollectionPage with no products listed", () => {
    expect(merchMeta.alternates?.canonical).toBe("/merch");
    const out = html(<MerchPage />);
    expect(out).toContain("CollectionPage");
    expect(out).not.toContain('"Product"');
  });
});

describe("ProductGrid (activates only when real assets are supplied)", () => {
  const img = (n: string) => ({ src: `/eze-form/products/${n}.webp`, width: 800, height: 1000, alt: `Test fixture ${n}` });
  const fixture: FormProduct[] = [
    { id: "t1", name: null, colorway: null, description: null, views: { front: img("front"), back: img("back") } },
    { id: "t2", name: null, colorway: null, description: null, views: { front: null } }, // no image → not shown
  ];

  it("shows only products with a real front image, always as COMING SOON, with no price", () => {
    const out = html(<ProductGrid products={fixture} />);
    expect(out).toContain("COMING SOON");
    expect(out).toContain("DROP 001 / 01");
    expect(out).not.toContain("DROP 001 / 02");
    expect(out).not.toMatch(/\$\s?\d/);
  });
});

describe("homepage evolution", () => {
  const out = html(<HomePage />);
  it("presents EZE-FIT as private beta with both CTAs", () => {
    for (const s of ["EZE-FIT — NOW IN BETA", "YOUR FITNESS.", "YOUR DATA.", "YOUR EVOLUTION.", "REQUEST BETA ACCESS", "EXPLORE EZE-FIT", "PRIVATE BETA — AVAILABLE BY INVITATION"]) expect(out).toContain(s);
    expect(out).toContain('href="/eze-fit"');
    expect(out).toContain('href="/eze-fit#beta-access"');
  });
  it("presents EZE // FORM as Drop 001 coming soon with both CTAs", () => {
    for (const s of ["EZE // FORM", "DROP 001", "COMING SOON", "EXPLORE THE COLLECTION", "GET EARLY ACCESS"]) expect(out).toContain(s);
    expect(out).toContain('href="/merch"');
  });
  it("keeps the existing EZE IRL content", () => {
    for (const s of ["BAD DECISIONS.", "BETTER STORIES.", "ENTER THE IRL", "JOIN THE MOVEMENT"]) expect(out).toContain(s);
    for (const id of ['id="home"', 'id="irl"', 'id="stream"', 'id="watch"', 'id="partnerships"', 'id="community"']) expect(out).toContain(id);
  });
  it("removed the legacy Fit-Mate visuals and unverified claims", () => {
    const lower = out.toLowerCase();
    for (const gone of ["fit-mate", "ai coach", "muscle visualization", "real-time form feedback", "challenges & streaks", "eze fitness app", "train with eze", "performance fabrics", "9:41"]) {
      expect(lower, `legacy claim still present: ${gone}`).not.toContain(gone);
    }
  });
});

describe("SEO artifacts", () => {
  it("sitemap lists the new routes and preserves the existing ones", () => {
    const urls = sitemap().map((s) => s.url);
    for (const u of ["", "/eze-fit", "/merch", "/privacy", "/terms", "/sponsorship-disclosure", "/filming-policy", "/accessibility"]) {
      expect(urls).toContain(`https://www.ezeirl.com${u}`);
    }
    expect(urls.some((u) => u.includes("/api"))).toBe(false);
    expect(urls.some((u) => u.includes("gym-collaboration-draft"))).toBe(false);
  });
  it("robots keeps the sitemap and draft rule, and hides API endpoints", () => {
    const robots = readFileSync("public/robots.txt", "utf8");
    expect(robots).toContain("Allow: /");
    expect(robots).toContain("Sitemap: https://www.ezeirl.com/sitemap.xml");
    expect(robots).toContain("Disallow: /gym-collaboration-draft");
    expect(robots).toContain("Disallow: /api/");
  });
});
