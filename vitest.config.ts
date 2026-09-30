import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./tests/setup/env.ts"],
    include: ["tests/**/*.test.ts"],
    pool: "forks",
    fileParallelism: false,
    passWithNoTests: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "coverage",
      exclude: ["tests/**", "src/server.ts", "src/interface/**"],
    },
  },
});