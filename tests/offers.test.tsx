import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import GuidePage, { metadata as guideMeta } from "@/app/(universe)/guide/page";
import CookbookPage, { metadata as cookbookMeta } from "@/app/(universe)/cookbook/page";
import { BRANDS, HOME_SECTIONS } from "@/lib/universe/content";
import sitemap from "@/app/sitemap";

const html = (el: React.ReactElement) => renderToStaticMarkup(el);

describe("/guide", () => {
  const out = html(<GuidePage />);

  it("states the guide in the owner's words and lists the contents", () => {
    for (const s of [
      "Faith &amp; Fitness",
      "Starter Guide",
      "God first. Then the work.",
      "A 4-week beginner plan for your body, your plate, and your walk with God.",
      "No hype. No shortcuts. Just showing up.",
      "4-week gym plan",
      "3 full-body workouts a week",
      "45–60 minutes",
      "Exercise guide",
      "10 budget-friendly high-protein meals",
      "Weekly faith reflections",
      "Weekly check-in trackers",
      "Not medical advice.",
    ]) {
      expect(out, `missing: ${s}`).toContain(s);
    }
    expect((out.match(/<h1/g) ?? []).length).toBe(1);
  });

  it("shows an email form that cannot submit or collect", () => {
    expect(out).toContain('type="email"');
    expect(out).toContain('name="email"');
    expect(out).toContain('name="consent"');
    expect(out).toContain("Get the free guide");
    expect(out).toContain("disabled");
    expect(out).toContain('aria-disabled="true"');
    expect(out).not.toMatch(/<form[^>]*action=/);
    expect(out).not.toContain("/api/waitlist");
    expect(out).toContain('href="/privacy"');
    expect(out).toContain("does not send or store your email");
  });

  it("stays out of search and makes no product claims", () => {
    expect(guideMeta.robots).toEqual({ index: false, follow: false });
    expect(guideMeta.alternates?.canonical).toBe("/guide");
    const lower = out.toLowerCase();
    for (const banned of ["eze-fit", "eze fit", "testimonial", "guaranteed", "followers", "lbs", "calorie"]) {
      expect(lower, `unexpected: ${banned}`).not.toContain(banned);
    }
    expect(out).not.toContain("aggregateRating");
    expect(out).not.toContain('"offers"');
  });
});

describe("/cookbook", () => {
  const out = html(<CookbookPage />);

  it("uses the working title and the kitchen hook", () => {
    for (const s of [
      "Working title",
      "EZE IRL Kitchen",
      "Real Food for Real Life",
      "What they see: the gym clips. Reality: it starts in the kitchen.",
      "A PDF cookbook",
    ]) {
      expect(out, `missing: ${s}`).toContain(s);
    }
    expect((out.match(/<h1/g) ?? []).length).toBe(1);
  });

  it("shows pending prices and a buy button that cannot take payment", () => {
    expect(out).toContain("Pending approval");
    expect(out).toContain("$9");
    expect(out).toContain("$14");
    expect(out).toContain("not a confirmed price");
    expect(out).toContain("Buy the cookbook");
    expect(out).toContain("does not take payment");
    expect(out).toContain("disabled");
    expect(out).not.toMatch(/<(form|a)[^>]*(stripe|checkout|paypal)/i);
    expect(out).not.toContain('href="https://buy');
  });

  it("flags the unfinished recipe count and avoids a final total", () => {
    expect(out).toContain("Recipe count is not final. 3 of 30 recipes are written.");
    expect(out).toContain("Do not read 30 as a finished total.");
    expect(out).not.toMatch(/includes 30|30 finished|all 30|30 recipes included/i);
  });

  it("stays out of search and stays EZE IRL", () => {
    expect(cookbookMeta.robots).toEqual({ index: false, follow: false });
    expect(cookbookMeta.alternates?.canonical).toBe("/cookbook");
    const lower = out.toLowerCase();
    for (const banned of ["eze-fit", "testimonial", "guaranteed", "followers", "burns", "macros"]) {
      expect(lower, `unexpected: ${banned}`).not.toContain(banned);
    }
  });
});

describe("unreleased offer routing", () => {
  it("is absent from the nav, the sitemap, and robots allow-list", () => {
    const hrefs = [...BRANDS.map((b) => b.href), ...HOME_SECTIONS.map((s) => s.href)];
    expect(hrefs).not.toContain("/guide");
    expect(hrefs).not.toContain("/cookbook");
    const urls = sitemap().map((s) => s.url);
    expect(urls.some((u) => u.includes("/guide"))).toBe(false);
    expect(urls.some((u) => u.includes("/cookbook"))).toBe(false);
    const robots = readFileSync("public/robots.txt", "utf8");
    expect(robots).toContain("Disallow: /guide");
    expect(robots).toContain("Disallow: /cookbook");
  });
});
