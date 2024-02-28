import * as dotenv from "dotenv";
dotenv.config();

import { fastify } from "fastify";

import closeWithGrace from "close-with-grace";
import root from "./routes/root.js";
import { fastifySensible } from "@fastify/sensible";
import { fastifyCors } from "@fastify/cors";
import { fastifyFormbody } from "@fastify/formbody";
import release from "./routes/release/index.js";
import license from "./routes/license/index.js";
import fastifyMultipart from "@fastify/multipart";
import path from "node:path";
import fastifyStatic from "@fastify/static";
import { fileURLToPath } from "url";
import fastifyOracle from "./db/index.js";
import fastifyHelmet from "@fastify/helmet";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProd = process.env.NODE_ENV !== "dev";

const app = fastify({
  logger: isProd
    ? {
        file: "./license-server-log.txt",
      }
    : true,
  disableRequestLogging: !isProd,
  caseSensitive: false,
});

app.register(fastifyHelmet);
app.register(fastifyCors);
app.register(fastifySensible);
app.register(fastifyFormbody);
app.register(fastifyMultipart);

app.register(fastifyOracle, {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  connectString: process.env.DB_CONNECTION_STRING,
});

app.register((instance, _, next) => {
  instance.register(root, { prefix: "/" });
  instance.register(license, { prefix: "/license" });
  instance.register(release, { prefix: "/release" });

  next();
});

app.register(fastifyStatic, {
  root: path.join(__dirname, "releases"),
  prefix: "/download/",
  decorateReply: false,
});

app.register(fastifyStatic, {
  root: path.join(__dirname, "md-accreditation"),
  prefix: "/",
  decorateReply: false,
});

const delay = process.env.FASTIFY_CLOSE_GRACE_DELAY ?? "500";
const port = process.env.LICENSE_SERVER_PORT ?? process.env.PORT ?? "3000";

const closeListeners = closeWithGrace(
  { delay: parseInt(delay) },
  async function ({ signal, err, manual }) {
    if (err) {
      app.log.error(err);
    }
    await app.close();
  } as closeWithGrace.CloseWithGraceAsyncCallback,
);

app.addHook("onClose", (_, done) => {
  closeListeners.uninstall();
  done();
});

app.listen({ port: parseInt(port) || 3000, host: "0.0.0.0" }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
