import { defineConfig } from "tsup";

export default defineConfig({
  entry: { boobook: "src/index.ts" },
  format: ["esm"],
  target: "node18",
  clean: true,
  splitting: false,
  shims: false,
  banner: { js: "#!/usr/bin/env node" },
  outDir: "dist",
});
