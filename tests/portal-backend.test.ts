import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { handleLinkPlan, handleMyPlans } from "@/lib/account/handler";
import { newAccountId, createMemoryAuthStore, createSqliteAuthStore, type AuthStore } from "@/lib/auth/store";
import { handleIntakeRequest } from "@/lib/intake/handler";
import { createMemoryIntakeStore } from "@/lib/intake/store";
import { handleCoachMe, handleCoachSave, handleTeamList, handleTeamSet, staffRole, type CoachDeps } from "@/lib/plans/coach";
import { createMemoryPlanStore, createSqlitePlanStore, type PlanStore } from "@/lib/plans/store";
import type { IntakeSubmission } from "@/lib/intake/validate";
import { createMemoryRateLimiter } from "@/lib/waitlist/rate-limit";

const tmp = () => mkdtempSync(path.join(tmpdir(), "eze-portal-"));

const submission = (email: string): IntakeSubmission => ({
  service: "personal-training",
  email,
  fullName: "Jane Doe",
  answers: {
    fullName: "Jane Doe", email, phone: "+1 (555) 010-1234", ageDob: "34", occupation: "Nurse",
    parqHeart: "no", parqChestPain: "no", parqDizzy: "no", injuries: "None", medications: "None", pregnancy: "na",
    exerciseDays: "1-2", pastActivity: "Running", stress: "3", sleep: "5-6", nutrition: "Okay",
    goals: ["fat-loss"], biggestGoal: "Lose 15 lb", hurdle: "Time", success: "Feel strong",
    availableDays: ["mon"], timeOfDay: ["evening"], coachingStyle: "educator",
  },
});

async function addAccount(store: AuthStore, email: string) {
  const id = newAccountId();
  await store.createAccount({ id, emailNormalized: email, emailDisplay: email, passwordHash: "x".repeat(40), consentVersion: "v1" });
  const token = await store.createSession(id, new Date(Date.now() + 60_000));
  return { id, token };
}

const authStores: [string, () => AuthStore][] = [
  ["memory", () => createMemoryAuthStore()],
  ["sqlite", () => createSqliteAuthStore(path.join(tmp(), "accounts.sqlite"))],
];
const planStores: [string, () => PlanStore][] = [
  ["memory", () => createMemoryPlanStore()],
  ["sqlite", () => createSqlitePlanStore(path.join(tmp(), "plans.sqlite"))],
];

describe.each(authStores)("auth store roles (%s)", (_name, make) => {
  it("sessions carry the account id and default every account to client", async () => {
    const store = make();
    const { id, token } = await addAccount(store, "client@example.com");
    const session = await store.findSession(token);
    expect(session).toMatchObject({ accountId: id, emailNormalized: "client@example.com", role: "client" });
  });

  it("setRole grants and revokes coach access, and listStaff shows only staff", async () => {
    const store = make();
    const { token } = await addAccount(store, "coach@example.com");
    await addAccount(store, "plain@example.com");
    expect(await store.setRole("coach@example.com", "coach")).toBe(true);
    expect((await store.findSession(token))?.role).toBe("coach");
    expect((await store.listStaff()).map((s) => s.emailNormalized)).toEqual(["coach@example.com"]);
    expect(await store.setRole("coach@example.com", "client")).toBe(true);
    expect(await store.listStaff()).toEqual([]);
  });

  it("setRole reports false for an unknown account", async () => {
    expect(await make().setRole("nobody@example.com", "coach")).toBe(false);
  });
});

