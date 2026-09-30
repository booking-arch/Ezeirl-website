import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import CoachPage from "@/app/coach/page";
import PlanDocument from "@/components/plans/PlanDocument";
import { handleIntakeRequest } from "@/lib/intake/handler";
import { createMemoryIntakeStore } from "@/lib/intake/store";
import { handleCoachGet, handleCoachList, handleCoachSave } from "@/lib/plans/coach";
import { draftPlan } from "@/lib/plans/draft";
import { toPublicPlan } from "@/lib/plans/public";
import { createMemoryPlanStore, createSqlitePlanStore } from "@/lib/plans/store";
import { createSqliteIntakeStore } from "@/lib/intake/store";
import { createMemoryRateLimiter } from "@/lib/waitlist/rate-limit";
import type { IntakeSubmission } from "@/lib/intake/validate";

const submission: IntakeSubmission = {
  service: "personal-training",
  email: "jane@example.com",
  fullName: "Jane Doe",
  answers: {
    fullName: "Jane Doe",
    email: "jane@example.com",
    phone: "+1 (555) 010-1234",
    ageDob: "34",
    occupation: "Nurse",
    parqHeart: "no",
    parqChestPain: "no",
    parqDizzy: "no",
    injuries: "None",
    medications: "None",
    pregnancy: "na",
    exerciseDays: "1-2",
    pastActivity: "Running",
    stress: "3",
    sleep: "5-6",
    nutrition: "Okay",
    goals: ["fat-loss", "strength"],
    biggestGoal: "Lose 15 lb",
    hurdle: "Time",
    success: "Feel strong",
    availableDays: ["mon", "wed"],
    timeOfDay: ["evening"],
    coachingStyle: "educator",
  },
};

function coachDeps(plans = createMemoryPlanStore(), email = "coach@ezeirl.com") {
  return {
    plans,
    coachEmails: ["coach@ezeirl.com"],
    findSession: async (token: string) => (token === "coach-token" ? { emailDisplay: email, emailNormalized: email } : null),
  };
}

