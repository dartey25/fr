import prisma from "@/prisma/eur";
import { TFormSchema } from "@/schema/eur";

function getAll(page: number, limit: number) {
  return prisma.client.certificate.findMany({
    select: {
      id: true,
      created_at: true,
      edited_at: true,
      exporter_name: true,
      destination_name: true,
      goods: true,
      history: true,
      remarks: true,
    },
    skip: page * limit,
    take: limit,
    orderBy: [{ edited_at: "desc" }, { created_at: "desc" }],
  });
}

async function getCertificate(id: string) {
  const res = await prisma.client.certificate.findUniqueOrThrow({
    where: { id },
    include: {
      goods: true,
      added_docs: true,
    },
  });
  return res;
}

type TCertificate = Awaited<ReturnType<typeof getCertificate>>;

async function getFullCertificate(id: string) {
  const result = await prisma.client.certificate.findUniqueOrThrow({
    where: { id },
    include: {
      history: { select: { id: true, action: true, created_at: true } },
      goods: true,
      added_docs: {
        select: {
          file_name: true,
          id: true,
          doc_date: true,
          doc_num: true,
          doc_type: true,
        },
      },
    },
  });
  return result;
}

function deleteCertificate(id: string) {
  return prisma.client.certificate.delete({
    where: { id },
  });
}

function createCertificate(data: TFormSchema) {
  const { goods: goodsData, added_docs: docsData, ...certData } = data;

  return prisma.client.certificate.create({
    //@ts-expect-error
    data: {
      ...certData,
      created_at: new Date(),
      history: {
        create: [{ action: "create", created_at: new Date() }],
      },
      goods: {
        create: goodsData?.map((item) => {
          return { ...item, created_at: new Date() };
        }),
      },
      added_docs: {
        create: docsData?.map((item) => {
          return { ...item, created_at: new Date() };
        }),
      },
    },
  });
}

async function updateCertificate(id: string, data: TFormSchema) {
  const { goods: goodsData, added_docs: docsData, ...certData } = data;

  if (goodsData?.length) {
    await prisma.client.goods.deleteMany({ where: { cert_id: id } });
    await prisma.client.$transaction(
      goodsData.map((item) =>
        prisma.client.goods.create({
          data: { ...item, cert_id: id, created_at: new Date() },
        }),
      ),
    );
  }

  if (docsData?.length) {
    await prisma.client.addedDocs.deleteMany({ where: { cert_id: id } });
    await prisma.client.$transaction(
      docsData.map((item) =>
        prisma.client.addedDocs.create({
          data: { ...item, cert_id: id, created_at: new Date() },
        }),
      ),
    );
  }

  return prisma.client.certificate.update({
    data: {
      ...certData,
      edited_at: new Date(),
      history: { create: [{ action: "edit", created_at: new Date() }] },
    },
    where: {
      id: id,
    },
  });
}

function getCertificateHistory() {
  return prisma.client.certificateHistory.findMany();
}

function logAction(id: string, action: "create" | "edit" | "pdf" | "imfx") {
  return prisma.client.certificateHistory.create({
    data: { action, cert_id: id, created_at: new Date() },
  });
}

export {
  getCertificate,
  getFullCertificate,
  deleteCertificate,
  getCertificateHistory,
  updateCertificate,
  createCertificate,
  getAll,
  logAction,
};

export type { TCertificate };
