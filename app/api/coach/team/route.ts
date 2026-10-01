import { handleTeamList, handleTeamSet } from "@/lib/plans/coach";
import { coachDeps } from "@/lib/plans/runtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return handleTeamList(req, coachDeps());
}

export async function POST(req: Request) {
  return handleTeamSet(req, coachDeps());
}