function request(url: string, method = "GET", body?: unknown, token = "coach-token") {
  return new Request(url, {
    method,
    headers: {
      origin: "http://ezeirl.test",
      host: "ezeirl.test",
      cookie: `eze_session=${token}`,
      ...(body ? { "content-type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

describe("plan drafts", () => {
  it("turns the questionnaire into an editable plan and keeps health details off the client page", () => {
    const draft = draftPlan(submission);
    expect(draft.needsReview).toBe(false);
    expect(draft.goals).toContain("Lose 15 lb");
    expect(draft.goals).toContain("Fat loss");
    expect(draft.idealOutcome).toContain("Feel strong");
    expect(draft.fitnessPlan).toContain("Running");
    expect(draft.schedule).toContain("Monday");
    expect(draft.schedule).toContain("Evening");
    expect(draft.schedule).toContain("Wednesday");
    expect(draft.schedule).toContain("Tuesday — Rest");
    expect(draft.coachNotes).toContain("Injuries");
    expect(draft.goals).not.toContain("Injuries");
    for (const field of [draft.goals, draft.idealOutcome, draft.fitnessPlan, draft.meals, draft.schedule]) {
      expect(field.toLowerCase()).not.toContain("guaranteed");
      expect(field).not.toContain("calorie");
      expect(field.toLowerCase()).not.toContain("tailscale");
    }
  });

  it("asks the coach to review a yes answer before anyone trains", () => {
    const draft = draftPlan({ ...submission, answers: { ...submission.answers, parqHeart: "yes" } });
    expect(draft.needsReview).toBe(true);
    expect(draft.fitnessPlan.toLowerCase()).toContain("until you and your coach agree");
    expect(draft.coachNotes).toContain("HEALTH REVIEW");
  });

  it("hides the plan until it is published", async () => {
    const plans = createMemoryPlanStore();
    const created = await plans.ensureDraft(submission, "submission-1");
    const again = await plans.ensureDraft(submission, "submission-1");
    expect(again.viewToken).toBe(created.viewToken);
    expect(toPublicPlan(created)).toEqual({ status: "draft", clientName: "Jane Doe" });
    const hidden = renderToStaticMarkup(<PlanDocument plan={toPublicPlan(created)} />);
    expect(hidden).toContain("being prepared");
    expect(hidden).not.toContain("Lose 15 lb");
    expect(hidden).not.toContain("Running");

    const saved = await plans.save(created.id, created, "published");
    const shown = renderToStaticMarkup(<PlanDocument plan={toPublicPlan(saved)} />);
    expect(shown).toContain("Lose 15 lb");
    expect(shown).toContain("RECOMMENDED MEALS");
    expect(shown).toContain("SCHEDULE");
    expect(shown).not.toContain("HEALTH REVIEW");
    expect(shown.toLowerCase()).not.toContain("tailscale");
    expect(shown).not.toContain("fit-mate");
  });
});

describe("coach desk access", () => {
  it("refuses other accounts and blocks publish until health answers are reviewed", async () => {
    const plans = createMemoryPlanStore();
    const flagged = await plans.ensureDraft({ ...submission, answers: { ...submission.answers, parqHeart: "yes" } }, "submission-2");
    const deps = coachDeps(plans);
    expect((await handleCoachList(request("http://ezeirl.test/api/coach/plans", "GET", undefined, "nope"), deps)).status).toBe(401);
    const stranger = coachDeps(plans, "client@ezeirl.com");
    expect((await handleCoachList(request("http://ezeirl.test/api/coach/plans"), stranger)).status).toBe(403);

    const blocked = await handleCoachSave(
      request(`http://ezeirl.test/api/coach/plans/${flagged.id}`, "PUT", { publish: true }),
      deps,
      flagged.id,
    );
    expect(blocked.status).toBe(422);
    expect(toPublicPlan(await plans.get(flagged.id))?.status).toBe("draft");

    const published = await handleCoachSave(
      request(`http://ezeirl.test/api/coach/plans/${flagged.id}`, "PUT", { publish: true, reviewed: true, goals: "Edited goal" }),
      deps,
      flagged.id,
    );
    expect(published.status).toBe(200);
    const body = await published.json();
    expect(body.plan.goals).toBe("Edited goal");
    expect(body.plan.coachNotes).toContain("HEALTH REVIEW");
    expect((await handleCoachGet(request(`http://ezeirl.test/api/coach/plans/${flagged.id}`), deps, flagged.id)).status).toBe(200);
  });

  it("saves only service-appropriate agreement choices for the selected client", async () => {
    const plans = createMemoryPlanStore();
    const personalTraining = await plans.ensureDraft(submission, "agreement-submission-1");
    const saved = await handleCoachSave(
      request(`http://ezeirl.test/api/coach/plans/${personalTraining.id}`, "PUT", {
        agreementSelection: ["personal-training-agreement", "media-release", "personal-training-agreement"],
      }),
      coachDeps(plans),
      personalTraining.id,
    );
    expect(saved.status).toBe(200);
    expect((await saved.json()).plan.agreementSelection).toEqual(["personal-training-agreement", "media-release"]);
    expect((await plans.get(personalTraining.id))?.agreementSelection).toEqual(["personal-training-agreement", "media-release"]);

    const nutrition = await plans.ensureDraft({ ...submission, service: "nutrition-coaching" }, "agreement-submission-2");
    const rejected = await handleCoachSave(
      request(`http://ezeirl.test/api/coach/plans/${nutrition.id}`, "PUT", { agreementSelection: ["location-equipment"] }),
      coachDeps(plans),
      nutrition.id,
    );
    expect(rejected.status).toBe(422);
    expect((await plans.get(nutrition.id))?.agreementSelection).toEqual([]);
  });

  it("creates a draft from a portal submission and from an older saved questionnaire", async () => {
    const plans = createMemoryPlanStore();
    const intake = createMemoryIntakeStore();
    const response = await handleIntakeRequest(
      new Request("http://ezeirl.test/api/intake", {
        method: "POST",
        headers: { origin: "http://ezeirl.test", host: "ezeirl.test", "content-type": "application/json" },
        body: JSON.stringify({ answers: submission.answers, consent: true, service: "personal-training" }),
      }),
      { enabled: true, store: intake, plans, rateLimiter: createMemoryRateLimiter({ limit: 5, windowMs: 60_000 }) },
    );
    expect(response.status).toBe(200);
    expect((await plans.list())[0]?.clientName).toBe("Jane Doe");

    const dir = mkdtempSync(path.join(tmpdir(), "eze-plans-"));
    const file = path.join(dir, "intake.sqlite");
    const savedId = await createSqliteIntakeStore(file).insert(submission);
    const disk = createSqlitePlanStore(file);
    const listed = await disk.list();
    expect(listed.map((plan) => plan.clientName)).toContain("Jane Doe");
    const opened = await disk.get(listed[0].id);
    expect(opened?.submissionId).toBe(savedId);
    expect(toPublicPlan(opened).status).toBe("draft");
    await disk.save(opened!.id, opened!, "draft", ["personal-training-agreement", "media-release"]);
    expect((await disk.get(opened!.id))?.agreementSelection).toEqual(["personal-training-agreement", "media-release"]);
  });
});

describe("coach page", () => {
  it("does not render a client plan or a private host", () => {
    const html = renderToStaticMarkup(<CoachPage />);
    expect(html).toContain("COACH DESK");
    expect(html).not.toContain("Lose 15 lb");
    expect(html.toLowerCase()).not.toContain("tailscale");
    expect(html).not.toContain("127.0.0.1");
  });
});
