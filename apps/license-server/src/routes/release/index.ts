import { FastifyPluginAsync } from "fastify";
import util from "util";
import fs from "fs";
import { pipeline } from "node:stream";

const pump = util.promisify(pipeline);

const release: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post("/upload", async function (req, reply) {
    const parts = req.files();

    for await (const part of parts) {
      // upload and save the file
      await pump(
        part.file,
        fs.createWriteStream(`./releases/${part.filename}`)
      );
    }

    return { message: "files uploaded" };
  });
};

export default release;
