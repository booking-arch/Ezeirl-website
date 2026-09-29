import { describe, expect, it } from "vitest";
import { INTAKE_SECTIONS } from "@/config/intake";
import { handleIntakeRequest, type IntakeDeps } from "@/lib/intake/handler";
import { createMemoryIntakeStore, isIntakeEnabled } from "@/lib/intake/store";
import { parseIntakePayload } from "@/lib/intake/validate";
import { createMemoryRateLimiter } from "@/lib/waitlist/rate-limit";

const HOST = "www.ezeirl.com";
const answers = {
  fullName: "Jane Doe", email: "Jane@Example.com", phone: "+1 (555) 010-1234", ageDob: "34", occupation: "Nurse",
  parqHeart: "no", parqChestPain: "no", parqDizzy: "no", injuries: "None", medications: "None", pregnancy: "na",
  exerciseDays: "1-2", pastActivity: "Running", stress: "3", sleep: "5-6", nutrition: "Okay",
  goals: ["fat-loss", "strength"], biggestGoal: "Lose 15 lb", hurdle: "Time", success: "Feel strong",
  availableDays: ["mon", "wed"], timeOfDay: ["evening"], coachingStyle: "educator",
};
const good = { answers, consent: true };

function req(body: unknown, headers: Record<string, string> = {}) {
  return new Request(`https://${HOST}/api/intake`, {
    method: "POST",
    headers: { host: HOST, origin: `https://${HOST}`, "content-type": "application/json", "x-forwarded-for": "203.0.113.9", ...headers },
    body: JSON.stringify(body),
  });
}
function deps(over: Partial<IntakeDeps> = {}) {
  const store = createMemoryIntakeStore();
  return { store, d: { enabled: true, store, rateLimiter: createMemoryRateLimiter({ limit: 100, windowMs: 60_000 }), ...over } as IntakeDeps };
}

describe("intake schema", () => {
  it("has the five sections from the source questionnaire and unique ids", () => {
    expect(INTAKE_SECTIONS.map((s) => s.title)).toEqual([
      "Basic Information", "Health & Medical History", "Current Lifestyle & Fitness Level", "Goals & Expectations", "Training Preferences & Logistics",
    ]);
    const ids = INTAKE_SECTIONS.flatMap((s) => s.questions.map((q) => q.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("legal gate (INTAKE_ENABLED)", () => {
  it("is off unless exactly 'true'", () => {
    expect(isIntakeEnabled({} as NodeJS.ProcessEnv)).toBe(false);
    expect(isIntakeEnabled({ INTAKE_ENABLED: "TRUE" } as unknown as NodeJS.ProcessEnv)).toBe(false);
    expect(isIntakeEnabled({ INTAKE_ENABLED: "true" } as unknown as NodeJS.ProcessEnv)).toBe(true);
  });
  it("stores and parses nothing while disabled", async () => {
    const { d, store } = deps({ enabled: false });
    const res = await handleIntakeRequest(req(good), d);
    expect(res.status).toBe(503);
    expect(store.rows).toHaveLength(0);
  });
});

describe("validation", () => {
  it("accepts a complete submission and normalizes email", () => {
    const r = parseIntakePayload(good);
    expect(r.ok && !r.honeypot && r.data.email).toBe("jane@example.com");
  });
  it("requires consent", () => {
    const r = parseIntakePayload({ answers, consent: false });
    expect(!r.ok && r.errors.consent).toBeTruthy();
  });
  it("requires PAR-Q answers and rejects bad options", () => {
    const { parqHeart: _p, ...rest } = answers;
    let r = parseIntakePayload({ answers: rest, consent: true });
    expect(!r.ok && r.errors.parqHeart).toBeTruthy();
    r = parseIntakePayload({ answers: { ...answers, sleep: "12" }, consent: true });
    expect(!r.ok && r.errors.sleep).toBeTruthy();
  });
  it("caps goals at 3 and rejects unknown goals", () => {
    let r = parseIntakePayload({ answers: { ...answers, goals: ["fat-loss", "muscle", "strength", "cardio"] }, consent: true });
    expect(!r.ok && r.errors.goals).toBeTruthy();
    r = parseIntakePayload({ answers: { ...answers, goals: ["hax"] }, consent: true });
    expect(!r.ok && r.errors.goals).toBeTruthy();
  });
  it("rejects out-of-range scale, bad email/phone, over-long text", () => {
    for (const bad of [{ stress: "6" }, { email: "nope" }, { phone: "abc" }, { nutrition: "x".repeat(2001) }]) {
      expect(parseIntakePayload({ answers: { ...answers, ...bad }, consent: true }).ok).toBe(false);
    }
  });
  it("drops unknown keys instead of storing them", () => {
    const r = parseIntakePayload({ answers: { ...answers, evil: "x" }, consent: true });
    expect(r.ok && !r.honeypot && "evil" in r.data.answers).toBe(false);
  });
  it("treats a filled honeypot as silent success", () => {
    expect(parseIntakePayload({ ...good, website: "spam" })).toEqual({ ok: true, honeypot: true });
  });
});

describe("handler", () => {
  it("stores a valid submission", async () => {
    const { d, store } = deps();
    const res = await handleIntakeRequest(req(good), d);
    expect(res.status).toBe(200);
    expect(store.rows).toHaveLength(1);
    expect(store.rows[0].fullName).toBe("Jane Doe");
  });
  it("rejects cross-origin, non-JSON, invalid and honeypot without storing", async () => {
    const { d, store } = deps();
    expect((await handleIntakeRequest(req(good, { origin: "https://evil.example" }), d)).status).toBe(403);
    expect((await handleIntakeRequest(req(good, { "content-type": "text/plain" }), d)).status).toBe(415);
    expect((await handleIntakeRequest(req({ answers: {}, consent: true }), d)).status).toBe(422);
    expect((await handleIntakeRequest(req({ ...good, website: "x" }), d)).status).toBe(200);
    expect(store.rows).toHaveLength(0);
  });
  it("rate limits", async () => {
    const { d } = deps({ rateLimiter: createMemoryRateLimiter({ limit: 1, windowMs: 60_000 }) });
    await handleIntakeRequest(req(good), d);
    expect((await handleIntakeRequest(req(good), d)).status).toBe(429);
  });
  it("returns 500 without leaking payload when the store fails", async () => {
    const { d } = deps({ store: { insert: async () => { throw new Error("boom jane@example.com"); } } });
    const res = await handleIntakeRequest(req(good), d);
    expect(res.status).toBe(500);
    expect(JSON.stringify(await res.json())).not.toContain("jane");
  });
});
