import * as dotenv from "dotenv";
dotenv.config();

import Fastify from "fastify";

import closeWithGrace from "close-with-grace";
import fastifySensible from "@fastify/sensible";
import fastifyMultipart from "@fastify/multipart";
import fastifyFormbody from "@fastify/formbody";
import { router } from "./routes";
import cors from "@fastify/cors";
import scheduler from "node-schedule";
import prisma from "@/prisma/eur";

async function createServer(isProd = process.env.NODE_ENV != "dev") {
  const fastify = Fastify({
    logger: isProd
      ? {
          file: "./log.txt",
        }
      : true,
    disableRequestLogging: !isProd,
    caseSensitive: false,
  });

  await Promise.all([
    fastify.register(cors),
    fastify.register(fastifySensible),
    fastify.register(fastifyMultipart, { attachFieldsToBody: "keyValues" }),
    fastify.register(fastifyFormbody),
  ]);

  fastify.register((instance, opts, next) => {
    Object.values(router).forEach((route) => {
      if (route.name !== "root") {
        instance.register(route, { prefix: route.name.toLowerCase() });
      } else {
        instance.register(route, { prefix: "/" });
      }
    });
    next();
  });

  fastify.get("/ping", (request, reply) => {
    reply.code(200).send("pong api");
  });

  const delay = process.env.FASTIFY_CLOSE_GRACE_DELAY ?? "500";
  const port = process.env.PORT ?? "8081";

  // delay is the number of milliseconds for the graceful close to finish
  const closeListeners = closeWithGrace(
    { delay: parseInt(delay) },
    async function ({ signal, err, manual }) {
      if (err) {
        fastify.log.error(err);
      }
      await fastify.close();
    } as closeWithGrace.CloseWithGraceAsyncCallback,
  );

  fastify.addHook("onClose", (_, done) => {
    closeListeners.uninstall();
    done();
  });

  await fastify.listen({ port: parseInt(port) }, (err: any) => {
    if (err) {
      fastify.log.error(err);
      scheduler.gracefulShutdown();
      process.exit(1);
    }
  });
}

createServer()
  .then(async () => {
    await prisma.client.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.client.$disconnect();
    process.exit(1);
  });
