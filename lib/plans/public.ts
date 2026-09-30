import type { CoachingService } from "@/config/coaching";

export type PlanStatus = "draft" | "published";

export interface PlanContent {
  goals: string;
  idealOutcome: string;
  fitnessPlan: string;
  meals: string;
  schedule: string;
  coachNotes: string;
}

export interface PlanRecord extends PlanContent {
  id: string;
  submissionId: string;
  viewToken: string;
  status: PlanStatus;
  service: CoachingService;
  clientName: string;
  email: string;
  needsReview: boolean;
  intake: { label: string; value: string }[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  agreementSelection: string[];
}

export interface PlanSummary {
  id: string;
  clientName: string;
  email: string;
  service: CoachingService;
  status: PlanStatus;
  needsReview: boolean;
  updatedAt: string;
  viewToken: string;
}

export type PublicPlan =
  | { status: "missing" }
  | { status: "draft"; clientName: string }
  | {
      status: "published";
      clientName: string;
      serviceLabel: string;
      goals: string;
      idealOutcome: string;
      fitnessPlan: string;
      meals: string;
      schedule: string;
    };

export function serviceLabel(service: CoachingService): string {
  return service === "nutrition-coaching" ? "Nutrition coaching" : "Personal training";
}

/** Client pages only receive this. Drafts hide the plan. Coach notes never leave the desk. */
export function toPublicPlan(plan: PlanRecord | null): PublicPlan {
  if (!plan || plan.status !== "published") {
    return plan ? { status: "draft", clientName: plan.clientName } : { status: "missing" };
  }
  return {
    status: "published",
    clientName: plan.clientName,
    serviceLabel: serviceLabel(plan.service),
    goals: plan.goals,
    idealOutcome: plan.idealOutcome,
    fitnessPlan: plan.fitnessPlan,
    meals: plan.meals,
    schedule: plan.schedule,
  };
}
