const stdio = "inherit";

const gulp = require("gulp");
const execa = require("execa");
const fsSync = require("fs");
const fs = require("fs/promises");
const path = require("path");
const { Transform } = require("stream");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;

argv.deleteMain =
  argv.deleteMain === undefined ? true : Boolean(argv.deleteMain);

const sourcesPath = "sources/eur";
const binPath = path.resolve(sourcesPath, "bin");

// gulp.task("dev", async () => {
//   // concurrently -k -p \"[{name}]\" -c \"blue.bold,yellow.bold,cyan.bold,magenta.bold\" \"npm:dev:license\" \"npm:dev:eur:server\" \"npm:dev:eur:web\" \"npm:studio:eur\"
//   await execa(
//     "npx",
//     [
//       "nx",
//       "run-many",
//       "-t",
//       "serve",
//       "-p",
//       "eur-server",
//       "eur-api",
//       "eur-web",
//       "license-server"
//     ],
//     {
//       stdio,
//     },
//   );
// });

const tagTransformStream = new Transform({
  transform(chunk, encoding, callback) {
    const taggedChunk = `[EUR API]: ${chunk.toString()}`;
    this.push(taggedChunk);
    callback();
  },
});

function runEurServer() {
  const childProcess = execa("npx", ["nx", "serve", "eur-server"], {
    stdio: ["pipe", "pipe", "inherit"],
    shell: true,
  });

  // const pinoPrettyProcess = execa("pino-pretty", [], {
  //   stdio: ["pipe", "inherit", "inherit"],
  //   shell: true,
  // });

  // childProcess.stdout.pipe(pinoPrettyProcess.stdin);

  childProcess.on("close", (code) => {
    console.log(`EUR Server Exited with code ${code}`);
  });

  childProcess.catch((err) => {
    console.error("[EUR Server]:", err);
  });

  // pinoPrettyProcess.catch((err) => {
  //   console.error("pino-pretty process error:", err);
  // });

  childProcess.stdout.on("data", (data) => {
    console.log(`[EUR Server]: ${data}`);
  });
}

function runEurApi() {
  const childProcess = execa("npx", ["nx", "serve", "eur-api"], {
    stdio: ["pipe", "pipe", "inherit"],
    shell: true,
  });

  // const pinoPrettyProcess = execa("pino-pretty", [], {
  //   stdio: ["pipe", "inherit", "inherit"],
  //   shell: true,
  // });

  // childProcess.stdout.pipe(tagTransformStream).pipe(process.stdout);

  childProcess.on("close", (code) => {
    console.log(`EUR API Exited with code ${code}`);
  });

  childProcess.catch((err) => {
    console.error("[EUR API]:", err);
  });

  // pinoPrettyProcess.catch((err) => {
  //   console.error("pino-pretty process error:", err);
  // });

  childProcess.stdout.on("data", (data) => {
    console.log(`[EUR API]: ${data}`);
  });
}

function runEurWeb() {
  execa("npx", ["nx", "serve", "eur-web"], {
    stdio,
  });
}

const bash = /bash/gi.test(process.env.SHELL);
const removeCommand = process.platform === "win32" && !bash ? "del" : "rm";
const removeDirCommand = process.platform === "win32" && !bash ? "rmdir" : "rm";
const removeCommandOpts = process.platform === "win32" && !bash ? [] : ["-rf"];
const removeDirCommandOpts =
  process.platform === "win32" && !bash ? ["/s /q"] : ["-rf"];
const apiDir = path.resolve(binPath, "api");
const apiNodeModules = path.resolve(apiDir, "node_modules");
const serverDir = path.resolve(binPath, "server");
const serverNodeModules = path.resolve(serverDir, "node_modules");
const apiOriginDir = path.resolve("apps", "eur", "api");
const serverOriginDir = path.resolve("apps", "eur", "server");
const setupScriptPath = path.resolve(binPath, "setup.bat");
const startupScriptPath = path.resolve(binPath, "server", "startup.bat");

async function bumpVersion() {
  if (!argv.patch && !argv.minor && !argv.major) {
    return;
  }

  let bumpType = "patch";

  if (argv.minor) {
    bumpType = "minor";
  }

  if (argv.major) {
    bumpType = "major";
  }

  await execa(
    "npm",
    ["version", bumpType, "-w", "eur-server", "--no-git-tag-version"],
    {
      stdio,
    },
  );
}

async function buildRelease() {
  await execa(removeDirCommand, removeDirCommandOpts.concat(["sources"]));

  await execa(
    "npx",
    [
      "nx",
      "run-many",
      "-t",
      "build",
      "-p",
      "eur-server",
      "eur-web",
      "restart-cli",
      "--parallel",
      "10",
      "--nxBail",
    ].concat(argv.skipCache ? ["--skipNxCache"] : []),
    { stdio, encoding: "utf-8" },
  );
}

