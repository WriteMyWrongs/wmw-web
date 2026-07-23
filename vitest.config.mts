import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    // Unit tests only. Async Server Components aren't supported by Vitest —
    // those are covered by manual/E2E verification. See the auth work notes.
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
