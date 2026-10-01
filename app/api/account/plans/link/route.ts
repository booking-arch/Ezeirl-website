import { handleLinkPlan } from "@/lib/account/handler";
import { accountDeps } from "@/lib/account/runtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  return handleLinkPlan(req, accountDeps());
}
