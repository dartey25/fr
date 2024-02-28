import { exec } from "child_process";
import { getConnectionUrl, getDatabaseName, getLatestFile } from "./fs";
import path from "path";
import { BackupPath, DBHome, DatabaseConfigPath } from "./constants";
import fs from "fs/promises";
import { TDatabaseSchema } from "@/schema/eur/database";

export async function backupDatabase() {
  let connectionUrl;
  let databaseName;
  try {
    connectionUrl = getConnectionUrl();
    databaseName = getDatabaseName();
    if (!connectionUrl) {
      throw new Error();
    }
  } catch (e) {
    throw new Error("Помилка отримання URL підключення");
  }
  try {
    const exitCode = await new Promise((resolve) => {
      exec(
        [
          `"${path.resolve(DBHome(), "pg_dump")}"`,
          `-f "${path.resolve(
            BackupPath,
            `${databaseName}_dump_${Math.floor(
              Date.now() / 1000,
            ).toString()}.sql`,
          )}"`,
          "-F c",
          `--dbname=${connectionUrl}`,
        ].join(" "),
        (error, stdout) => {
          console.log(stdout);
          if (error != null) {
            console.log(`pg_dump failed ${error.message}`);
            resolve(error.code ?? 1);
          } else {
            resolve(0);
          }
        },
      );
    });

    if (exitCode != 0) {
      if (exitCode === 2) {
        console.log(`pg_dump exited with error ${exitCode}`);
        throw new Error(`pg_dump exited with error ${exitCode}`);
      }
      throw new Error(`pg_dump failed with exit code ${exitCode}`);
    }
  } catch (e) {
    throw new Error(e);
  }
}

export async function restoreDatabase() {
  let connectionUrl;
  try {
    connectionUrl = getConnectionUrl();
    if (!connectionUrl) {
      throw new Error();
    }
  } catch (e) {
    throw new Error("Помилка отримання URL підключення");
  }

  let latestFile;
  try {
    latestFile = await getLatestFile(BackupPath);
  } catch (err) {
    throw new Error("Помилка отримання файлу резевної копії");
  }

  try {
    const exitCode = await new Promise((resolve) => {
      exec(
        [
          `"${path.resolve(DBHome(), "pg_restore")}"`,
          "--clean --no-acl --no-owner",
          `--dbname=${connectionUrl}`,
          `"${path.resolve(BackupPath, latestFile)}"`,
        ].join(" "),
        (error, stdout) => {
          console.log(stdout);
          if (error != null) {
            console.log(`pg_restore failed ${error.message}`);
            resolve(error.code ?? 1);
          } else {
            resolve(0);
          }
        },
      );
    });

    if (exitCode != 0) {
      if (exitCode === 2) {
        console.log(`pg_restore exited with error ${exitCode}`);
        throw new Error(`pg_restore exited with error ${exitCode}`);
      }
      throw new Error(`pg_restore failed with exit code ${exitCode}`);
    }
  } catch (e) {
    throw new Error(e);
  }
}

export async function writeDatabaseConfig(payload: TDatabaseSchema) {
  return fs.writeFile(DatabaseConfigPath, JSON.stringify(payload));
}
