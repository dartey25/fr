import path from "path";
import os from "os";

const AppDataPath = path.resolve(
  os.homedir(),
  "AppData",
  "Roaming",
  "MD-Web-Extended",
  "EUR",
  "server",
);

const ConfigPath = path.resolve(AppDataPath, "config.json");
const DatabaseConfigPath = path.resolve(AppDataPath, "database.json");
const LicensePath = path.resolve(AppDataPath, "license.json");
const CachePath = path.resolve(AppDataPath, "cache.json");

export { ConfigPath, LicensePath, AppDataPath, DatabaseConfigPath, CachePath };
