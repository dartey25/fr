import { FastifyPluginAsync } from "fastify";
import { TLicense, licenseSchema } from "@/schema/eur/license";
import fs from "fs";
import { LicensePath } from "../../util/constants";
import { checkLicenseFile, validateLicenseOnServer } from "./check-license-job";
import { AxiosError } from "axios";
import { getHWID } from "../../util";

const license: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post(
    "/validate",
    async function (request: { body: TLicense }, reply) {
      //TODO fix this (temporary)
      // if (process.env.NODE_ENV === "dev") {
      //   return reply.code(200).send({ valid: true, dev: true });
      // }

      try {
        let data;
        if (process.env.LICENSE_HWID && process.env.LICENSE_TOKEN) {
          data = {
            hwid: process.env.LICENSE_HWID,
            token: process.env.LICENSE_TOKEN,
          };
        }
        data = licenseSchema.parse(request.body);

        const [err, serverResponse] = await fastify.to(
          validateLicenseOnServer({
            hwid: data.license.hwid,
            token: data.license.token,
            email: data.profile.email,
            password: data.profile.password,
          }),
        );

        if (err) {
          if (err instanceof AxiosError) {
            fastify.log.error(err);
            return fastify.httpErrors.internalServerError(
              err.response?.data?.message ??
                "Помилка при перевірці на сервері MDOffice",
            );
          }
          return fastify.httpErrors.internalServerError(err.message);
        }

        if (serverResponse.valid) {
          fastify.log.info(serverResponse);

          fs.writeFileSync(
            LicensePath,
            JSON.stringify({
              license: {
                ...data.license,
                expiresAt: serverResponse.expiresAt
                  ? serverResponse.expiresAt
                  : undefined,
              },
              profile: {
                ...data.profile,
                userId: serverResponse.user.id,
              },
            }),
            "utf8",
          );
          return reply.code(200).send(serverResponse);
        }

        return fastify.httpErrors.unauthorized("Невірна ліцензія");
      } catch (e) {
        return fastify.httpErrors.internalServerError(e);
      }
    },
  );

  fastify.get("/", async function (_, reply) {
    const [err, response] = await fastify.to(checkLicenseFile());

    if (err) {
      if (err instanceof AxiosError) {
        return fastify.httpErrors.internalServerError(
          err.response.data.message,
        );
      }
      return fastify.httpErrors.internalServerError(err.message);
    }

    return reply.code(200).send(response);
  });

  fastify.get("/hwid", async function (_, reply) {
    try {
      const hwid = getHWID();
      return reply.code(200).send({ hwid });
    } catch (e) {
      return fastify.httpErrors.internalServerError("Помилка");
    }
  });
};

export { license };
