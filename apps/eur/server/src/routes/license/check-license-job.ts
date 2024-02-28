import { TUser } from "@/shared-types";
import { axios } from "../../util/axios";
import { LicensePath } from "../../util/constants";
import fs from "fs";

type TLicenseValidationPayload = {
  hwid: number;
  token: string;
} & (
  | {
      email: string;
      password: string;
    }
  | {
      userId: number;
    }
);

export function validateLicenseOnServer(payload: TLicenseValidationPayload) {
  // console.log("PAYLOAD", payload);
  return axios.post("license/validate", payload).then((r) => r.data);
}

export async function checkLicenseFile(): Promise<
  boolean | { valid: boolean; user: TUser; expiresAt: string }
> {
  if (!fs.existsSync(LicensePath)) {
    throw new Error("No license file");
  }

  const content = JSON.parse(fs.readFileSync(LicensePath).toString());
  return {
    valid: true,
    user: {
      id: content.profile.userId,
      email: content.profile.email,
      username: content.profile.username,
    },
    expiresAt: content.license.expiresAt,
  };
}

export async function checkLicenseJob(): Promise<{
  valid?: boolean;
  isActivated: boolean;
}> {
  if (!fs.existsSync(LicensePath)) {
    //TODO write into windows registry when license was activated
    return { isActivated: false };
  }

  const content = JSON.parse(fs.readFileSync(LicensePath).toString());
  try {
    const result = await validateLicenseOnServer({
      hwid: content.license.hwid,
      token: content.license.token,
      userId: content.profile.userId,
    });

    return { valid: result.valid, isActivated: true };
  } catch {
    null;
  }
}
