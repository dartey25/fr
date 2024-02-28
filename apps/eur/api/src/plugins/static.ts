import * as path from "node:path";
import { fastifyStatic } from "@fastify/static";

import fp from "fastify-plugin";

/**
 * This plugins adds support for serving static files
 *
 * @see https://github.com/fastify/fastify-static
 */

const assetsPath =
  process.env.NODE_ENV === "production" ? "../client" : "../../web/dist";

// const assetsPath = "../client"

export default fp(async (fastify) => {
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, assetsPath),
    prefix: "/",
  });
});
