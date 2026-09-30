import { handleCoachGet, handleCoachSave } from "@/lib/plans/coach";
import { coachDeps } from "@/lib/plans/runtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Params) {
  const { id } = await params;
  return handleCoachGet(req, coachDeps(), id);
}

export async function PUT(req: Request, { params }: Params) {
  const { id } = await params;
  return handleCoachSave(req, coachDeps(), id);
}