describe.each(planStores)("plan store account linking (%s)", (_name, make) => {
  const ACCOUNT_A = "11111111-1111-4111-8111-111111111111";
  const ACCOUNT_B = "22222222-2222-4222-8222-222222222222";

  it("links a new plan to the submitting account and lists only that account's plans", async () => {
    const plans = make();
    const mine = await plans.ensureDraft(submission("a@example.com"), "sub-a", ACCOUNT_A);
    await plans.ensureDraft(submission("b@example.com"), "sub-b", ACCOUNT_B);
    await plans.ensureDraft(submission("anon@example.com"), "sub-anon");
    expect(mine.accountId).toBe(ACCOUNT_A);
    const listed = await plans.listByAccount(ACCOUNT_A);
    expect(listed).toHaveLength(1);
    expect(listed[0]).toMatchObject({ viewToken: mine.viewToken, status: "draft", service: "personal-training" });
    // A client's list never carries plan content or other people's data.
    expect(Object.keys(listed[0]).sort()).toEqual(["createdAt", "publishedAt", "service", "status", "viewToken"]);
  });

  it("never re-links an existing plan through ensureDraft (resubmitting cannot steal a plan)", async () => {
    const plans = make();
    await plans.ensureDraft(submission("a@example.com"), "sub-1", ACCOUNT_A);
    const again = await plans.ensureDraft(submission("a@example.com"), "sub-1", ACCOUNT_B);
    expect(again.accountId).toBe(ACCOUNT_A);
    expect(await plans.listByAccount(ACCOUNT_B)).toEqual([]);
  });

  it("linkToAccount: first claim wins, repeat is a no-op, others are refused, unknown token is missing", async () => {
    const plans = make();
    const plan = await plans.ensureDraft(submission("anon@example.com"), "sub-anon");
    expect(await plans.linkToAccount("not-a-real-token", ACCOUNT_A)).toBe("missing");
    expect(await plans.linkToAccount(plan.viewToken, ACCOUNT_A)).toBe("linked");
    expect(await plans.linkToAccount(plan.viewToken, ACCOUNT_A)).toBe("already");
    expect(await plans.linkToAccount(plan.viewToken, ACCOUNT_B)).toBe("taken");
    expect((await plans.listByAccount(ACCOUNT_A)).map((p) => p.viewToken)).toEqual([plan.viewToken]);
    expect(await plans.listByAccount(ACCOUNT_B)).toEqual([]);
  });

  it("the coach list shows whether a plan is saved to an account", async () => {
    const plans = make();
    const plan = await plans.ensureDraft(submission("a@example.com"), "sub-a");
    await plans.linkToAccount(plan.viewToken, ACCOUNT_A);
    const summary = (await plans.list()).find((p) => p.id === plan.id);
    expect(summary?.linked).toBe(true);
  });
});

