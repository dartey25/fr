import path from "path";
import os from "os";
import { createDirIfNotExists, dirExists } from "./fs";

const AppDataPath = createDirIfNotExists(
  path.resolve(
    os.homedir(),
    "AppData",
    "Roaming",
    "MD-Web-Extended",
    "EUR",
    "server",
  ),
);

const DBHome = () => {
  const programFilesPath = path.resolve(
    process.env.ProgramFiles,
    "PostgreSQL",
    "16",
    "bin",
  );

  if (dirExists(programFilesPath)) return programFilesPath;

  const programFiles86Path = path.resolve(
    process.env["ProgramFiles(x86)"],
    "PostgreSQL",
    "16",
    "bin",
  );

  if (dirExists(programFiles86Path)) return programFiles86Path;

  throw Error("Шлях до файлів бази даних не знайдено");
};
const BackupPath = createDirIfNotExists(path.resolve(AppDataPath, "backup"));
const ConfigPath = path.resolve(AppDataPath, "config.json");
const DatabaseConfigPath = path.resolve(AppDataPath, "database.json");
const LicensePath = path.resolve(AppDataPath, "license.json");
const CachePath = path.resolve(AppDataPath, "cache.json");

export {
  ConfigPath,
  LicensePath,
  AppDataPath,
  DatabaseConfigPath,
  CachePath,
  BackupPath,
  DBHome,
};
