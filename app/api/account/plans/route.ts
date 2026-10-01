import { handleMyPlans } from "@/lib/account/handler";
import { accountDeps } from "@/lib/account/runtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return handleMyPlans(req, accountDeps());
}
