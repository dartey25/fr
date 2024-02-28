import { TEndpointSendBody, TEnvelopeData } from "@/shared-types";
import axios from "axios";
import { FastifyPluginAsync } from "fastify";
import { encrypt } from "../../util/crypto";
import { buildUploadImfx, makeXmls, parseXml } from "../../util/imfx";
import { UploadModel } from "../upload/upload.model";

const endpoint: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get("/", async (request, response) => {
    const [err, endpointList] = await fastify.to(
      axios
        .get("https://www.mdoffice.com.ua/eur1.cert.api_endpoint_list")
        .then((r) => r.data),
    );
    if (err) {
      return fastify.httpErrors.internalServerError();
    }

    return response.code(200).send(endpointList);
  });

  fastify.post<{ Body: TEndpointSendBody }>(
    "/send",
    async (request, response) => {
      const { id, packageId, recipient, senderEmail, senderName } =
        request.body;

      const envelopeData: TEnvelopeData = {
        messageId: packageId,
        sender: senderEmail,
        receiver: recipient,
        comment: senderName,
        docList: {
          protMethod: 1,
        },
      };

      const [err, packageFiles] = await fastify.to(UploadModel.get(packageId));
      if (err) {
        return fastify.httpErrors.internalServerError("Пакет не знайдено");
      }

      const [buildErr, imfx] = await fastify.to(
        buildUploadImfx(envelopeData, {
          ...packageFiles,
          attachments: undefined,
        }),
      );
      if (buildErr) {
        fastify.log.error(buildErr);
        return fastify.httpErrors.internalServerError();
      }

      const [saveErr] = await fastify.to(
        UploadModel.saveImfx(packageId, {
          content: imfx,
          filename: "some_filename.imfx",
        }),
      );
      if (saveErr) {
        fastify.log.error(saveErr);
        return fastify.httpErrors.internalServerError();
      }

      try {
        const { encrypted: encryptedImfx, sessionKeyEncrypted } = encrypt(imfx);
        // const file = decrypt(encryptedImfx, sessionKeyEncrypted);

        // return response
        //   .code(200)
        //   .headers({
        //     "Access-Control-Expose-Headers": "Content-Disposition",
        //     "Content-Disposition": 'attachment; filename="MDEUR__test.imfx"',
        //     "Content-Type": "application/octet-stream",
        //   })
        //   .send(file);

        const xmls = makeXmls(
          "MDEUR__encrypt_test.res",
          sessionKeyEncrypted.toString("base64"),
          encryptedImfx.toString("base64"),
        );

        const [axiosErr, customsResponse] = await fastify.to(
          axios
            .post<string>(
              "https://sw2.customs.gov.ua/ImfxOperations.asmx",
              xmls,
              {
                headers: {
                  Accept: "text/xml",
                  "Content-Type": "text/xml; charset=utf-8",
                  "Content-Length": xmls.length,
                  SOAPAction: "http://tempuri.org/UploadImfx1",
                },
              },
            )
            .then((r) => r.data)
            .then((data) => parseXml(data)),
        );

        if (!response || axiosErr) {
          fastify.log.error(axiosErr);
          return fastify.httpErrors.internalServerError("Помилка відправки");
        }

        const result =
          customsResponse["soap:Envelope"]["soap:Body"]["UploadImfx1Response"][
            "UploadImfx1Result"
          ];
        if (result["ErrorCode"] === 0) {
          return response.code(200);
        } else {
          return fastify.httpErrors.internalServerError(result["ErrorMessage"]);
        }
      } catch (e) {
        fastify.log.error(e);
        return fastify.httpErrors.internalServerError("Помилка відправки");
      }
    },
  );
};

export { endpoint };
