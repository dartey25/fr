import archiver from "archiver";
import { format } from "date-fns";
import { XMLBuilder, XMLParser } from "fast-xml-parser";
import { encodeXML } from "entities";
import unzipper from "unzipper";
import fs from "fs";
import { parseDate } from ".";
import { TCertificate } from "../routes/cert/cert.model";
import { TEnvelopeData } from "@/shared-types";
import { UploadAttachments, UploadImfx } from "@prisma/client/eur";
import { Object } from "ts-toolbelt";

const builder = new XMLBuilder({
  format: true,
  ignoreAttributes: false,
  attributeNamePrefix: "@",
});

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@",
});

export async function parseImfx(filePath: string) {
  const zip = fs
    .createReadStream(filePath)
    .pipe(unzipper.Parse({ forceStream: true }));
  for await (const entry of zip) {
    const fileName = entry.path;
    if (fileName === "doc1.xml") {
      const buffer = await entry.buffer();
      const parsedContent = parseXml(buffer.toString("utf-8"));
      return parsedContent.cor;
    } else {
      entry.autodrain();
    }
  }
}

export function parseXml(xml: string) {
  return parser.parse(xml);
}

export function makeIMFX(content: TCertificate) {
  const doclist = makeDoclist(content);
  const doc = makeDoc1(content);
  const addedDocs = makeAttachments(content.added_docs);

  const archive = archiver("zip", {
    zlib: { level: 9 }, // Sets the compression level.
  });

  const buffers: Buffer[] = [];

  archive.on("data", function (chunk) {
    buffers.push(chunk);
  });

  archive.on("error", function (err) {
    throw err;
  });

  archive.append(doclist, { name: "doclist.xml" });
  archive.append(doc, { name: "doc1.xml" });
  if (addedDocs.length) {
    addedDocs.forEach((doc, index: number) => {
      archive.append(doc, { name: `doc${index + 2}.xml` });
    });
  }

  archive.finalize();

  return new Promise<Buffer>((resolve, reject) => {
    archive.on("end", function () {
      const result = Buffer.concat(buffers);
      resolve(result);
    });

    archive.on("error", function (err) {
      reject(err);
    });
  });
}

type TXMLField = number | string;

type TDoclist = {
  DocList: {
    "@version": number;
    SenderCode: TXMLField;
    SenderName: TXMLField;
    SenderProgName: TXMLField;
    SenderProgVer: TXMLField;
    CreationDate: TXMLField;
    Document: {
      ID: TXMLField;
      DocCode: TXMLField;
      DocNumber: TXMLField;
      ModificationDate: TXMLField;
      Description: TXMLField;
      FileName: TXMLField;
      CRC: TXMLField;
    }[];
  };
};

function makeXml(data: TDoclist | object, encoding?: string): object {
  return {
    "?xml": {
      "@version": "1.0",
      "@encoding": encoding ? encoding : "windows-1251",
    },
    ...data,
  };
}

export function makeDoclist(content: TCertificate): Buffer {
  const xml = makeXml({
    DocList: {
      "@version": 3,
      SenderCode: content.exporter_tax,
      SenderName: content.exporter_name,
      SenderProgName: "MD_EUR_EX",
      SenderProgVer: "1.0.0",
      CreationDate: content.created_at
        ? format(parseDate(content.created_at), "yyyyMMdd'T'HHmmss")
        : format(new Date(), "yyyyMMdd'T'HHmmss"),
      Document: [
        {
          ID: 1,
          DocCode: "86",
          DocNumber: "45523",
          ModificationDate:
            content.edited_at &&
            format(parseDate(content.edited_at), "yyyyMMdd'T'HHmmss"),
          Description: "EUR1 вн. 45523",
          FileName: "doc1.xml",
          CRC: "-301933036",
        },
      ],
    },
  });

  if (content.added_docs?.length) {
    content.added_docs.forEach((doc, index: number) => {
      //@ts-expect-error TODO later
      xml.DocList?.Document.push({
        ID: index + 2,
        DocCode: doc.doc_type,
        DocNumber: doc.doc_num,
        ModificationDate:
          content.edited_at &&
          format(parseDate(content.edited_at), "yyyyMMdd'T'HHmmss"),
        Description: doc.file_name,
        FileName: `doc${index + 2}.xml`,
        CRC: "-301933036",
      });
    });
  }

  return Buffer.from(builder.build(xml));
}

