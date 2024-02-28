import cors from "@fastify/cors";

import fp from "fastify-plugin";

/**
 * This plugins adds support for serving static files
 *
 * @see https://github.com/fastify/fastify-static
 */

export default fp(async (fastify) => {
  fastify.register(cors);
});
