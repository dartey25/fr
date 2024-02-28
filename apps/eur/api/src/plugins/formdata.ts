import multipart from "@fastify/multipart";

import fp from "fastify-plugin";

/**
 * This plugins adds support for serving static files
 *
 * @see https://github.com/fastify/fastify-static
 */

export default fp(async (fastify) => {
  fastify.register(multipart);
  fastify.register(require("@fastify/formbody"));
});
