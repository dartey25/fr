import oracledb, { ConnectionAttributes } from "oracledb";

import { FastifyInstance } from "fastify";
import { fastifyPlugin } from "fastify-plugin";

function fastifyOracle(
  fastify: FastifyInstance,
  options: ConnectionAttributes,
  done: (err?: Error) => void,
) {
  oracledb.initOracleClient({ libDir: process.env.ORACLE_CLIENT_LIB_DIR });
  oracledb.getConnection(options, async (err, connection) => {
    if (err) {
      fastify.log.error(err);
      fastify.close();
    }

    if (!fastify.oracle) {
      fastify.decorate("oracle", connection);
      await fastify.oracle.execute("SELECT SYSDATE FROM DUAL");
      fastify.log.info("Successfully connected to oracle");
      // fastify.log.info(response.rows[0]);
    }

    fastify.addHook("onClose", (_, done) => {
      connection &&
        connection
          .close()
          .then(() => fastify.log.info("Closed oracle connection"))
          .catch()
          .finally(done);
    });

    done();
  });
}

export default fastifyPlugin(fastifyOracle, { name: "fastify-oracle" });
