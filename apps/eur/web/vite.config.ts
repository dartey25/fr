/// <reference types='vitest' />
import { defineConfig, searchForWorkspaceRoot } from "vite";
import react from "@vitejs/plugin-react";
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  root: __dirname,
  cacheDir: "../../../node_modules/.vite/apps/web",

  server: {
    port: 4200,
    host: "localhost",
    fs: {
      allow: [searchForWorkspaceRoot(process.cwd())],
    },
  },

  preview: {
    port: 4300,
    host: "localhost",
  },

  plugins: [react(), nxViteTsPaths(), tsconfigPaths()],

  build: {
    outDir: "../../../dist/apps/web",
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },

  test: {
    globals: true,
    cache: {
      dir: "../../../node_modules/.vitest",
    },
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx,d.ts}"],

    reporters: ["default"],
    coverage: {
      reportsDirectory: "../../../coverage/apps/web",
      provider: "v8",
    },
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
      "@/schema": path.resolve(__dirname, "../../../libs/shared/schema/src"),
      "@/ui": path.resolve(__dirname, "../../../libs/shared/ui/src/core"),
    },
  },

  define: {
    "import.meta.env.DB_PROVIDER": JSON.stringify(process.env.DB_PROVIDER),
  },
});
