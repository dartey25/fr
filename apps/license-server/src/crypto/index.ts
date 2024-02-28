import { BinaryLike, createDecipheriv, createHash, scrypt } from "node:crypto";
import { TGenerateToken } from "../schema";

const algorithm = "aes-192-cbc";
const password = "Password used to generate key";
const salt = "mdofficesalt";

async function makeKey(
  password: BinaryLike,
  salt: BinaryLike,
  keylen: number
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keylen, (err, key) => {
      if (err) reject(err);
      resolve(key);
    });
  });
}

export async function decrypt(payload: string): Promise<any> {
  const key = await makeKey(password, salt, 24);

  const payloadBuffer = Buffer.from(payload, "base64");
  const iv = payloadBuffer.slice(0, 16);
  const enc = payloadBuffer.slice(16).toString("base64");

  const decipher = createDecipheriv(algorithm, key, iv);

  let str = decipher.update(enc, "base64", "utf8");
  str += decipher.final("utf8");
  return JSON.parse(str);
}

export function generateToken(licenseData: TGenerateToken) {
  return createHash("shake256", { outputLength: 8 })
    .update(JSON.stringify(licenseData))
    .digest("hex");
}

export async function makeHWID(hddId: string) {
  const hash = createHash("shake256", { outputLength: 4 });
  hash.update(hddId);
  return parseInt(hash.digest("hex"), 16);
  // const res = 
}
