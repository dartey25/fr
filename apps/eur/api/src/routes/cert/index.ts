import prisma from "@/prisma/eur";
import { TFormSchema, formSchema } from "@/schema/eur";
import { FastifyPluginAsync, FastifyRequest } from "fastify";
import {
  createCertificate,
  deleteCertificate,
  getAll,
  getCertificate,
  getCertificateHistory,
  getFullCertificate,
  logAction,
  updateCertificate,
} from "./cert.model";
import { makeIMFX } from "../../util/imfx";
import { PDFType, makePdf } from "./pdf";
import { makeFileName } from "../../util";

interface IListQuery {
  page?: string;
  limit?: string;
}

const cert: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  /*Get all (paginated)*/
  fastify.get<{ Querystring: IListQuery }>(
    "/",
    async function ({ query: { limit = "10", page = "0" } }, reply) {
      const [err, certificates] = await fastify.to(
        getAll(parseInt(page), parseInt(limit)),
      );
      if (err) {
        fastify.log.error(err);
        return fastify.httpErrors.notFound(
          "Помилка отримання сертифікатів! Перевірте базу",
        );
      }
      const [countErr, count] = await fastify.to(
        prisma.client.certificate.count(),
      );
      if (countErr) {
        fastify.log.error(countErr);
        return fastify.httpErrors.notFound(
          "Помилка отримання сертифікатів! Перевірте базу",
        );
      }
      return reply.code(200).send({
        data: certificates.map((cert) => {
          return {
            ...cert,
            status: cert.history.some(
              (item) => item.action === "pdf" || item.action === "imfx",
            )
              ? "print"
              : undefined,
            goodsStr: cert.goods?.length && `1. ${cert.goods[0].name}`,
          };
        }),
        pageCount: Math.round(count / parseInt(limit)),
        total: count,
      });
    },
  );

  /*Get one*/
  fastify.get<{ Params: { certId: string } }>(
    "/:certId",
    async function ({ params: { certId } }, _) {
      const [err, certificate] = await fastify.to(getFullCertificate(certId));
      if (err) {
        fastify.log.error(err);
        return fastify.httpErrors.notFound(
          "Сертифікат с таким індентифікатором не знайдено",
        );
      }
      return certificate;
    },
  );

  /*Create one*/
  fastify.post(
    "/",
    async function (request: FastifyRequest<{ Body: string }>, reply) {
      const [err, data] = await fastify.to(
        (async () => formSchema.parse(request.body))(),
      );

      if (err) {
        fastify.log.error(err);
        return reply.badRequest("Невірний формат даних. " + err.message);
      }

      const [createErr, cert] = await fastify.to(createCertificate(data));
      if (createErr || !cert) {
        fastify.log.error(createErr);
        return fastify.httpErrors.badRequest("Помилка збереження сертифікату");
      }

      return reply.code(201).send(cert.id);
    },
  );

  /*Update one*/
  fastify.patch(
    "/:certId",
    async function (
      {
        body,
        params: { certId },
      }: FastifyRequest<{
        Body: TFormSchema;
        Params: { certId: string };
      }>,
      reply,
    ) {
      const [err, data] = await fastify.to(
        (async () => formSchema.parse(body))(),
      );

      if (err) {
        fastify.log.error(err);
        return reply.badRequest("Невірний формат даних. " + err.message);
      }

      const [updateErr, cert] = await fastify.to(
        updateCertificate(certId, data),
      );

      if (updateErr) {
        fastify.log.error(updateErr);
        return fastify.httpErrors.badRequest("Помилка збереження сертифікату");
      }

      return reply.code(202).send(cert);
    },
  );

  /*Get history*/
  fastify.get("/history", async (_, reply) => {
    const [err, history] = await fastify.to(getCertificateHistory());
    if (err) {
      fastify.log.error(err);
      reply.badRequest();
    }

    return reply.send(history).code(200);
  });

  /*Delete one*/
  fastify.delete<{ Params: { certId: string } }>(
    "/:certId",
    async ({ params: { certId } }, reply) => {
      const [err] = await fastify.to(deleteCertificate(certId));
      if (err) {
        fastify.log.error(err);
        return fastify.httpErrors.badRequest("Помилка видалення сертифікату");
      }
      return reply.code(200).send("OK");
    },
  );

  /* IMFX */
  fastify.get<{ Params: { certId: string } }>(
    "/imfx/:certId",
    async ({ params: { certId } }, reply) => {
      const [err, file] = await fastify.to(
        (async () => {
          const certificate = await getCertificate(certId);
          return makeIMFX(certificate);
        })(),
      );

      if (err) {
        fastify.log.error(err);
        return fastify.httpErrors.badRequest("Помилка формування IMFX");
      }

      const [logErr] = await fastify.to(logAction(certId, "imfx"));

      if (logErr) {
        fastify.log.error(logErr);
        return fastify.httpErrors.badRequest();
      }

      const fileName = makeFileName("imfx", "eur");

      return reply
        .code(200)
        .headers({
          "Access-Control-Expose-Headers": "Content-Disposition",
          "Content-Disposition": `attachment; filename="${fileName}"`,
          "Content-Type": "application/imfx",
        })
        .send(file);
    },
  );

  /* PDF */
  fastify.get<{ Params: { certId: string; type: PDFType } }>(
    "/pdf/:certId/:type",
    async ({ params: { certId, type } }, reply) => {
      const [err, certificate] = await fastify.to(getCertificate(certId));

      if (err) {
        fastify.log.error(err);
        return fastify.httpErrors.createError(
          404,
          "Сертифікат с таким індентифікатором не знайдено",
        );
      }

      const [pdfErr, pdf] = await fastify.to(makePdf(certificate, type));

      if (pdfErr) {
        fastify.log.error(pdfErr);
        return fastify.httpErrors.badRequest("Помилка генерування pdf");
      }

      const [logErr] = await fastify.to(logAction(certificate.id, "pdf"));

      if (logErr) {
        fastify.log.error(logErr);
        return fastify.httpErrors.badRequest();
      }

      const fileName = makeFileName("pdf", "eur");

      reply
        .headers({
          "Access-Control-Expose-Headers": "Content-Disposition",
          "Content-Disposition": `attachment; filename="${fileName}"`,
          "Content-Type": "application/pdf",
        })
        .code(200)
        .send(Buffer.from(pdf));
    },
  );

  fastify.get<{ Params: { certId: string } }>(
    "/test/:certId",
    async ({ params: { certId } }, reply) => {
      const [err, file] = await fastify.to(
        (async () => {
          const certificate = await getCertificate(certId);
          return makeIMFX(certificate);
        })(),
      );

      if (err) return fastify.httpErrors.badRequest("Помилка формування IMFX");

      return reply.code(200).send({ file: file.toString("base64") });
    },
  );
};

export { cert };
