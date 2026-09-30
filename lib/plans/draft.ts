import { getCoachingIntake, type CoachingService } from "@/config/coaching";
import type { IntakeAnswer, IntakeSubmission } from "@/lib/intake/validate";

export interface PlanDraft {
  goals: string;
  idealOutcome: string;
  fitnessPlan: string;
  meals: string;
  schedule: string;
  coachNotes: string;
  needsReview: boolean;
}

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
const DAY_LABEL: Record<(typeof DAYS)[number], string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

function text(answers: Record<string, IntakeAnswer>, id: string): string {
  const value = answers[id];
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) return value.join(", ");
  return "";
}

function list(answers: Record<string, IntakeAnswer>, id: string): string[] {
  const value = answers[id];
  return Array.isArray(value) ? value : [];
}

function clip(value: string, max = 500): string {
  const trimmed = value.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1)}…`;
}

function blank(value: string): boolean {
  const trimmed = value.trim().toLowerCase();
  return !trimmed || trimmed === "none" || trimmed === "n/a" || trimmed === "na" || trimmed === "no";
}

function label(service: CoachingService, questionId: string, value: string): string {
  const question = getCoachingIntake(service).sections.flatMap((section) => section.questions).find((item) => item.id === questionId);
  if (question && (question.type === "radio" || question.type === "multi")) {
    return question.options.find((option) => option.value === value)?.label ?? value;
  }
  if (question?.type === "yesno") return value === "yes" ? "Yes" : value === "no" ? "No" : value;
  return value;
}

function labels(service: CoachingService, questionId: string, values: string[]): string {
  return values.map((value) => label(service, questionId, value)).join(", ");
}

export function needsReview(submission: IntakeSubmission): boolean {
  const answers = submission.answers;
  if (["parqHeart", "parqChestPain", "parqDizzy"].some((id) => answers[id] === "yes")) return true;
  if (answers.pregnancy === "yes") return true;
  if (!blank(text(answers, "injuries")) || !blank(text(answers, "medications"))) return true;
  if (!blank(text(answers, "nutritionHealth"))) return true;
  return false;
}

export function describeIntake(submission: IntakeSubmission): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = [];
  for (const question of getCoachingIntake(submission.service).sections.flatMap((section) => section.questions)) {
    const raw = submission.answers[question.id];
    if (raw == null || raw === "" || (Array.isArray(raw) && raw.length === 0)) continue;
    const value = Array.isArray(raw)
      ? raw.map((item) => label(submission.service, question.id, item)).join(", ")
      : label(submission.service, question.id, raw);
    rows.push({ label: question.label, value });
  }
  return rows;
}

function sessionShape(cautious: boolean): string {
  if (cautious) {
    return [
      "Each session stays easy until you and your coach agree it is appropriate:",
      "- 10 minutes of walking or other easy movement you already tolerate",
      "- Mobility for the areas you want to feel better",
      "- Two familiar movements, slowly, for 2 rounds of 6 to 8 reps",
      "- Stop if anything feels sharp, dizzy, or unusual, and tell your coach before the next session",
    ].join("\n");
  }
  return [
    "Each training day:",
    "- Warm up with 5 easy minutes of movement you already know",
    "- Practice a squat or hip-hinge pattern, a push, and a pull, for 3 rounds of 8 to 10 controlled reps",
    "- Stop with 2 or 3 reps still in reserve. Do not train to failure",
    "- Add a short walk at the end only when the main work still felt repeatable",
  ].join("\n");
}

function mealsShape(submission: IntakeSubmission): string {
  const answers = submission.answers;
  const lines = [
    "Use foods you already eat. A useful day looks like this:",
    "- First meal: protein plus fruit, yogurt, eggs, or another food you like",
    "- Midday meal: protein, vegetables, and a starch you already buy",
    "- Evening meal: the same structure, especially after training",
    "- One planned snack on training days, before or after the session",
    "Drink water with meals. Your coach will adjust portions with you. This is not a medical diet.",
  ];
  const preparation = text(answers, "foodPreparation");
  if (preparation === "prepared") lines.push("Keep the prepared meals and restaurant meals you already use. Change what you add, not the fact that you are not cooking every meal.");
  if (preparation === "home") lines.push("Most of these meals can be cooked at home from foods you already use.");
  if (preparation === "mix") lines.push("Keep the mix of home cooking and prepared meals you already use.");
  const preferences = text(answers, "foodPreferences");
  if (preferences) lines.push(`Foods to keep in the rotation: ${clip(preferences, 300)}`);
  const allergies = text(answers, "foodAllergies");
  if (!blank(allergies)) lines.push(`Leave out: ${clip(allergies, 300)}`);
  const logistics = text(answers, "mealLogistics");
  if (logistics) lines.push(`Fit the meals to this constraint: ${clip(logistics, 300)}`);
  return lines.join("\n");
}

function trainingSchedule(submission: IntakeSubmission, cautious: boolean): string {
  const selected = new Set(list(submission.answers, "availableDays"));
  const times = labels(submission.service, "timeOfDay", list(submission.answers, "timeOfDay"));
  const when = times || "the time you choose";
  const work = cautious ? "Easy session" : "Training";
  if (selected.size === 0) {
    return `The form did not include training days. Your coach will set the week with you. Sessions belong in ${when}.`;
  }
  const lines = DAYS.map((day) => {
    const name = DAY_LABEL[day];
    return selected.has(day) ? `${name} — ${when} — ${work}` : `${name} — Rest`;
  });
  if (selected.size >= 6) lines.push("Six or seven training days is a lot. Your coach may turn one of those days into an easy walk.");
  const sleep = text(submission.answers, "sleep");
  if (sleep === "<5" || sleep === "5-6") lines.push("Sleep is short right now, so the week does not add extra work at night.");
  if (Number(text(submission.answers, "stress")) >= 4) lines.push("Stress is high, so one rest day stays completely off training.");
  return lines.join("\n");
}

function nutritionSchedule(submission: IntakeSubmission): string {
  const days = text(submission.answers, "exerciseDays");
  const count = days === "3-4" ? 3 : days === "5+" ? 4 : 2;
  const kind = days === "0" ? "easy walks" : "movement sessions";
  return [
    `Meals stay on a repeating clock every day, including rest days.`,
    `Add ${count} ${kind} each week, on days you can repeat. Your coach will lock the exact days with you.`,
    "The other days are meals, walking, and recovery.",
    text(submission.answers, "sleep") === "<5" || text(submission.answers, "sleep") === "5-6"
      ? "Sleep is short right now, so movement stays easy until that improves."
      : "",
  ].filter(Boolean).join("\n");
}

export function draftPlan(submission: IntakeSubmission): PlanDraft {
  const answers = submission.answers;
  const name = submission.fullName.trim() || "there";
  const cautious = needsReview(submission);
  const goalValues = list(answers, submission.service === "nutrition-coaching" ? "nutritionGoals" : "goals");
  const goalId = submission.service === "nutrition-coaching" ? "nutritionGoals" : "goals";
  const aim = text(answers, submission.service === "nutrition-coaching" ? "nutritionSuccess" : "biggestGoal");
  const success = text(answers, submission.service === "nutrition-coaching" ? "nutritionSuccess" : "success") || aim;
  const hurdle = text(answers, submission.service === "nutrition-coaching" ? "nutritionHurdle" : "hurdle");
  const style = text(answers, "coachingStyle");
  const styleLine =
    style === "drill-sergeant"
      ? "Sessions will be direct, with clear targets and accountability."
      : style === "educator"
        ? "Each session includes a short explanation of why the work is there."
        : style === "cheerleader"
          ? "The tone stays encouraging, with steady accountability."
          : text(answers, "nutritionSupport") === "structure"
            ? "Check-ins stay structured, with a clear plan for the week."
            : text(answers, "nutritionSupport") === "education"
              ? "Each check-in explains the reason for the change."
              : text(answers, "nutritionSupport") === "gradual"
                ? "Changes stay small, one habit at a time."
                : "";

  const goals = [
    goalValues.length ? `Primary aims: ${labels(submission.service, goalId, goalValues)}.` : "Primary aims: your coach will confirm these with you.",
    aim ? `The main target for the next 3 to 6 months: ${clip(aim, 400)}` : "",
    hurdle ? `Plan around this obstacle: ${clip(hurdle, 300)}` : "",
    styleLine,
  ].filter(Boolean).join("\n\n");

  const idealOutcome = [
    `${name}, progress is the result you described:`,
    success ? `"${clip(success, 400)}"` : "Your coach will write the target here after talking with you.",
    "That description is the check we will use. This plan does not promise a date, a body weight, or a medical result.",
  ].join("\n");

  const known = text(answers, "pastActivity");
  const dislikes = text(answers, "dislikes");
  const fitnessPlan = [
    sessionShape(cautious),
    known ? `Start from activity you already know: ${clip(known, 240)}.` : "",
    dislikes ? `Leave these out: ${clip(dislikes, 240)}.` : "",
    "Your coach will change the movements, the days, and the effort before this is final.",
  ].filter(Boolean).join("\n\n");

  const schedule = submission.service === "nutrition-coaching" ? nutritionSchedule(submission) : trainingSchedule(submission, cautious);

  const noteLines = [
    cautious
      ? "HEALTH REVIEW: at least one answer needs your sign-off before this person trains or changes how they eat."
      : "No PAR-Q yes answer was submitted. Still read the questionnaire before you publish.",
    "The client sees a waiting page until you publish. Coach notes stay on this desk.",
    `Service: ${submission.service === "nutrition-coaching" ? "Nutrition coaching" : "Personal training"}.`,
    style ? `Coaching style requested: ${label(submission.service, "coachingStyle", style)}.` : "",
    text(answers, "exerciseDays") ? `Current exercise frequency: ${label(submission.service, "exerciseDays", text(answers, "exerciseDays"))}.` : "",
    text(answers, "pastActivity") ? `Activity they reported: ${clip(text(answers, "pastActivity"), 500)}` : "",
    text(answers, "nutrition") ? `Eating habits they described: ${clip(text(answers, "nutrition"), 500)}` : "",
    text(answers, "typicalDay") ? `Typical day they described: ${clip(text(answers, "typicalDay"), 500)}` : "",
    text(answers, "injuries") ? `Injuries: ${clip(text(answers, "injuries"), 500)}` : "",
    text(answers, "medications") ? `Medications: ${clip(text(answers, "medications"), 500)}` : "",
    text(answers, "nutritionHealth") ? `Health note: ${clip(text(answers, "nutritionHealth"), 500)}` : "",
    text(answers, "anythingElse") ? `Anything else: ${clip(text(answers, "anythingElse"), 500)}` : "",
  ].filter(Boolean);

  return {
    goals,
    idealOutcome,
    fitnessPlan,
    meals: mealsShape(submission),
    schedule,
    coachNotes: noteLines.join("\n"),
    needsReview: cautious,
  };
}
