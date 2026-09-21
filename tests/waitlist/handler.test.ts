import { describe, expect, it, vi } from "vitest";
import { handleWaitlistRequest, type WaitlistDeps } from "@/lib/waitlist/handler";
import { createMemoryRateLimiter } from "@/lib/waitlist/rate-limit";
import { createMemoryStore } from "@/lib/waitlist/memory-store";
import { isWaitlistEnabled, resolveWaitlistStore } from "@/lib/waitlist/store";

const HOST = "www.ezeirl.com";

function req(body: unknown, init: { headers?: Record<string, string>; raw?: string } = {}) {
  return new Request(`https://${HOST}/api/waitlist`, {
    method: "POST",
    headers: {
      host: HOST,
      origin: `https://${HOST}`,
      "content-type": "application/json",
      "x-forwarded-for": "203.0.113.7",
      ...init.headers,
    },
    body: init.raw ?? JSON.stringify(body),
  });
}

function deps(over: Partial<WaitlistDeps> = {}) {
  const store = createMemoryStore();
  const d: WaitlistDeps = {
    enabled: true,
    store,
    rateLimiter: createMemoryRateLimiter({ limit: 100, windowMs: 60_000 }),
    ...over,
  };
  return { d, store };
}

const good = { email: "Eze@Example.com", firstName: "Eze", interests: ["eze_fit_beta"], source: "eze_fit", consent: true };

describe("legal gate (WAITLIST_ENABLED)", () => {
  it("defaults to disabled when the env var is absent or not exactly 'true'", () => {
    expect(isWaitlistEnabled({} as NodeJS.ProcessEnv)).toBe(false);
    expect(isWaitlistEnabled({ WAITLIST_ENABLED: "1" } as unknown as NodeJS.ProcessEnv)).toBe(false);
    expect(isWaitlistEnabled({ WAITLIST_ENABLED: "TRUE" } as unknown as NodeJS.ProcessEnv)).toBe(false);
    expect(isWaitlistEnabled({ WAITLIST_ENABLED: "true" } as unknown as NodeJS.ProcessEnv)).toBe(true);
  });

  it("returns 503 and stores nothing while disabled, even for a perfectly valid request", async () => {
    const { d, store } = deps({ enabled: false });
    const res = await handleWaitlistRequest(req(good), d);
    expect(res.status).toBe(503);
    expect((await res.json()).code).toBe("disabled");
    expect(store.contacts.size).toBe(0);
  });

  it("does not even read or parse the body while disabled", async () => {
    const { d } = deps({ enabled: false });
    const r = req(good);
    const text = vi.spyOn(r, "text");
    await handleWaitlistRequest(r, d);
    expect(text).not.toHaveBeenCalled();
  });

  it("is enabled by config alone — same request succeeds once the flag is on", async () => {
    const { d, store } = deps({ enabled: true });
    expect((await handleWaitlistRequest(req(good), d)).status).toBe(200);
    expect(store.contacts.size).toBe(1);
  });
});

describe("store resolution", () => {
  it("never falls back to the in-memory store in production", () => {
    expect(resolveWaitlistStore({ NODE_ENV: "production" } as unknown as NodeJS.ProcessEnv)).toBeNull();
  });
  it("uses the in-memory store outside production when no DATABASE_URL", () => {
    expect(resolveWaitlistStore({ NODE_ENV: "development" } as unknown as NodeJS.ProcessEnv)).not.toBeNull();
  });
});

describe("request hardening", () => {
  it("rejects cross-origin posts", async () => {
    const { d, store } = deps();
    const res = await handleWaitlistRequest(req(good, { headers: { origin: "https://evil.example" } }), d);
    expect(res.status).toBe(403);
    expect(store.contacts.size).toBe(0);
  });

  it("rejects requests with no Origin header", async () => {
    const { d } = deps();
    const r = new Request(`https://${HOST}/api/waitlist`, {
      method: "POST",
      headers: { host: HOST, "content-type": "application/json" },
      body: JSON.stringify(good),
    });
    expect((await handleWaitlistRequest(r, d)).status).toBe(403);
  });

  it("rejects non-JSON content types", async () => {
    const { d } = deps();
    expect((await handleWaitlistRequest(req(good, { headers: { "content-type": "text/plain" } }), d)).status).toBe(415);
  });

  it("rejects malformed and oversized JSON", async () => {
    const { d } = deps();
    expect((await handleWaitlistRequest(req(null, { raw: "{not json" }), d)).status).toBe(400);
    expect((await handleWaitlistRequest(req(null, { raw: JSON.stringify({ email: "x".repeat(5000) }) }), d)).status).toBe(413);
  });

  it("rate-limits repeated attempts from one client and sets Retry-After", async () => {
    const { d } = deps({ rateLimiter: createMemoryRateLimiter({ limit: 2, windowMs: 60_000 }) });
    expect((await handleWaitlistRequest(req(good), d)).status).toBe(200);
    expect((await handleWaitlistRequest(req(good), d)).status).toBe(200);
    const blocked = await handleWaitlistRequest(req(good), d);
    expect(blocked.status).toBe(429);
    expect(Number(blocked.headers.get("retry-after"))).toBeGreaterThan(0);
  });

  it("rate-limits per client, not globally", async () => {
    const { d } = deps({ rateLimiter: createMemoryRateLimiter({ limit: 1, windowMs: 60_000 }) });
    await handleWaitlistRequest(req(good), d);
    const other = await handleWaitlistRequest(req(good, { headers: { "x-forwarded-for": "198.51.100.9" } }), d);
    expect(other.status).toBe(200);
  });

  it("marks every response no-store", async () => {
    const { d } = deps();
    expect((await handleWaitlistRequest(req(good), d)).headers.get("cache-control")).toBe("no-store");
  });
});