export function makeDoc1(cert: TCertificate): Buffer {
  const xml = makeXml({
    cor: {
      cor_type: 1,
      cor_lang: cert.cert_lang,
      cor_cust: undefined,
      cor_number: undefined,
      cor_btw1_code: "UA",
      cor_btw1_name: "UKRAINE",
      cor_btw2_code: cert.btw2_code,
      cor_btw2_name: cert.btw2_name,
      cor_orig_code: cert.orig_code,
      cor_orig_name: cert.orig_name,
      cor_dest_code: cert.dest_code,
      cor_dest_name: cert.dest_name,
      cor_trn_details: encodeXML(cert.transport ?? ""),
      cor_remarks: encodeXML(cert.remarks ?? ""),
      cor_place: encodeXML(cert.customs_permission_ce_place ?? ""),
      cor_fill_date: cert.customs_permission_ce_date
        ? format(parseDate(cert.customs_permission_ce_date), "yyyyMMdd")
        : undefined,
      cor_fill_name: encodeXML(cert.customs_permission_ce_name ?? ""),
      cor_cust_name: encodeXML(cert.customs_permission_cust_name ?? ""),
      cor_cnt_name: "Ukraine",
      cor_iss_place: encodeXML(cert.receive_form_app_place ?? ""),
      cor_iss_name: encodeXML(cert.receive_form_app_fio ?? ""),

      cor_conditions: encodeXML(cert.receive_form_conditions ?? ""),
      cor_docs: encodeXML(cert.receive_form_docs ?? ""),
      cor_md_type: undefined,
      cor_md_num: undefined,
      cor_md_date: undefined,
      cor_client: {
        cor_cli_gr: 1,
        cor_cli_cnt: cert.destination_cnt,
        cor_cli_code: undefined,
        cor_cli_uori: cert.destination_eori,
        cor_cli_name: cert.destination_name,
        cor_cli_adr: cert.destination_address,
      },
      cor_goods: cert.goods.map((item, index: number) => {
        return {
          cor_g_num: index + 1,
          cor_g_name: item.name,
          cor_g_quant: item.quant,
          cor_g_unit_code: item.unit_code,
          cor_g_unit_name: item.unit_name,
          cor_g_inv_num: item.inv_num,
          cor_g_inv_date: item.inv_date
            ? format(parseDate(item.inv_date), "yyyyMMdd'T'HHmmss")
            : undefined,
        };
      }),
    },
  });
  return Buffer.from(builder.build(xml));
}

export function makeAttachments(docs: TCertificate["added_docs"]): Buffer[] {
  const result = [];

  if (!docs?.length) {
    return [];
  }

  docs.forEach((doc) => {
    if (!doc.file_content) {
      return;
    }
    const xml = makeXml({
      img: {
        "@version": 1,
        doc_img: 0,
        doc_code: doc.doc_type,
        doc_num: doc.doc_num,
        doc_date: doc.doc_date
          ? format(parseDate(doc.doc_date), "yyyyMMdd")
          : undefined,
        img_page: {
          page_num: 1,
          page_file_name: doc.file_name,
          page_zip_status: 0,
          page_image: doc.file_content,
        },
      },
    });

    result.push(Buffer.from(builder.build(xml)));
  });
  return result;
}

export function makeEnvelope(data: TEnvelopeData): Buffer {
  const xml = makeXml({
    Envelope: {
      "@version": data.version ?? 1,
      MessageId: data.messageId,
      Sender: data.sender,
      Receiver: data.receiver,
      CreationDate: data.creationDate
        ? format(parseDate(data.creationDate), "yyyyMMdd")
        : format(new Date(), "yyyyMMdd"),
      Direction: data.direction ?? 1,
      MsgType: 1,
      Comment: data.comment,
      DocListFile: {
        FileName: data.docList.fileName ?? "doclist.xml",
        Protection: {
          MethodID: data.docList.protMethod,
          SelfSigned: data.docList.selfSigned,
          SignFileName: data.docList.signFileName ?? "doclist.xml.p7s",
        },
      },
    },
  });
  return Buffer.from(builder.build(xml));
}

export function buildUploadImfx(
  envelopeData: TEnvelopeData,
  files: Object.Merge<
    UploadImfx,
    { attachments: UploadAttachments[] | undefined }
  >,
) {
  const envelope = makeEnvelope(envelopeData);

  const archive = archiver("zip", {
    zlib: { level: 9 }, // Sets the compression level.
  });

  const buffers: Buffer[] = [];

  archive.on("data", function (chunk) {
    buffers.push(chunk);
  });

  archive.on("error", function (err) {
    throw err;
  });

  archive.append(envelope, { name: "envelope.xml" });

  archive.append(files.docList, { name: "doclist.xml" });
  archive.append(files.docListSign, { name: "doclist.xml.p7s" });

  archive.append(files.doc1, { name: "doc1.xml" });
  archive.append(files.doc1Sign, { name: "doc1.xml.p7s" });

  if (files.attachments && files.attachments.length) {
    files.attachments.forEach((attachment, index: number) => {
      archive.append(attachment.fileContent, { name: `doc${index + 2}.xml` });
    });
  }

  archive.finalize();

  return new Promise<Buffer>((resolve, reject) => {
    archive.on("end", function () {
      const result = Buffer.concat(buffers);
      resolve(result);
    });

    archive.on("error", function (err) {
      reject(err);
    });
  });
}

export function makeXmls(
  fileName: string,
  sessionKey: string,
  content: string,
): string {
  const xml = makeXml(
    {
      "soap:Envelope": {
        "@xmlns:soap": "http://schemas.xmlsoap.org/soap/envelope/",
        "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "@xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
        "soap:Body": {
          UploadImfx1: {
            "@xmlns": "http://tempuri.org/",
            req: {
              FileName: fileName,
              CryptKeyID: "A6B7AC13-0F14-47DD-96C3-D041D45CA186",
              SessionKey: sessionKey,
              Content: content,
            },
          },
        },
      },
    },
    "utf-8",
  );
  return builder.build(xml);
}
