import { describe, expect, it } from "vitest";
import { isEphemeralHost } from "@/lib/runtime-env";
import { resolveAuthStore } from "@/lib/auth/store";
import { resolveIntakeStore } from "@/lib/intake/store";
import { resolvePlanStore } from "@/lib/plans/store";

describe("stores never fall back to a local SQLite file on ephemeral hosts", () => {
  const cloudRun = { NODE_ENV: "production", K_SERVICE: "ezeirl-web" } as unknown as NodeJS.ProcessEnv;
  const vercel = { NODE_ENV: "production", VERCEL: "1" } as unknown as NodeJS.ProcessEnv;
  it("detects Cloud Run / Firebase and Vercel", () => {
    expect(isEphemeralHost(cloudRun)).toBe(true);
    expect(isEphemeralHost(vercel)).toBe(true);
    expect(isEphemeralHost({ NODE_ENV: "production" } as unknown as NodeJS.ProcessEnv)).toBe(false);
  });
  it("auth, intake and plans report unavailable (null) without DATABASE_URL on Cloud Run", () => {
    expect(resolveAuthStore(cloudRun)).toBeNull();
    expect(resolveIntakeStore(cloudRun)).toBeNull();
    expect(resolvePlanStore(cloudRun)).toBeNull();
  });
});