describe("coach access by database role", () => {
  const BOOT = "owner@ezeirl.com";
  const people: Record<string, { accountId: string; email: string; role: "client" | "coach" | "admin" }> = {
    "owner-token": { accountId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", email: BOOT, role: "client" }, // env-listed: admin even with role client
    "coach-token": { accountId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb", email: "trainer@example.com", role: "coach" },
    "client-token": { accountId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc", email: "client@example.com", role: "client" },
  };
  const calls: [string, string][] = [];
  const auth = {
    async setRole(email: string, role: "client" | "coach" | "admin") { calls.push([email, role]); return email !== "nobody@example.com"; },
    async listStaff() { return [{ emailDisplay: "Trainer@example.com", emailNormalized: "trainer@example.com", role: "coach" as const }]; },
  };
  const deps = (): CoachDeps => ({
    plans: createMemoryPlanStore(),
    coachEmails: [BOOT],
    auth,
    findSession: async (token) => {
      const p = people[token];
      return p ? { accountId: p.accountId, emailDisplay: p.email, emailNormalized: p.email, role: p.role } : null;
    },
  });
  const req = (url: string, token: string, body?: unknown, method = body ? "POST" : "GET") =>
    new Request(url, { method, headers: { origin: "http://ezeirl.test", host: "ezeirl.test", cookie: `eze_session=${token}`, ...(body ? { "content-type": "application/json" } : {}) }, body: body ? JSON.stringify(body) : undefined });

  afterEach(() => { calls.length = 0; vi.restoreAllMocks(); });

  it("staffRole: env emails are admins, otherwise the database role decides", () => {
    expect(staffRole({ emailNormalized: BOOT, role: "client" }, [BOOT])).toBe("admin");
    expect(staffRole({ emailNormalized: "t@example.com", role: "coach" }, [BOOT])).toBe("coach");
    expect(staffRole({ emailNormalized: "c@example.com", role: "client" }, [BOOT])).toBe("client");
  });

  it("opens the coach desk for a coach role and an owner, never for a client", async () => {
    expect((await handleCoachMe(req("http://ezeirl.test/api/coach/me", "coach-token"), deps())).status).toBe(200);
    expect(await (await handleCoachMe(req("http://ezeirl.test/api/coach/me", "owner-token"), deps())).json()).toMatchObject({ ok: true, role: "admin" });
    expect((await handleCoachMe(req("http://ezeirl.test/api/coach/me", "client-token"), deps())).status).toBe(403);
    expect((await handleCoachMe(req("http://ezeirl.test/api/coach/me", "nope"), deps())).status).toBe(401);
  });

  it("team list is admin-only", async () => {
    expect((await handleTeamList(req("http://ezeirl.test/api/coach/team", "coach-token"), deps())).status).toBe(403);
    expect((await handleTeamList(req("http://ezeirl.test/api/coach/team", "client-token"), deps())).status).toBe(403);
    const ok = await handleTeamList(req("http://ezeirl.test/api/coach/team", "owner-token"), deps());
    expect(ok.status).toBe(200);
    const { staff } = (await ok.json()) as { staff: { email: string; role: string; fixed: boolean }[] };
    expect(staff).toContainEqual({ email: "Trainer@example.com", role: "coach", fixed: false });
    expect(staff).toContainEqual({ email: BOOT, role: "admin", fixed: true });
  });

  it("only an admin can grant coach access; a coach cannot promote anyone", async () => {
    const body = { email: "New.Trainer@Example.com", role: "coach" };
    expect((await handleTeamSet(req("http://ezeirl.test/api/coach/team", "coach-token", body), deps())).status).toBe(403);
    expect((await handleTeamSet(req("http://ezeirl.test/api/coach/team", "client-token", body), deps())).status).toBe(403);
    expect(calls).toEqual([]);
    expect((await handleTeamSet(req("http://ezeirl.test/api/coach/team", "owner-token", body), deps())).status).toBe(200);
    expect(calls).toEqual([["new.trainer@example.com", "coach"]]); // normalized
  });

  it("refuses admin escalation, owner-account changes, bad input, cross-origin posts and unknown accounts", async () => {
    const post = (b: unknown) => handleTeamSet(req("http://ezeirl.test/api/coach/team", "owner-token", b), deps());
    expect((await post({ email: "x@example.com", role: "admin" })).status).toBe(422); // admin is never grantable from the UI
    expect((await post({ email: BOOT, role: "client" })).status).toBe(422); // cannot demote an env owner
    expect((await post({ email: "not-an-email", role: "coach" })).status).toBe(422);
    expect((await post({ email: "nobody@example.com", role: "coach" })).status).toBe(404);
    const cross = new Request("http://ezeirl.test/api/coach/team", { method: "POST", headers: { origin: "https://evil.example", host: "ezeirl.test", cookie: "eze_session=owner-token", "content-type": "application/json" }, body: JSON.stringify({ email: "x@example.com", role: "coach" }) });
    expect((await handleTeamSet(cross, deps())).status).toBe(403);
  });

  it("audits staff actions with ids only — no names, emails or plan content", async () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    const d = deps();
    const plan = await d.plans!.ensureDraft(submission("jane@example.com"), "sub-1");
    await handleCoachSave(req(`http://ezeirl.test/api/coach/plans/${plan.id}`, "coach-token", { goals: "Private goal text" }, "PUT"), d, plan.id);
    await handleTeamSet(req("http://ezeirl.test/api/coach/team", "owner-token", { email: "new@example.com", role: "coach" }), d);
    const lines = info.mock.calls.map((c) => String(c[0]));
    expect(lines.some((l) => l.includes('"event":"plan.saved"'))).toBe(true);
    expect(lines.some((l) => l.includes('"event":"team.role_set"'))).toBe(true);
    for (const l of lines) {
      expect(l).not.toMatch(/jane|example\.com|Private goal text|Doe/i);
    }
  });
});

describe("client account endpoints", () => {
  const ME = { accountId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd", emailDisplay: "me@example.com", emailNormalized: "me@example.com", role: "client" as const };
  const OTHER = { ...ME, accountId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee", emailDisplay: "other@example.com", emailNormalized: "other@example.com" };
  const make = () => {
    const plans = createMemoryPlanStore();
    return {
      plans,
      deps: {
        plans,
        rateLimiter: createMemoryRateLimiter({ limit: 3, windowMs: 60_000 }),
        findSession: async (t: string) => (t === "me" ? ME : t === "other" ? OTHER : null),
      },
    };
  };
  const get = (token?: string) => new Request("http://ezeirl.test/api/account/plans", { headers: token ? { cookie: `eze_session=${token}` } : {} });
  const link = (token: string, body: unknown, origin = "http://ezeirl.test") =>
    new Request("http://ezeirl.test/api/account/plans/link", { method: "POST", headers: { origin, host: "ezeirl.test", cookie: `eze_session=${token}`, "content-type": "application/json" }, body: JSON.stringify(body) });

  it("requires login to list plans and returns only the caller's own", async () => {
    const { plans, deps } = make();
    await plans.ensureDraft(submission("me@example.com"), "s1", ME.accountId);
    await plans.ensureDraft(submission("other@example.com"), "s2", OTHER.accountId);
    expect((await handleMyPlans(get(), deps)).status).toBe(401);
    const res = await handleMyPlans(get("me"), deps);
    const { plans: mine } = (await res.json()) as { plans: unknown[] };
    expect(res.status).toBe(200);
    expect(mine).toHaveLength(1);
    expect(res.headers.get("cache-control")).toBe("no-store");
  });

  it("saves a plan to the account by its private link, once", async () => {
    const { plans, deps } = make();
    const plan = await plans.ensureDraft(submission("anon@example.com"), "s1");
    expect(await (await handleLinkPlan(link("me", { token: plan.viewToken }), deps)).json()).toMatchObject({ ok: true, status: "linked" });
    expect(await (await handleLinkPlan(link("me", { token: plan.viewToken }), deps)).json()).toMatchObject({ ok: true, status: "already" });
    const stolen = await handleLinkPlan(link("other", { token: plan.viewToken }), deps);
    expect(stolen.status).toBe(409);
    expect(await plans.listByAccount(OTHER.accountId)).toEqual([]);
  });

  it("rejects malformed tokens without touching the store, cross-origin posts, anonymous callers and floods", async () => {
    const { plans, deps } = make();
    const spy = vi.spyOn(plans, "linkToAccount");
    expect((await handleLinkPlan(link("me", { token: "short" }), deps)).status).toBe(404);
    expect((await handleLinkPlan(link("me", { token: 123 }), deps)).status).toBe(404);
    expect(spy).not.toHaveBeenCalled();
    expect((await handleLinkPlan(link("me", { token: "x".repeat(32) }, "https://evil.example"), deps)).status).toBe(403);
    expect((await handleLinkPlan(new Request("http://ezeirl.test/api/account/plans/link", { method: "POST", headers: { origin: "http://ezeirl.test", host: "ezeirl.test", "content-type": "application/json" }, body: "{}" }), deps)).status).toBe(401);
    // limiter: 3 per window per account (two attempts above already counted)
    const results = [];
    for (let i = 0; i < 3; i++) results.push((await handleLinkPlan(link("me", { token: "y".repeat(32) }), deps)).status);
    expect(results).toContain(429);
  });
});

describe("intake links the signed-in account to the new plan", () => {
  const deps = (plans: PlanStore) => ({
    enabled: true,
    store: createMemoryIntakeStore(),
    plans,
    rateLimiter: createMemoryRateLimiter({ limit: 10, windowMs: 60_000 }),
    findSession: async (t: string) => (t === "signed-in" ? { accountId: "ffffffff-ffff-4fff-8fff-ffffffffffff", emailDisplay: "j@example.com", emailNormalized: "j@example.com", role: "client" as const } : null),
  });
  const post = (cookie?: string) => {
    const s = submission("jane@example.com");
    return new Request("http://ezeirl.test/api/intake", {
      method: "POST",
      headers: { origin: "http://ezeirl.test", host: "ezeirl.test", "content-type": "application/json", ...(cookie ? { cookie: `eze_session=${cookie}` } : {}) },
      body: JSON.stringify({ service: s.service, answers: s.answers, consent: true }),
    });
  };

  it("a signed-in submission is saved to the account; an anonymous one stays unlinked", async () => {
    const plans = createMemoryPlanStore();
    const res = await handleIntakeRequest(post("signed-in"), deps(plans));
    expect(res.status).toBe(200);
    const [listed] = await plans.list();
    expect(listed.linked).toBe(true);
    expect(await plans.listByAccount("ffffffff-ffff-4fff-8fff-ffffffffffff")).toHaveLength(1);

    const anon = createMemoryPlanStore();
    expect((await handleIntakeRequest(post(), deps(anon))).status).toBe(200);
    expect((await anon.list())[0].linked).toBe(false);
  });
});
