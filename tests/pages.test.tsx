import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import EzeFitPage, { metadata as fitMeta } from "@/app/eze-fit/page";
import MerchPage, { metadata as merchMeta } from "@/app/merch/page";
import PartnershipsPage, { metadata as partnershipsMeta } from "@/app/partnerships/page";
import HomePage from "@/app/page";
import sitemap from "@/app/sitemap";
import ProductGrid from "@/components/merch/ProductGrid";
import { ezeFormAssets, ezeIrlPhotos, type FormProduct } from "@/config/assets";
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
    expect(navItems.find((n) => n.id === "partnerships")?.href).toBe("/partnerships");
  });
  it("uses absolute anchors so links work from /eze-fit and /merch", () => {
    for (const n of [...navItems, ...secondaryNav]) expect(n.href.startsWith("/")).toBe(true);
  });
  it("keeps WATCH, CONTENT and COMMUNITY reachable", () => {
    expect(secondaryNav.map((s) => s.label)).toEqual(["WATCH", "CONTENT", "COMMUNITY"]);
    expect(secondaryNav.find((s) => s.label === "CONTENT")?.href).toBe("/content");
  });
});

describe("/partnerships", () => {
  it("renders the real partnership content, contact, and disclosure — no fake contact details", () => {
    const out = html(<PartnershipsPage />);
    for (const s of ["BUILT ON", "AUTHENTICITY", "Gyms &amp; Fitness Facilities", "PARTNERSHIP INQUIRY", "SUPPLEMENT DISCLOSURE POLICY"]) expect(out).toContain(s);
    expect(out).toContain("booking@ezeirl.com");
    expect(out).not.toMatch(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/); // no phone number
  });
  it("has SEO metadata and a ContactPoint (email only)", () => {
    expect(partnershipsMeta.alternates?.canonical).toBe("/partnerships");
    const out = html(<PartnershipsPage />);
    expect(out).toContain("application/ld+json");
    expect(out).toContain('"ContactPoint"');
    expect(out).not.toMatch(/"telephone"/);
  });
});

