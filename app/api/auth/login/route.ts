import { handleLogin } from "@/lib/auth/handler";
import { authDeps } from "@/lib/auth/runtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  return handleLogin(req, authDeps());
}
