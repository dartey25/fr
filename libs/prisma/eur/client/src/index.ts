import { PrismaClient as _PrismaClient } from "@prisma/client/eur";
import { dbPush, generateEURSchema } from "./migrate";
import fsSync from "fs";
import path from "path";
import os from "os";
import { DataSourceProvider } from "prisma-schema-dsl-types";

const prismaFolder = path.resolve(
  os.homedir(),
  "AppData",
  "Roaming",
  "MD-Web-Extended",
  "EUR",
  "server",
  "prisma",
);
const schemaPath = path.resolve(prismaFolder, "schema.prisma");
const isProd = process.env["NODE_ENV"] !== "dev";
export class Prisma {
  private _client: _PrismaClient | undefined;
  private _connectionUrl: string | undefined;

  constructor() {}

  async initialize() {
    if (this._connectionUrl && isProd) {
      this._client = new _PrismaClient({
        datasources: {
          db: {
            url: this._connectionUrl,
          },
        },
      });
    } else {
      this._client = new _PrismaClient();
    }
  }

  async connectTo(provider: DataSourceProvider, connectionUrl: string) {
    try {
      this._connectionUrl = connectionUrl;
      const schema = await generateEURSchema(provider, connectionUrl);

      if (!fsSync.existsSync(prismaFolder) && isProd) {
        fsSync.mkdirSync(prismaFolder, {
          recursive: true,
        });
      }

      if (isProd) {
        fsSync.writeFileSync(schemaPath, schema);
        await dbPush(prismaFolder);
        this._client = new _PrismaClient({
          datasources: {
            db: {
              url: this._connectionUrl,
            },
          },
        });
      }
      return true;
    } catch (e) {
      throw e;
    }
  }

  get client(): _PrismaClient {
    if (!this._client) {
      this.initialize();
    }
    return this._client as _PrismaClient;
  }

  get connectionUrl(): string {
    return this._connectionUrl as string;
  }

  set connectionUrl(url: string) {
    this._connectionUrl = url;
  }
}

const prismaClient = new Prisma();

export default prismaClient;
export { dbPush } from "./migrate";

export {
  Prisma as _Prisma,
  Certificate,
  CertificateHistory,
  AddedDocs,
  Goods,
  UploadAttachments,
  UploadImfx,
} from "@prisma/client/eur";
