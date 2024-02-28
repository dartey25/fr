import crypto from "crypto";
import getPem from "rsa-pem-from-mod-exp";

const IV = Buffer.from([
  155, 12, 54, 46, 109, 243, 230, 7, 40, 95, 115, 178, 74, 42, 63, 158,
]);

const algorithm = "aes-128-cbc";

const rsaModulus =
  "1f83WJKqMoPGwCgDPFuu3n5fLvxzuw8KF08NMTGspQimJc4aTlDghtha0s/IoUxDKOmK6M93frrD3wSyWJOddiHBQcFKg6otditSzfCuFTSZ7FIMwXF3NCxn9VfLR5OOj/ztoWO8UTi4gPSzWYOtGL0H9TRys06RRermDUUyuFozaKdeTJCAgttb62GJqlF4cjbZgeV6YMnXweXpVy3fRZ/BGdQm3n0t9FAW+VCpr+bKrdCwJVMKtbblFVwR4BVTJmzKa2aC9N80XD9hJOFiMPSlJhIg8H7eVfLaTeytShy3FlmhdX83RFXJUujzR9F+dDp10wRwHxIa7s34f/Ay2Q==";
const rsaExponent = "AQAB";

function encryptToBytes(file: Buffer, key: Buffer) {
  const cipher = crypto.createCipheriv(algorithm, key, IV);
  return Buffer.concat([cipher.update(file), cipher.final()]);
}

export function encrypt(file: Buffer) {
  const sessionKey = crypto.randomBytes(16);
  const encrypted = encryptToBytes(file, sessionKey);

  const rsa = crypto.createPublicKey({
    key: getPem(rsaModulus, rsaExponent),
    format: "pem",
    type: "pkcs1",
  });
  const sessionKeyEncrypted = crypto.publicEncrypt(
    { key: rsa, padding: crypto.constants.RSA_PKCS1_PADDING },
    sessionKey,
  );

  return { encrypted, sessionKey, sessionKeyEncrypted };
}

function decryptFromBytes(encryptedData: Buffer, sessionKeyEncrypted: Buffer) {
  const rsaPrivateKey = crypto.createPrivateKey({
    key: getPem(rsaModulus, rsaExponent),
    format: "pem",
    type: "pkcs1",
  });

  const sessionKey = crypto.privateDecrypt(
    { key: rsaPrivateKey, padding: crypto.constants.RSA_PKCS1_PADDING },
    sessionKeyEncrypted,
  );

  const decipher = crypto.createDecipheriv(algorithm, sessionKey, IV);
  return Buffer.concat([decipher.update(encryptedData), decipher.final()]);
}

export function decrypt(encryptedData: Buffer, sessionKeyEncrypted: Buffer) {
  const decryptedFile = decryptFromBytes(encryptedData, sessionKeyEncrypted);
  return Buffer.from(decryptedFile.toString("base64"), "base64");
}

// const crypto = require('crypto');

// class RijndaelCrypt {
//     constructor(password) {
//         this.TAG = 'YourAppName';
//         this.TRANSFORMATION = 'aes-256-cbc';
//         this.ALGORITHM = 'aes-256-cbc';
//         this.DIGEST = 'md5';
//         this.IV = Buffer.from('ThisIsUrPassword'); // 16-byte private key

//         try {
//             // Encode digest
//             const digest = crypto.createHash(this.DIGEST);
//             this._password = Buffer.from(digest.update(password).digest(), 'binary');

//         } catch (error) {
//             console.error(this.TAG, 'Error initializing RijndaelCrypt:', error);
//         }
//     }

//     encrypt(text) {
//         try {
//             const cipher = crypto.createCipheriv(this.ALGORITHM, this._password, this.IV);
//             let encryptedData = cipher.update(text, 'utf-8', 'base64');
//             encryptedData += cipher.final('base64');
//             return encryptedData;

//         } catch (error) {
//             console.error(this.TAG, 'Error encrypting data:', error);
//             return null;
//         }
//     }

//     decrypt(text) {
//         try {
//             const decipher = crypto.createDecipheriv(this.ALGORITHM, this._password, this.IV);
//             let decryptedData = decipher.update(text, 'base64', 'utf-8');
//             decryptedData += decipher.final('utf-8');
//             return decryptedData;

//         } catch (error) {
//             console.error(this.TAG, 'Error decrypting data:', error);
//             return null;
//         }
//     }
// }

// module.exports = RijndaelCrypt;
