import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@promptcrash/sdk": path.resolve(__dirname, "../../packages/sdk/src/index.ts")
    }
  }
});
