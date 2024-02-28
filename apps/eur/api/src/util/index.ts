import { createHash } from "crypto";
import { format } from "date-fns";
import os from "os";

function parseDate(v: Date | string): Date {
  if (typeof v === "string") {
    return new Date(v);
  }

  return v;
}

function makeFileName(extention: string, serviceCode: "eur" = "eur") {
  return `MD${serviceCode.toUpperCase()}_${format(
    new Date(),
    "yyyyMMddhhmmss",
  )}.${extention}`;
}

function getHWID() {
  const data = [os.cpus()[0].model, os.machine];
  const hash = createHash("sha256");
  hash.update(data.join());
  return parseInt(hash.digest("hex").slice(0, 8), 16).toString();
}

export { parseDate, makeFileName, getHWID };
