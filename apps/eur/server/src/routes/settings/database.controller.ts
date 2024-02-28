import prisma from "@/prisma/eur";
import { TDatabaseSchema } from "@/schema/eur/database";
import { FastifyPluginAsync } from "fastify";

import { DataSourceProvider } from "prisma-schema-dsl-types";
import { BackupPath } from "../../util/constants";
import {
  backupDatabase,
  restoreDatabase,
  writeDatabaseConfig,
} from "../../util/database";
import { createDirIfNotExists } from "../../util/fs";

const database: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post<{
    Body: TDatabaseSchema;
  }>("/connect", async (request, response) => {
    const { connectionUrl, provider } = request.body;

    fastify.log.info("Writing config...")
    const [writeErr] = await fastify.to(
      writeDatabaseConfig({ ...request.body, backUpPath: BackupPath }),
    );
    if (writeErr) {
    fastify.log.info("Write config error...")
      return fastify.httpErrors.internalServerError(
        "Виникла помилка при збереженні підключення",
      );
    }

    fastify.log.info("Running prisma connect to...")
    const [connectErr] = await fastify.to(
      prisma.connectTo(DataSourceProvider.PostgreSQL, connectionUrl),
    );
    if (connectErr) {
      fastify.log.error(connectErr);
      return fastify.httpErrors.internalServerError(
        "Виникла помилка при спробі підключення",
      );
    }
    fastify.log.info("Prisma connect finished okay...")

    fastify.log.info("Returning...")
    return response.code(200).send({
      connected: true,
      message: "Конфігурацію бази даних успішно записано",
    });
  });

  fastify.get("/restore", async (request, reply) => {
    const [err] = await fastify.to(restoreDatabase());
    if (err) {
      return fastify.httpErrors.internalServerError(err.message);
    }

    return reply.code(200).send({ success: true });
  });

  fastify.get("/backup", async (request, reply) => {
    createDirIfNotExists(BackupPath);

    const [err] = await fastify.to(backupDatabase());
    if (err) {
      return fastify.httpErrors.internalServerError(err.message);
    }

    return reply.code(200).send({ success: true });
  });
};

export { database };
