import { FastifyInstance } from "fastify";

export function tokenBeautify(token: string) {
  return token
    .split("")
    .map((s, index) => (index % 4 === 0 && index != 0 ? "-" + s : s))
    .join("")
    .toUpperCase();
}

export function tokenUnBeautify(token: string) {
  return token.replace(/-/g, "").toLowerCase();
}

export function handleError(err: unknown, instance: FastifyInstance): unknown {
  instance.log.error(err);
  if (err instanceof Error) {
    if (err.name === "ZodError") {
      return instance.httpErrors.imateapot();
    } else {
      return instance.httpErrors.badRequest(err.message);
    }
  }
}
