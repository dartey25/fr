import { FastifyPluginAsync } from "fastify";
import fs from "fs";
import { BackupPath, DatabaseConfigPath } from "../../util/constants";
import { TDatabaseSchema } from "@/schema/eur/database";

const settings: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get("/database", async function (_, reply) {
    if (process.env.NODE_ENV === "dev") {
      return reply.code(200).send({
        database: {
          provider: process.env.PROVIDER,
          connectionUrl: process.env.DEV_CONNECTION_URL,
          backUpPath: BackupPath,
        } as TDatabaseSchema,
      });
    }
    try {
      if (!fs.existsSync(DatabaseConfigPath)) {
        return reply.notFound("Файл конфігурації не знайдено");
      }

      const dbConfig = JSON.parse(fs.readFileSync(DatabaseConfigPath, "utf8"));

      return reply.code(200).send({
        database: dbConfig,
      });
    } catch (e) {
      fastify.log.error(e);
      return reply.internalServerError("Помилка читання файлу конфігурації");
    }
  });
};

export { settings };