async function makeReleaseSources() {
  if (!fsSync.existsSync(binPath)) {
    fsSync.mkdirSync(binPath, { recursive: true });
  }
  if (!fsSync.existsSync(apiNodeModules)) {
    fsSync.mkdirSync(apiNodeModules, { recursive: true });
  }
  if (!fsSync.existsSync(serverNodeModules)) {
    fsSync.mkdirSync(serverNodeModules, { recursive: true });
  }

  await execa("cp", ["dist/apps/eur/*", binPath, "-r"]);

  await Promise.all([
    execa("cp", [path.resolve(apiOriginDir, "package.json"), apiDir]),
    execa("cp", [path.resolve(serverOriginDir, "package.json"), serverDir]),
    execa("cp", ["dist/libs/cli/restart.exe", binPath]),
  ]);

  //   "%WD%nssm.exe" install md-web "%binD%server\\node.exe"
  // "%WD%nssm.exe" set md-web AppParameters "index.js"
  // "%WD%nssm.exe" set md-web AppThrottle %AppThrottle%
  // "%WD%nssm.exe" set md-web AppExit Default Restart
  // "%WD%nssm.exe" set md-web AppRestartDelay %AppRestartDelay%
  // "%WD%nssm.exe" start md-web

  fsSync.writeFileSync(
    setupScriptPath,
    `@echo off
set WD=%~dp0
set binD=%WD%bin\\
set AppThrottle=1500
set AppRestartDelay=0

"%binD%node_modules.exe" -e -d"%binD%server" -s
"%binD%node_modules.exe" -e -d"%binD%api" -s

"%WD%nssm.exe" install md-web-api "%binD%api\\node.exe"
"%WD%nssm.exe" set md-web-api AppParameters "index.js"
"%WD%nssm.exe" set md-web-api AppThrottle %AppThrottle%
"%WD%nssm.exe" set md-web-api AppExit Default Restart
"%WD%nssm.exe" set md-web-api AppRestartDelay %AppRestartDelay%
"%WD%nssm.exe" start md-web-api
    `,
  );

  fsSync.writeFileSync(
    startupScriptPath,
    `@echo off
  set WD=%~dp0
  set binD=%WD%bin\
  
  cd "%binD%server"
  "node.exe" index`,
  );
}

async function makeIndexFile(fileName, path) {
  return fs.writeFile(
    path,
    `'use strict';
require('bytenode');
var requireJSC = require;
requireJSC('./${fileName}.jsc');`,
  );
}

async function npmInstall(cwd) {
  return execa("npm", ["i"], {
    cwd,
  });
}

function makeNodeCopy(name, dirPath) {
  return execa("node", [
    "-e",
    `require('fs').copyFileSync(process.execPath, require('path').resolve('${dirPath}', '${name}.exe'))`,
  ]);
}

async function makeBytenode() {
  await execa("npx", [
    "bytenode",
    "-c",
    path.resolve(serverDir, "main.js"),
    path.resolve(apiDir, "main.js"),
  ]);
}

async function finishingTouches() {
  await Promise.all(
    [
      makeIndexFile("main", path.resolve(serverDir, "index.js")),
      makeIndexFile("main", path.resolve(apiDir, "index.js")),
      makeNodeCopy("node", apiDir.replace(/\\/g, "/")),
      makeNodeCopy("node", serverDir.replace(/\\/g, "/")),
      npmInstall(serverDir),
      npmInstall(apiDir),
    ].concat(
      argv.deleteMain
        ? [
            execa(
              removeCommand,
              removeCommandOpts.concat([
                path.resolve(serverDir, "main.js"),
                path.resolve(apiDir, "main.js"),
              ]),
            ),
          ]
        : [],
    ),
  );

  await Promise.all([
    execa("cp", [
      "node_modules/@prisma/*",
      path.resolve(apiNodeModules, "@prisma"),
      "-r",
    ]),
    execa("cp", [
      "node_modules/@prisma/*",
      path.resolve(serverNodeModules, "@prisma"),
      "-r",
    ]),
  ]);

  await execa(
    path.resolve(process.env.PROGRAMFILES, "WinRAR", "WinRAR.exe"),
    ["a", "../node_modules", "node_modules", "-sfx"],
    { cwd: apiDir },
  );
  await Promise.all([
    execa(removeDirCommand, removeDirCommandOpts.concat([apiNodeModules])),
    execa(removeDirCommand, removeDirCommandOpts.concat([serverNodeModules])),
  ]);
}

module.exports = {
  default: gulp.series(
    buildRelease,
    bumpVersion,
    makeReleaseSources,
    makeBytenode,
    finishingTouches,
  ),
  dev: gulp.parallel(runEurServer, runEurApi, runEurWeb),
  build: buildRelease,
  term: gulp.task("term", () => console.log(process.env)),
};
