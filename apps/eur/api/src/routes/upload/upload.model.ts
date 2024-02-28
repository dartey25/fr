import prisma from "@/prisma/eur";
import { UploadSaveRequestBody } from "@/shared-types";

type TUploadSaveData = {
  doc1: Buffer;
  docList: Buffer;
  attachments?: Buffer[];
};

async function initUpload(
  data: TUploadSaveData,
  certId: string,
  createUserId: string,
) {
  // await prisma.uploadImfx.deleteMany({
  //   where: {
  //     certId,
  //   },
  // });

  const uploadPackage = await prisma.client.uploadImfx.create({
    data: {
      docList: data.docList,
      doc1: data.doc1,
      createUser: createUserId,
      certId: certId,
    },
  });

  return uploadPackage.id;
}

async function saveSignedFiles(payload: UploadSaveRequestBody) {
  const signs = payload.signs;
  const doc1Sign = signs.find((item) => item.field === "doc1").sign;
  const docListSign = signs.find((item) => item.field === "doclist").sign;

  await prisma.client.uploadImfx.update({
    where: {
      id: payload.packageId,
    },
    data: {
      doc1Sign: Buffer.from(doc1Sign),
      docListSign: Buffer.from(docListSign),
      modifyDate: new Date(),
      modifyUser: "XXXXX",
    },
  });
}

async function getUpload(packageId: string) {
  return prisma.client.uploadImfx.findFirstOrThrow({
    where: {
      id: packageId,
    },
  });
}

async function saveImfx(
  packageId: string,
  imfx: { content: Buffer; filename: string },
) {
  return prisma.client.uploadImfx.update({
    where: {
      id: packageId,
    },
    data: {
      imfxContent: imfx.content,
      imfxFilename: imfx.filename,
    },
  });
}

export const UploadModel = {
  init: initUpload,
  saveSign: saveSignedFiles,
  get: getUpload,
  saveImfx: saveImfx,
};
