import { afterEach, describe, expect, it, vi } from "vitest";
import { ANALYTICS_EVENTS, registerAnalyticsProvider, sanitizeProps, track } from "@/lib/analytics";
import { jsonLd } from "@/lib/json-ld";

afterEach(() => {
  registerAnalyticsProvider(null);
  vi.unstubAllGlobals();
});

describe("analytics layer", () => {
  it("defines exactly the required events", () => {
    expect([...ANALYTICS_EVENTS].sort()).toEqual(
      [
        "eze_fit_beta_cta", "eze_fit_beta_signup", "eze_fit_launch_signup", "eze_fit_view",
        "merch_early_access_cta", "merch_product_view", "merch_view", "merch_waitlist_signup",
        "eze_irl_community_signup", "partnership_cta", "social_click", "content_click",
      ].sort(),
    );
  });

  it("drops everything when no provider is registered (site ships with no analytics)", () => {
    vi.stubGlobal("navigator", {});
    expect(() => track("eze_fit_view")).not.toThrow();
  });

  it("strips emails, unknown keys, non-strings and long values before they reach a provider", () => {
    expect(
      sanitizeProps({ surface: "hero", email: "a@b.co", firstName: "Eze", interest: "eze_form", campaign: "a@b.co", product_id: "x".repeat(65), location: 5, weight_kg: "80", calories: "2000" }),
    ).toEqual({ surface: "hero", interest: "eze_form" });
  });

  it("forwards sanitized props to a registered provider", () => {
    vi.stubGlobal("navigator", {});
    const seen: unknown[] = [];
    registerAnalyticsProvider({ track: (e, p) => seen.push([e, p]) });
    track("merch_product_view", { product_id: "p1", email: "leak@x.co" });
    expect(seen).toEqual([["merch_product_view", { product_id: "p1" }]]);
  });

  it("honors Global Privacy Control and Do Not Track", () => {
    const seen: unknown[] = [];
    registerAnalyticsProvider({ track: (...a) => seen.push(a) });
    vi.stubGlobal("navigator", { globalPrivacyControl: true });
    track("eze_fit_view");
    vi.stubGlobal("navigator", { doNotTrack: "1" });
    track("eze_fit_view");
    expect(seen).toHaveLength(0);
  });

  it("never lets a failing provider break the page", () => {
    vi.stubGlobal("navigator", {});
    registerAnalyticsProvider({ track: () => { throw new Error("boom"); } });
    expect(() => track("eze_fit_view")).not.toThrow();
  });
});

describe("json-ld", () => {
  it("escapes '<' so data can never close the script tag", () => {
    expect(jsonLd({ a: "</script><script>alert(1)</script>" })).not.toContain("</script>");
  });
});
