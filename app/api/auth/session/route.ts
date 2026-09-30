import { handleSession } from "@/lib/auth/handler";
import { authDeps } from "@/lib/auth/runtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return handleSession(req, authDeps());
}
