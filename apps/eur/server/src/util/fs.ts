import {
  readFileSync,
  promises as fsPromises,
  Dirent,
  mkdirSync,
  existsSync,
} from "fs";
import { DatabaseConfigPath } from "./constants";
import path from "path";

export function getConnectionUrl() {
  if (process.env.NODE_ENV === "dev") {
    return process.env.DB_CONNECTION_URL;
  }
  return JSON.parse(readFileSync(DatabaseConfigPath).toString()).connectionUrl;
}

export function getDatabaseName() {
  if (process.env.NODE_ENV === "dev") {
    return process.env.DB_PROVIDER;
  }
  const config = JSON.parse(readFileSync(DatabaseConfigPath).toString());
  return config.database ?? config.provider;
}

export async function getLatestFile(
  directoryPath: string,
): Promise<string | null> {
  try {
    // Read the contents of the directory
    const dirents: Dirent[] = await fsPromises.readdir(directoryPath, {
      withFileTypes: true,
    });

    // Initialize variables to keep track of the latest file and its creation time
    let latestFile: string | null = null;
    let latestFileBirthtime: number = 0;

    // Loop through the files
    for (const dirent of dirents) {
      const filePath = path.join(directoryPath, dirent.name);

      // Get file stats to access creation time
      const stats = await fsPromises.stat(filePath);

      // Check if the file was created later than the current latest file
      if (stats.birthtimeMs > latestFileBirthtime) {
        latestFile = dirent.name;
        latestFileBirthtime = stats.birthtimeMs;
      }
    }

    return latestFile;
  } catch (error) {
    console.error("Error reading directory:", error);
    throw error; // Propagate the error for further handling
  }
}

export function dirExists(path: string): boolean {
  return existsSync(path);
}

export function createDirIfNotExists(path: string) {
  if (!dirExists(path)) {
    mkdirSync(path, { recursive: true });
  }
  return path;
}
