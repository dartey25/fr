import { generate } from "@pdfme/generator";
import { TCertificate } from "./cert.model";
import fs from "node:fs";
import { BLANK_PDF } from "@pdfme/generator";

import format from "date-fns/format";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import path from "node:path";
import { content as EngBase } from "./pdf/eng_pdf_base";
import { schemasFull } from "./pdf/schemas";

type PDFType = "empty" | "blank" | "exp" | "med";

function makeForm(cert: TCertificate, base: string) {
  const inputs = [
    {
      transport: cert.transport ?? "",
      remark: cert.remarks ?? "",
      country2: cert.btw2_name,
      country1: "UKRAINE",
      cert_num: cert.cert_num ?? "",
      exporter_name: cert.exporter_name,
      exporter_addr: cert.exporter_address,
      destination_country: cert.dest_name ?? "",
      orig_country: cert.orig_name ?? "",
      goods: cert.goods.map((item) => item.name).join("\n\n\n"),
      goods_mass: cert.goods
        .map((item) => `${item.quant} ${item.unit_name}`)
        .join("\n\n\n"),
      invoices: cert.goods
        .map(
          (item) =>
            `${item.inv_num ? item.inv_num : ""}\n${
              item.inv_date ? format(item.inv_date, "dd.MM.yyyy") : ""
            }`,
        )
        .join("\n\n"),
      decl_date_place: `${format(cert.declaration_date, "dd.MM.yyyy")} ${
        cert.declaration_place
      }`,
      decl_name: cert.declaration_name,
      customs: cert.customs_permission_cust_name ?? "",
      dst_name: cert.destination_name ?? "",
      dst_addr: cert.destination_address ?? "",
      ce_date_place: `${
        cert.customs_permission_ce_date
          ? format(cert.customs_permission_ce_date, "dd.MM.yyyy")
          : ""
      } ${cert.customs_permission_ce_place ?? ""}`,
      ce_name: cert.customs_permission_ce_name ?? "",
    },
  ];

  return generate({
    template: { basePdf: base, schemas: schemasFull },
    inputs,
  });
}

async function makePdf(cert: TCertificate, type: PDFType = "blank") {
  const fontBytes = fs.readFileSync(
    path.join(__dirname, "fonts", "ArialMT.ttf"),
  );

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  const openSansFont = await pdfDoc.embedFont(fontBytes);

  let formBytes;
  if (type === "empty") {
    formBytes = await makeForm(cert, BLANK_PDF);
  } else {
    formBytes = await makeForm(cert, EngBase);
  }

  if (type !== "exp" && type !== "med") {
    return formBytes;
  }

  const certificatePdf = await PDFDocument.load(formBytes);
  const preamble = await pdfDoc.embedPage(certificatePdf.getPages()[0]);

  const certPage = pdfDoc.addPage();
  certPage.drawPage(preamble);

  const page = pdfDoc.addPage();
  page.drawText("ДЕКЛАРАЦІЯ ЕКСПОРТЕРА", {
    x: 200,
    y: 800,
    size: 16,
    font: openSansFont,
    color: rgb(0, 0, 0),
  });

  //!!!!!!!DON'T REMOVE SPACE!!!!!!!
  page.drawText(
    `   Я, той, що підписався нижче експортер товарів, описаних на звороті,
    
  ЗАЯВЛЯЮ, що товари відповідають умовам, необхідним для видачі сертифіката, що додається;
  
  ОБУМОВЛЮЮ такі обставини, які дозволили цим товарам відповідати зазначеним вище умовам:
  ${
    cert.receive_form_conditions
      ? `
      ${cert.receive_form_conditions}
      `
      : ""
  }
  ПОДАЮ такі супровідні документи:
  ${
    cert.receive_form_docs
      ? `
  ${cert.receive_form_docs}
  `
      : ""
  }
  ЗОБОВ\`ЯЗУЮСЯ подати, на запит відповідної установи, всі необхідні свідчення, які ця установа може запитати для видачі сертифіката, що додається, а також зобов\`язуюся при необхідності погодитися на будь-яку інспекцію моїх рахунків та будь-яку перевірку виробництва зазначених вище товарів, які здійснюватиме зазначена вище установа;
      
  ПРОШУ видати на ці товари сертифікат з перевезення товарів з України за формою “EUR.1”, що додається.
  ${
    cert.receive_form_app_place || cert.receive_form_app_date
      ? `
  ${cert.receive_form_app_place} ${
    cert.receive_form_app_date
      ? format(cert.receive_form_app_date, "dd.MM.yyyy")
      : ""
  }
  `
      : ""
  }

  (Місце та дата)

  ______________________________ ${
    cert.receive_form_app_fio ? cert.receive_form_app_fio : ""
  }

  (Підпис)`,
    {
      x: 80,
      y: 760,
      size: 13,
      lineHeight: 16,
      maxWidth: 500,
      font: openSansFont,
      color: rgb(0, 0, 0),
    },
  );

  const pdfBytes = await pdfDoc.save();

  return pdfBytes;
}

export { makePdf };
export type { PDFType };
