import { describe, expect, it } from "vitest";
import { normalizeEmail, normalizeFirstName } from "@/lib/waitlist/normalize";
import { parseWaitlistPayload } from "@/lib/waitlist/validate";

describe("normalizeEmail", () => {
  it("trims and lowercases", () => {
    expect(normalizeEmail("  Eze.Cruz@Example.COM ")).toBe("eze.cruz@example.com");
  });

  it("keeps plus-tags and dots (different mailboxes must not merge)", () => {
    expect(normalizeEmail("a.b+promo@gmail.com")).toBe("a.b+promo@gmail.com");
    expect(normalizeEmail("ab@gmail.com")).not.toBe(normalizeEmail("a.b@gmail.com"));
  });

  it("punycodes internationalized domains", () => {
    expect(normalizeEmail("user@bücher.example")).toBe("user@xn--bcher-kva.example");
  });

  it("folds full-width lookalikes via NFKC", () => {
    expect(normalizeEmail("ａ@example.com")).toBe("a@example.com");
  });

  it.each([
    "",
    "plain",
    "@example.com",
    "a@",
    "a@@example.com",
    "a b@example.com",
    "a@example",
    "a@.example.com",
    "a@example..com",
    "a..b@example.com",
    ".a@example.com",
    "a.@example.com",
    "a@-example.com",
    "a@example.123",
    "a@example.com\n",
    `${"x".repeat(65)}@example.com`,
    `a@${"x".repeat(250)}.com`,
  ])("rejects %j", (bad) => {
    // "a@example.com\n" trims to a valid address, so it is the one allowed exception
    if (bad === "a@example.com\n") return expect(normalizeEmail(bad)).toBe("a@example.com");
    expect(normalizeEmail(bad)).toBeNull();
  });

  it("rejects non-strings", () => {
    for (const v of [null, undefined, 42, {}, [], true]) expect(normalizeEmail(v)).toBeNull();
  });
});

describe("normalizeFirstName", () => {
  it("returns null for empty / absent", () => {
    expect(normalizeFirstName(undefined)).toBeNull();
    expect(normalizeFirstName("   ")).toBeNull();
  });
  it("accepts international names and punctuation", () => {
    expect(normalizeFirstName("  José  Luis ")).toBe("José Luis");
    expect(normalizeFirstName("O'Brien-Smith")).toBe("O'Brien-Smith");
  });
  it("rejects markup, digits and overlong values", () => {
    expect(normalizeFirstName("<script>")).toBeUndefined();
    expect(normalizeFirstName("Eze2")).toBeUndefined();
    expect(normalizeFirstName("x".repeat(61))).toBeUndefined();
    expect(normalizeFirstName(5)).toBeUndefined();
  });
});

const base = { email: "Eze@Example.com", interests: ["eze_fit_beta"], source: "eze_fit" };

describe("parseWaitlistPayload", () => {
  it("accepts a minimal valid signup", () => {
    const r = parseWaitlistPayload(base);
    expect(r).toMatchObject({ ok: true, honeypot: false });
    if (r.ok && !r.honeypot) {
      expect(r.data.emailNormalized).toBe("eze@example.com");
      expect(r.data.email).toBe("Eze@Example.com");
      expect(r.data.firstName).toBeNull();
      expect(r.data.consent).toBe(false);
    }
  });

  it("supports one contact joining several lists and de-duplicates them", () => {
    const r = parseWaitlistPayload({ ...base, interests: ["eze_fit_beta", "eze_fit_launch", "eze_fit_beta", "eze_form"] });
    expect(r.ok && !r.honeypot && r.data.interests).toEqual(["eze_fit_beta", "eze_fit_launch", "eze_form"]);
  });

  it("accepts the singular `interest` form", () => {
    const r = parseWaitlistPayload({ email: base.email, interest: "eze_form", source: "merch" });
    expect(r.ok && !r.honeypot && r.data.interests).toEqual(["eze_form"]);
  });

  it("requires consent to be strictly true", () => {
    const yes = parseWaitlistPayload({ ...base, consent: true });
    const str = parseWaitlistPayload({ ...base, consent: "true" });
    expect(yes.ok && !yes.honeypot && yes.data.consent).toBe(true);
    expect(str.ok && !str.honeypot && str.data.consent).toBe(false);
  });

  it("reports field errors", () => {
    const r = parseWaitlistPayload({ email: "nope", firstName: "<b>", interests: ["hack"], source: "x", campaign: "a b" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(["campaign", "email", "firstName", "interests", "source"]);
  });

  it("rejects unknown interests even when mixed with valid ones", () => {
    expect(parseWaitlistPayload({ ...base, interests: ["eze_fit_beta", "admin"] }).ok).toBe(false);
  });

  it("rejects an empty or missing interest list", () => {
    expect(parseWaitlistPayload({ ...base, interests: [] }).ok).toBe(false);
    expect(parseWaitlistPayload({ email: base.email, source: "eze_fit" }).ok).toBe(false);
  });

  it("flags a filled honeypot without validating further", () => {
    expect(parseWaitlistPayload({ email: "bad", website: "http://spam" })).toEqual({ ok: true, honeypot: true });
  });

  it("does not let extra client fields through", () => {
    const r = parseWaitlistPayload({ ...base, status: "converted", metadata: { a: 1 }, role: "admin" });
    expect(r.ok && !r.honeypot && Object.keys(r.data).sort()).toEqual(
      ["campaign", "consent", "email", "emailNormalized", "firstName", "interests", "referral", "source"],
    );
  });

  it("rejects non-object bodies", () => {
    for (const v of [null, "x", 1, [], undefined]) expect(parseWaitlistPayload(v).ok).toBe(false);
  });
});
