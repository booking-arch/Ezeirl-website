import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// Node environment only: logic tests plus server-side rendering smoke tests (react-dom/server).
// No jsdom / testing-library on purpose — see DECISIONS.md.
export default defineConfig({
  oxc: { jsx: { runtime: "automatic" } },
  resolve: { alias: { "@": fileURLToPath(new URL("./", import.meta.url)) } },
  test: { environment: "node", include: ["tests/**/*.test.{ts,tsx}"] },
});
