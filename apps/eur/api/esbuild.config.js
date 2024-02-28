require("esbuild").build({
    entryPoints: ["apps/eur/api/src/server.ts"],
    bundle: true,
    platform: "node",
    outfile: "dist/apps/eur/api/main.js",
    sourcemap: false,
    external: ["prisma", "@prisma", ".prisma"],
    minify: false,
    treeShaking: true,
  });
  