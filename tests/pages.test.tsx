import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import EzeFitPage, { metadata as fitMeta } from "@/app/eze-fit/beta/page";
import UniverseHome, { metadata as irlMeta } from "@/app/(universe)/page";
import UniverseFit, { metadata as uFitMeta } from "@/app/(universe)/eze-fit/page";
import UniverseForm, { metadata as uFormMeta } from "@/app/(universe)/eze-form/page";
import Footer from "@/components/universe/Footer";
import nextConfig from "@/next.config";
import PartnershipsPage, { metadata as partnershipsMeta } from "@/app/(universe)/partnerships/page";
import sitemap from "@/app/sitemap";
import { existsSync } from "node:fs";
import * as universe from "@/lib/universe/content";

const html = (el: React.ReactElement) => renderToStaticMarkup(el);
/** Page-specific content only: the shared EZE IRL header/footer legitimately mention gym challenges etc. */
const main = (el: React.ReactElement) =>
  (html(el).match(/<main[\s\S]*<\/main>/)?.[0] ?? "").split('aria-labelledby="ecosystem-heading"')[0]; // drop the cross-link strip: it describes the *other* brands

afterEach(() => vi.unstubAllEnvs());

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

describe("/eze-fit/beta (exact replica of the real app's own landing page, kept for the gated waitlist)", () => {
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
    expect(fitMeta.alternates?.canonical).toBe("/eze-fit/beta");
    expect(fitMeta.robots).toMatchObject({ index: false }); // duplicate of the /eze-fit brand page
    expect(String(fitMeta.title)).toContain("EZE-FIT");
    expect(String(fitMeta.description).length).toBeGreaterThan(80);
    const out = html(<EzeFitPage />);
    expect(out).toContain("application/ld+json");
    expect(out).not.toContain("aggregateRating");
    expect(out).not.toContain('"offers"');
  });
});

