require("esbuild").build({
  entryPoints: ["apps/eur/server/src/server.ts"],
  bundle: true,
  platform: "node",
  outfile: "dist/apps/eur/server/main.js",
  sourcemap: false,
  external: ["prisma", "@prisma", ".prisma"],
  minify: false,
  treeShaking: true,
});
