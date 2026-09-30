import { handleCoachMe } from "@/lib/plans/coach";
import { coachDeps } from "@/lib/plans/runtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return handleCoachMe(req, coachDeps());
}
