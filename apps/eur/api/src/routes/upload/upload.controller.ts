import { FastifyPluginAsync } from "fastify";
import { getCertificate } from "../cert/cert.model";
import { makeAttachments, makeDoc1, makeDoclist } from "../../util/imfx";
import { UploadModel } from "./upload.model";
import {
  TPackageItem,
  TPackageListBase64,
  UploadInitRequestBody,
  UploadSaveRequestBody,
} from "@/shared-types";

function makePackageList(
  doc1: Buffer,
  docList: Buffer,
  attachments: Buffer[],
): TPackageItem[] {
  const packageList: TPackageItem[] = [];
  packageList.push({
    field: "doc1",
    content: doc1,
  });
  packageList.push({
    field: "doclist",
    content: docList,
  });
  attachments.forEach((attachment, index) => {
    packageList.push({
      field: "attachment",
      fileId: index.toString(),
      content: attachment,
    });
  });
  return packageList;
}

function makePackage(
  packageId: string,
  packageList: TPackageItem[],
): TPackageListBase64 {
  const _package: TPackageListBase64 = {
    id: packageId,
    files: packageList.map((item) => {
      if (item.fileId) {
        return {
          field: item.field,
          fileId: item.fileId,
          content: item.content.toString("base64"),
        };
      }

      return {
        field: item.field,
        content: item.content.toString("base64"),
      };
    }),
  };

  return _package;
}

const upload: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post<{ Body: UploadInitRequestBody }>(
    "/init",
    async (request, response) => {
      const { certId } = request.body;
      //TODO parse sign from body

      const [err, certificate] = await fastify.to(getCertificate(certId));

      if (err || !certificate) {
        return fastify.httpErrors.internalServerError("Сертифікат не знайдено");
      }

      const doc1 = makeDoc1(certificate);
      const docList = makeDoclist(certificate);
      const attachments = makeAttachments(certificate.added_docs);

      const [saveErr, packageId] = await fastify.to(
        UploadModel.init({ doc1, docList, attachments }, certId, "1234"),
      );
      if (saveErr) {
        fastify.log.error(saveErr);
        return fastify.httpErrors.internalServerError("Помилка збереження");
      }

      const packageList = makePackageList(doc1, docList, attachments);
      const _package = makePackage(packageId, packageList);

      return response.code(201).send(_package);
    },
  );

  fastify.post<{ Body: UploadSaveRequestBody }>(
    "/save",
    async (request, response) => {
      const [err] = await fastify.to(UploadModel.saveSign(request.body));

      if (err) {
        fastify.log.error(err);
        return fastify.httpErrors.internalServerError();
      }

      return response.code(200).send("Saved");
    },
  );
};

export { upload };