describe("signups", () => {
  it("rejects invalid emails with a field error and stores nothing", async () => {
    const { d, store } = deps();
    const res = await handleWaitlistRequest(req({ ...good, email: "not-an-email" }), d);
    expect(res.status).toBe(422);
    expect((await res.json()).errors.email).toBeTruthy();
    expect(store.contacts.size).toBe(0);
  });

  it("silently succeeds on a filled honeypot without storing", async () => {
    const { d, store } = deps();
    const res = await handleWaitlistRequest(req({ ...good, website: "spam.example" }), d);
    expect(res.status).toBe(200);
    expect(store.contacts.size).toBe(0);
  });

  it("treats a repeat signup as idempotent — one contact, one interest, same response", async () => {
    const { d, store } = deps();
    const a = await handleWaitlistRequest(req(good), d);
    const b = await handleWaitlistRequest(req({ ...good, email: "  EZE@example.com " }), d);
    expect(await a.json()).toEqual(await b.json()); // no enumeration oracle
    expect(store.contacts.size).toBe(1);
    expect([...store.contacts.values()][0].interests.size).toBe(1);
  });

  it("puts one person on several lists as ONE contact with several interests", async () => {
    const { d, store } = deps();
    await handleWaitlistRequest(req({ ...good, interests: ["eze_fit_beta"] }), d);
    await handleWaitlistRequest(req({ ...good, interests: ["eze_fit_launch", "eze_form"], source: "merch" }), d);
    expect(store.contacts.size).toBe(1);
    const c = [...store.contacts.values()][0];
    expect([...c.interests.keys()].sort()).toEqual(["eze_fit_beta", "eze_fit_launch", "eze_form"]);
  });

  it("keeps first-touch source and never overwrites an existing first name", async () => {
    const { d, store } = deps();
    await handleWaitlistRequest(req({ ...good, firstName: "Eze", source: "eze_fit" }), d);
    await handleWaitlistRequest(req({ ...good, firstName: "Attacker", source: "merch_home" }), d);
    const c = [...store.contacts.values()][0];
    expect(c.firstName).toBe("Eze");
    expect(c.interests.get("eze_fit_beta")?.source).toBe("eze_fit");
  });

  it("records consent only when the box was ticked, and never revokes it silently", async () => {
    const { d, store } = deps();
    await handleWaitlistRequest(req({ ...good, consent: false }), d);
    const c = [...store.contacts.values()][0];
    expect(c.interests.get("eze_fit_beta")?.consentAt).toBeNull();
    await handleWaitlistRequest(req({ ...good, consent: true }), d);
    expect(c.interests.get("eze_fit_beta")?.consentAt).toBeInstanceOf(Date);
    expect(c.interests.get("eze_fit_beta")?.consentTextVersion).toBeTruthy();
    await handleWaitlistRequest(req({ ...good, consent: false }), d);
    expect(c.interests.get("eze_fit_beta")?.consentAt).toBeInstanceOf(Date);
  });

  it("returns a generic 500 without leaking the email when the store fails", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { d } = deps({ store: { upsert: async () => { throw new Error("connection refused eze@example.com"); } } });
    const res = await handleWaitlistRequest(req(good), d);
    const text = JSON.stringify(await res.json());
    expect(res.status).toBe(500);
    expect(text).not.toContain("eze@example.com");
    expect(text).not.toContain("connection refused");
    expect(JSON.stringify(spy.mock.calls)).not.toContain("eze@example.com");
    spy.mockRestore();
  });

  it("answers 503 (not a crash) when enabled but no store is configured", async () => {
    const { d } = deps({ store: null });
    const res = await handleWaitlistRequest(req(good), d);
    expect(res.status).toBe(503);
    expect((await res.json()).code).toBe("unavailable");
  });
});

describe("memory rate limiter", () => {
  it("frees capacity after the window passes", () => {
    let t = 0;
    const rl = createMemoryRateLimiter({ limit: 1, windowMs: 1000, now: () => t });
    expect(rl.check("k").allowed).toBe(true);
    expect(rl.check("k").allowed).toBe(false);
    t = 1001;
    expect(rl.check("k").allowed).toBe(true);
  });
});
