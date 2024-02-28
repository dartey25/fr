import { FastifyPluginAsync } from "fastify";

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/ping", (_, reply) => {
    reply.send("pong");
  });
};

export default root;
