import type { Metadata } from "next";
import SavePlanToAccount from "@/components/account/SavePlanToAccount";
import PlanDocument from "@/components/plans/PlanDocument";
import { toPublicPlan } from "@/lib/plans/public";
import { resolvePlanStore } from "@/lib/plans/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TOKEN_RE = /^[A-Za-z0-9_-]{20,80}$/;

export const metadata: Metadata = {
  title: "Your plan | EZE IRL",
  description: "The fitness and nutrition plan your coach published for you.",
  robots: { index: false, follow: false },
};

export default async function PlanPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const store = resolvePlanStore();
  const plan = store && TOKEN_RE.test(token) ? await store.getByToken(token) : null;
  const view = toPublicPlan(plan);
  return (
    <>
      <PlanDocument plan={view} />
      {view.status === "published" && TOKEN_RE.test(token) ? <SavePlanToAccount token={token} /> : null}
    </>
  );
}