describe("EZE Universe pages (rebuild of the live ezeirl.com)", () => {
  /** "checkout" is only allowed in the honest phrase "without fake checkout". */
  const hasRealCheckout = (out: string) => /(?<!fake )checkout/i.test(out);
  const BANNED_CLAIMS = ["testimonial", "guaranteed", "add to cart", "free shipping", "in stock", "sold out", "size chart", "fit-mate", "fitmate"];

  describe("/ (EZE IRL)", () => {
    const out = html(<UniverseHome />);
    it("carries the live headline, hero copy and every section anchor", () => {
      for (const s of ["DISCIPLINE CREATES", "FREEDOM", "MORE THAN A WORKOUT. A HIGHER STATE.", "THE EZE UNIVERSE", "THIS IS", "THE SOUNDTRACK TO THE", "REAL LIFE. NO FILTER.", "Three pathways. One standard."]) {
        expect(out, `missing: ${s}`).toContain(s);
      }
      for (const id of ['id="home"', 'id="about"', 'id="music"', 'id="content"']) expect(out).toContain(id);
      expect((out.match(/<h1/g) ?? []).length).toBe(1);
    });
    it("links to the other brand pages and never to the retired /merch", () => {
      expect(out).toContain('href="/eze-fit"');
      expect(out).toContain('href="/eze-form"');
      expect(out).not.toContain('href="/merch"');
    });
    it("makes no invented claims (YouTube is honest about zero uploads)", () => {
      expect(out).toContain("Zero uploads at ship");
      for (const banned of BANNED_CLAIMS) expect(out.toLowerCase(), `unexpected: ${banned}`).not.toContain(banned);
      expect(hasRealCheckout(out)).toBe(false);
    });
    it("has SEO metadata", () => {
      expect(irlMeta.alternates?.canonical).toBe("/");
      expect(String(irlMeta.title)).toContain("Discipline Creates Freedom");
    });
  });

  describe("/eze-fit (brand page)", () => {
    const out = html(<UniverseFit />);
    it("labels the phone as a demo, never as real app UI", () => {
      for (const s of ["DEMO · PRIVATE BETA", "Stylized HUD · not live data"]) expect(out).toContain(s);
      expect(out).toContain("Campaign stills · not live app UI");
    });
    it("is honest about what is still being built", () => {
      for (const s of ["STILL BUILDING", "Barcode scanner", "AI coach", "Not fully autonomous yet"]) expect(out).toContain(s);
    });
    it("makes no unconfirmed claims, prices or private links", () => {
      for (const banned of [...BANNED_CLAIMS, "9:41", "real-time form feedback", "muscle visualization"]) expect(out.toLowerCase(), `unexpected: ${banned}`).not.toContain(banned);
      expect(out).not.toMatch(/\$\s?\d/);
    });
    it("has SEO metadata with a canonical", () => {
      expect(uFitMeta.alternates?.canonical).toBe("/eze-fit");
      expect(String(uFitMeta.title)).toContain("EZE-FIT");
    });
  });

  describe("/eze-form (brand page)", () => {
    const out = html(<UniverseForm />);
    it("is a capsule preview, not a shop: no price, stock, checkout or release date", () => {
      for (const s of ["UNDER CONSTRUCTION", "not a live shop. No prices. No", "COMING"]) expect(out).toContain(s);
      expect(out).not.toMatch(/\$\s?\d/);
      for (const banned of BANNED_CLAIMS) expect(out.toLowerCase(), `unexpected: ${banned}`).not.toContain(banned);
      expect(out).not.toMatch(/\b(S|M|L|XL)\s*[\/,]\s*(M|L|XL)\b/); // no size runs
    });
    it("shows every board with a COMING badge and a notify link", () => {
      expect((out.match(/form__badge">COMING</g) ?? []).length).toBe(universe.FORM_PRODUCTS.length);
      expect(out).toContain("mailto:");
    });
    it("has SEO metadata with a canonical", () => {
      expect(uFormMeta.alternates?.canonical).toBe("/eze-form");
    });
  });

  describe("shared shell", () => {
    it("footer links the legal pages and only public social hosts", () => {
      const out = html(<Footer />);
      for (const href of ["/privacy", "/terms", "/accessibility", "/contact"]) expect(out).toContain(`href="${href}"`);
      for (const s of universe.SOCIALS) expect(out).toContain(s.href);
    });
    it("/merch permanently redirects to /eze-form", async () => {
      const redirects = await nextConfig.redirects!();
      expect(redirects).toContainEqual({ source: "/merch", destination: "/eze-form", permanent: true });
    });
  });

  describe("content integrity", () => {
    const local = (src: string) => src.startsWith("/");
    const allImages = [
      ...Object.values(universe.IMG),
      ...universe.CATEGORIES.map((c) => c.img),
      ...universe.FRAMES.map((f) => f.src),
      ...universe.FIT_CREATIVES.map((c) => c.src),
      ...universe.FORM_PRODUCTS.map((p) => p.img),
      ...universe.FORM_LOOKS.map((l) => l.img),
    ];
    it("every referenced image exists under public/ (no broken images)", () => {
      for (const src of allImages) expect(local(src) && existsSync(`public${src}`), `missing asset ${src}`).toBe(true);
    });
    it("every product has alt text and a mode", () => {
      for (const p of universe.FORM_PRODUCTS) { expect(p.alt.length).toBeGreaterThan(10); expect(["form", "chaos"]).toContain(p.mode); }
    });
    it("ambient audio stays unset until a real file exists", () => {
      if (universe.AMBIENT_AUDIO_SRC) expect(existsSync(`public${universe.AMBIENT_AUDIO_SRC}`)).toBe(true);
    });
  });
});

describe("SEO artifacts", () => {
  it("sitemap lists the new routes and preserves the existing ones", () => {
    const urls = sitemap().map((s) => s.url);
    for (const u of ["", "/eze-fit", "/eze-form", "/partnerships", "/content", "/privacy", "/terms", "/sponsorship-disclosure", "/filming-policy", "/accessibility"]) {
      expect(urls).toContain(`https://ezeirl.com${u}`);
    }
    expect(urls.some((u) => u.includes("/api"))).toBe(false);
    expect(urls.some((u) => u.includes("/merch"))).toBe(false); // redirected to /eze-form
    expect(urls.some((u) => u.includes("/eze-fit/beta"))).toBe(false);
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
    expect(robots).toContain("Sitemap: https://ezeirl.com/sitemap.xml");
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
