import * as dotenv from "dotenv";
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
dotenv.config();

import prisma from "@/prisma/eur";
import cors from "@fastify/cors";
import fastifyFormbody from "@fastify/formbody";
import fastifyProxy from "@fastify/http-proxy";
import fastifyMultipart from "@fastify/multipart";
import fastifySensible from "@fastify/sensible";
import serveStatic from "@fastify/static";
import closeWithGrace from "close-with-grace";
import scheduler from "node-schedule";
import path from "path";
import { router } from "./routes";
import { checkLicenseJob } from "./routes/license/check-license-job";

const args: string[] = process.argv.slice(2);

async function createServer(isProd = process.env.NODE_ENV != "dev") {
  const fastify = Fastify({
    logger:
      isProd && !args.indexOf("console")
        ? {
            file: "./log.txt",
          }
        : true,
    disableRequestLogging: !isProd,
    caseSensitive: false,
  });

  //Plugins
  await Promise.all([
    fastify.register(cors),
    fastify.register(fastifySensible),
    fastify.register(fastifyMultipart, { attachFieldsToBody: "keyValues" }),
    fastify.register(fastifyFormbody),
  ]);

  //api proxy
  fastify.register(fastifyProxy, {
    upstream: `http://localhost:${process.env.API_PORT ?? "8081"}`,
    prefix: "/api",
    beforeHandler: (request, reply, done) => {
      fastify.log.info(request);
      done();
    },
    contentTypesToEncode: ["application/json"],
  });

  fastify.register(fastifyProxy, {
    upstream: "https://www.mdoffice.com.ua/ua/",
    prefix: "/mdoffice",
  });

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
    reply.code(200).send("pong");
  });

  // Static content
  const assetsDir = "../web";

  fastify.register((instance, opts, next) => {
    instance.register(serveStatic, {
      root: path.join(__dirname, assetsDir),
      prefix: "/",
    });

    const handler = (request: FastifyRequest, reply: FastifyReply) =>
      reply.sendFile("index.html");

    // instance.setNotFoundHandler(handler);

    instance.register((fastify, opts, next) => {
      fastify.get("/cert", handler);
      next();
    });

    instance.register((fastify, opts, next) => {
      fastify.get("/cert/*", handler);
      next();
    });
    next();
  });

  //Check license every 2h
  const licenseJob = scheduler.scheduleJob("0 */2 * * *", async function () {
    const result = await checkLicenseJob();
    if (result && !result.valid && result.isActivated) {
      fastify.log.error("No license found");
      scheduler.gracefulShutdown();
      process.exit(1);
    }
  });

  licenseJob.invoke();

  const delay = process.env.FASTIFY_CLOSE_GRACE_DELAY ?? "500";
  const port = process.env.PORT ?? "8080";

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

  // Start listening.
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