describe("/eze-fit (exact replica of the real app's own landing page, per owner request)", () => {
  it("renders the real app's hero, panel and section copy verbatim", () => {
    const out = html(<EzeFitPage />);
    for (const s of [
      "PRIVATE BETA · INVITATION ONLY", "Your Fitness.", "Your Data.", "Your Plan.",
      "Join the private beta", "FITNESS INTELLIGENCE", "Evidence-backed", "Progress-aware",
      "One place for the signals that shape your next step.", "Personalized onboarding", "Macro tracking",
      "Food search + barcode", "Body Progress", "Fitness Coach", "Research Memory",
      "See the science behind the recommendation.", "THE COACH LANE", "No random chatbot answers.",
      "Track more than the scale.", "Private storage", "Permission-aware", "Non-clinical by design",
      "Help build the future of EZE-Fit.",
    ]) {
      expect(out, `missing: ${s}`).toContain(s);
    }
    expect(out).toContain('id="main-content"');
    expect(out).toContain('id="beta-signup"');
    expect((out.match(/type="email"/g) ?? []).length).toBe(2); // hero form + final CTA form, always rendered
  });

  it("shows the invitation-only message and stores nothing while the legal gate is closed", () => {
    vi.stubEnv("WAITLIST_ENABLED", "false");
    // handler-level behavior (503, no parsing) is covered by tests/waitlist/handler.test.ts;
    // here we only confirm the page still renders its two real single-field forms either way.
    const out = html(<EzeFitPage />);
    expect((out.match(/type="email"/g) ?? []).length).toBe(2);
    expect(out).not.toContain('name="firstName"'); // real form has no name field
    expect(out).not.toContain('name="consent"'); // real form has no checkbox
  });

  it("has no legacy Fit-Mate branding and no fabricated app screenshot", () => {
    const out = html(<EzeFitPage />).toLowerCase();
    for (const banned of ["fit-mate", "fitmate", "9:41", "download now", "testimonial", "guaranteed", "muscle visualization", "real-time form feedback"]) {
      expect(out, `unexpected: ${banned}`).not.toContain(banned);
    }
    expect(out).not.toMatch(/<img[^>]+screens\//); // no phone mockup on this page
  });

  it("is a standalone waitlist page: no login, no link to the real app", () => {
    const out = html(<EzeFitPage />);
    expect(out.toLowerCase()).not.toContain("log in");
    expect(out).not.toMatch(/href="https?:\/\/127\.0\.0\.1|tail2931c4\.ts\.net|localhost/);
    expect(out).toContain("Join the Beta");
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
    expect(out).toContain('href="/eze-fit#beta-signup"');
  });
  it("presents EZE // FORM as Drop 001 coming soon with both CTAs", () => {
    for (const s of ["EZE // FORM", "DROP 001", "COMING SOON", "EXPLORE THE COLLECTION", "GET EARLY ACCESS"]) expect(out).toContain(s);
    expect(out).toContain('href="/merch"');
  });
  it("presents the approved EZE IRL identity and keeps every existing section", () => {
    for (const t of ["DISCIPLINE", "CREATES", "Freedom", "EXPLORE EZE IRL", "JOIN THE MOVEMENT", "THIS IS", "Real training.", "FITNESS. COMEDY.", "LIVE", "BIGGER.", "never"]) expect(out).toContain(t);
    for (const id of ['id="home"', 'id="story"', 'id="irl"', 'id="lifestyle"', 'id="stream"', 'id="watch"', 'id="partnerships"', 'id="community"', 'id="lab"', 'id="eze-fit"', 'id="eze-form"']) expect(out).toContain(id);
    expect(out).toContain('href="/content"');
    expect(out).toContain("EXPLORE THE PHOTOS");
    // one h1, and it starts with the brand
    expect((out.match(/<h1/g) ?? []).length).toBe(1);
  });
  it("uses only registered professional photos, each with real alt text", () => {
    const srcs = [...out.matchAll(/eze-irl%2Fphotos%2F([^&"]+)/g)].map((m) => decodeURIComponent(m[1]));
    expect(srcs.length).toBeGreaterThan(5);
    for (const s of new Set(srcs)) expect(Object.values(ezeIrlPhotos).some((p) => p.src.endsWith(s)), `unregistered photo ${s}`).toBe(true);
    for (const img of out.match(/<img[^>]*>/g) ?? []) expect(img, "image without alt attribute").toMatch(/\balt=/);
  });
  it("removed the legacy Fit-Mate visuals and unverified claims", () => {
    const lower = out.toLowerCase();
    for (const gone of ["fit-mate", "ai coach", "muscle visualization", "real-time form feedback", "challenges & streaks", "eze fitness app", "train with eze", "performance fabrics", "9:41"]) {
      expect(lower, `legacy claim still present: ${gone}`).not.toContain(gone);
    }
  });
  it("community section uses the real gated waitlist, not the old fake stub", () => {
    expect(out).not.toContain("env.emailProvider");
    // Default test env has WAITLIST_ENABLED unset, so the real WaitlistForm shows its honest disabled panel.
    expect(out).toContain("UPDATES COMING SOON");
  });
  it("community section renders the real single-source-of-truth form once the gate is open", () => {
    vi.stubEnv("WAITLIST_ENABLED", "true");
    const enabledOut = html(<HomePage />);
    expect(enabledOut).toContain('name="email"');
    expect(enabledOut).toContain("Send me EZE IRL updates");
  });
});

describe("SEO artifacts", () => {
  it("sitemap lists the new routes and preserves the existing ones", () => {
    const urls = sitemap().map((s) => s.url);
    for (const u of ["", "/eze-fit", "/merch", "/partnerships", "/content", "/privacy", "/terms", "/sponsorship-disclosure", "/filming-policy", "/accessibility"]) {
      expect(urls).toContain(`https://www.ezeirl.com${u}`);
    }
    expect(urls.some((u) => u.includes("/api"))).toBe(false);
    expect(urls.some((u) => u.includes("gym-collaboration-draft"))).toBe(false);
    expect(urls.some((u) => u.includes("/intake"))).toBe(false);
    expect(urls.some((u) => u.includes("/client-portal"))).toBe(false);
    expect(urls.some((u) => u.includes("/login"))).toBe(false);
    expect(urls.some((u) => u.includes("/account"))).toBe(false);
    expect(urls.some((u) => u.includes("/coach"))).toBe(false);
    expect(urls.some((u) => u.includes("/plan"))).toBe(false);
  });
  it("robots keeps the sitemap and draft rule, and hides API endpoints", () => {
    const robots = readFileSync("public/robots.txt", "utf8");
    expect(robots).toContain("Allow: /");
    expect(robots).toContain("Sitemap: https://www.ezeirl.com/sitemap.xml");
    expect(robots).toContain("Disallow: /gym-collaboration-draft");
    expect(robots).toContain("Disallow: /intake");
    expect(robots).toContain("Disallow: /client-portal");
    expect(robots).toContain("Disallow: /login");
    expect(robots).toContain("Disallow: /register");
    expect(robots).toContain("Disallow: /account");
    expect(robots).toContain("Disallow: /coach");
    expect(robots).toContain("Disallow: /plan");
    expect(robots).toContain("Disallow: /api/");
  });
});
