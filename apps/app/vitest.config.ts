import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
      "@atimar/types": fileURLToPath(
        new URL("../../packages/types/src/index.ts", import.meta.url),
      ),
      "@atimar/data": fileURLToPath(
        new URL("../../packages/data/src/index.ts", import.meta.url),
      ),
      "@atimar/api": fileURLToPath(
        new URL("../../packages/api/src/index.ts", import.meta.url),
      ),
      "@atimar/utils": fileURLToPath(
        new URL("../../packages/utils/src/index.ts", import.meta.url),
      ),
    },
  },
  test: {
    environment: "node",
  },
});
