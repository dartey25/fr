import { Object } from "ts-toolbelt";

export type TUser = {
  id: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
};

export type UploadInitRequestBody = {
  certId: string;
  signature: string;
};

export type UploadSaveRequestBody = {
  packageId: string;
  signs: Object.Required<Object.Omit<TPackageItemBase64, "content">, "sign">[];
};

export type TPackageItem = {
  field: string;
  fileId?: string;
  content: Buffer;
};

export type TPackageItemBase64 = {
  field: string;
  fileId?: string;
  content: string;
  sign?: string;
};

export type TPackageListBase64 = {
  id: string;
  files: TPackageItemBase64[];
};

export type TEndpointSendBody = {
  id: string;
  packageId: string;
  senderEmail: string;
  senderName: string;
  recipient: string;
};

export type TEnvelopeData = {
  isEmpty?: boolean;
  version?: number;
  messageId: string;
  replyId?: string;
  sender: string;
  receiver: string;
  creationDate?: Date;
  direction?: number;
  msgType?: number;
  comment?: string;
  docList?: {
    fileName?: string;
    protMethod?: number;
    selfSigned?: number;
    signFileName?: string;
  };
};
