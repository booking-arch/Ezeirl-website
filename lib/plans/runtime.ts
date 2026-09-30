import { authDeps } from "@/lib/auth/runtime";
import { coachEmailList, type CoachDeps } from "./coach";
import { resolvePlanStore } from "./store";

export function coachDeps(): CoachDeps {
  const auth = authDeps();
  return {
    plans: resolvePlanStore(),
    coachEmails: coachEmailList(),
    findSession: async (token) => auth.store?.findSession(token) ?? null,
  };
}
