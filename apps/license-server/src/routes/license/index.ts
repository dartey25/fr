import { FastifyPluginAsync, FastifyRequest } from "fastify";
import { generateToken } from "../../crypto/index.js";
import {
  TGenerateToken,
  TValidate,
  generateTokenSchema,
  validateSchema,
} from "../../schema/index.js";
import {
  handleError,
  tokenBeautify,
  tokenUnBeautify,
} from "../../util/index.js";

const license: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.route({
    method: "POST",
    url: "/generate",
    constraints: { host: /localhost:.+|mdoffice.com.ua:?.*/ },
    handler: async (
      request: FastifyRequest<{
        Body: TGenerateToken;
      }>,
      reply,
    ) => {
      fastify.log.info(request.hostname);
      const [err, token] = await fastify.to(
        Promise.resolve(generateToken(generateTokenSchema.parse(request.body))),
      );

      if (err) {
        fastify.log.error(err);
        return fastify.httpErrors.internalServerError();
      }

      return reply.status(200).send({ token: tokenBeautify(token) });
    },
  });

  fastify.post(
    "/validate",
    async (
      request: FastifyRequest<{
        Body: TValidate;
      }>,
      reply,
    ) => {
      try {
        const data = validateSchema.parse(request.body);
        let sql;
        let binds;
        if (data.userId) {
          sql = `select id, user_id, expires_at
          from WEB_EXTENDED_LICENSE t
         where user_id = :userId
           and UPPER(t.license_token) like UPPER(:token) and t.activated = 1 
           and nvl(t.expires_at, SYSDATE + 1) > sysdate 
           and t.deleted_at is null 
           and t.hardware_id = :hardwareId`;
          binds = {
            userId: data.userId,
            token: tokenUnBeautify(data.token),
            hardwareId: data.hwid,
          };
        } else {
          sql = `select id, user_id, expires_at
          from WEB_EXTENDED_LICENSE t
         where exists (select id
                  from sfrm_enter
                 where u_email like :email
                   and u_pass like :password)
           and UPPER(t.license_token) like UPPER(:token) and t.deleted_at is null`;
          binds = {
            email: data.email,
            password: data.password,
            token: tokenUnBeautify(data.token),
          };
        }
        fastify.log.info({
          email: data.email,
          password: data.password,
          token: tokenUnBeautify(data.token),
        });
        const result = await fastify.oracle.execute(sql, binds, {
          maxRows: 1,
        });

        fastify.log.info(sql, result);

        try {
          if (result.rows?.length) {
            const id = result.rows[0][0];
            const userId = result.rows[0][1];
            const expiresAt = result.rows[0][2];

            if (!id) {
              throw new Error();
            }

            if (!data.userId) {
              await fastify.oracle.execute(
                `update WEB_EXTENDED_LICENSE t set t.activated = 1, t.hardware_id = :hardwareId where id = :id`,
                {
                  id,
                  hardwareId: data.hwid,
                },
                {
                  autoCommit: true,
                },
              );
            }

            if (userId) {
              const result = await fastify.oracle.execute(
                `select u_fio, u_email from sfrm_enter where id = :id`,
                {
                  id: userId,
                },
              );

              if (result.rows && result.rows.length) {
                return reply.status(200).send({
                  valid: true,
                  user: {
                    id: userId,
                    username: result.rows[0][0],
                    email: result.rows[0][1],
                  },
                  expiresAt: expiresAt,
                });
              } else {
                return reply.status(200).send({
                  valid: true,
                  user: { id: userId },
                  expiresAt: expiresAt,
                });
              }
            }
          } else {
            throw new Error();
          }
        } catch {
          return reply.status(200).send({ valid: false });
        }
      } catch (err) {
        return handleError(err, fastify);
      }
    },
  );
};

export default license;
