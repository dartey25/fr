import {
  createObjectField,
  createScalarField,
  createModel,
} from "prisma-schema-dsl";
import {
  CUID,
  NOW,
  ReferentialActions,
  ScalarType,
  UUID,
} from "prisma-schema-dsl-types";

const certificateModel = createModel("Certificate", [
  createScalarField(
    "id",
    ScalarType.String,
    undefined,
    true,
    true,
    true,
    undefined,
    CUID + "()",
  ),
  createScalarField("cert_num", ScalarType.String),
  createScalarField("cert_lang", ScalarType.String),
  createScalarField("exporter_tax", ScalarType.Int),
  createScalarField("exporter_eori", ScalarType.String),
  createScalarField("exporter_name", ScalarType.String, undefined, true),
  createScalarField("exporter_address", ScalarType.String, undefined, true),
  createScalarField("btw2_code", ScalarType.String, undefined, true),
  createScalarField("btw2_name", ScalarType.String, undefined, true),
  createScalarField("destination_eori", ScalarType.String),
  createScalarField("destination_name", ScalarType.String),
  createScalarField("destination_address", ScalarType.String),
  createScalarField("destination_cnt", ScalarType.String),
  createScalarField("destination_country", ScalarType.String),
  createScalarField("orig_code", ScalarType.String),
  createScalarField("orig_name", ScalarType.String),
  createScalarField("dest_code", ScalarType.String),
  createScalarField("dest_name", ScalarType.String),
  createScalarField("transport", ScalarType.String),
  createScalarField("remarks", ScalarType.String),
  createObjectField("goods", "Goods", true, true),
  createScalarField("customs_permission_ce_place", ScalarType.String),
  createScalarField("customs_permission_ce_date", ScalarType.DateTime),
  createScalarField("customs_permission_ce_name", ScalarType.String),
  createScalarField("customs_permission_cust_name", ScalarType.String),
  createScalarField("customs_permission_gtd_type", ScalarType.String),
  createScalarField("customs_permission_gtd_num", ScalarType.String),
  createScalarField("customs_permission_gtd_date", ScalarType.DateTime),
  createScalarField("declaration_place", ScalarType.String, undefined, true),
  createScalarField("declaration_date", ScalarType.DateTime, undefined, true),
  createScalarField("declaration_name", ScalarType.String, undefined, true),
  createScalarField("receive_form_conditions", ScalarType.String),
  createScalarField("receive_form_docs", ScalarType.String),
  createScalarField("receive_form_app_place", ScalarType.String),
  createScalarField("receive_form_app_date", ScalarType.DateTime),
  createScalarField("receive_form_app_fio", ScalarType.String),
  createObjectField("added_docs", "AddedDocs", true, true),
  createScalarField(
    "created_at",
    ScalarType.DateTime,
    undefined,
    true,
    undefined,
    undefined,
    undefined,
    NOW + "()",
  ),
  createScalarField("edited_at", ScalarType.DateTime),
  createObjectField("history", "CertificateHistory", true, true),
]);

const goodsModel = createModel("Goods", [
  createScalarField(
    "id",
    ScalarType.String,
    undefined,
    true,
    true,
    true,
    undefined,
    CUID + "()",
  ),
  createObjectField(
    "certificate",
    "Certificate",
    undefined,
    true,
    undefined,
    ["cert_id"],
    ["id"],
    ReferentialActions.Cascade,
  ),
  createScalarField("cert_id", ScalarType.String, undefined, true),
  createScalarField("name", ScalarType.String),
  createScalarField("quant", ScalarType.Int),
  createScalarField("unit_code", ScalarType.Int),
  createScalarField("unit_name", ScalarType.String),
  createScalarField("inv_num", ScalarType.String),
  createScalarField("inv_date", ScalarType.DateTime),
  createScalarField(
    "created_at",
    ScalarType.DateTime,
    undefined,
    true,
    undefined,
    undefined,
    undefined,
    NOW + "()",
  ),
  createScalarField("edited_at", ScalarType.DateTime),
]);
const addedDocsModel = createModel("AddedDocs", [
  createScalarField(
    "id",
    ScalarType.String,
    undefined,
    true,
    true,
    true,
    undefined,
    CUID + "()",
  ),
  createObjectField(
    "certificate",
    "Certificate",
    undefined,
    true,
    undefined,
    ["cert_id"],
    ["id"],
    ReferentialActions.Cascade,
  ),
  createScalarField("cert_id", ScalarType.String, undefined, true),
  createScalarField("doc_type", ScalarType.Int),
  createScalarField("doc_num", ScalarType.String),
  createScalarField("doc_date", ScalarType.DateTime),
  createScalarField("file_name", ScalarType.String),
  createScalarField("file_type", ScalarType.String),
  createScalarField("file_size", ScalarType.Int),
  createObjectField("file_content", "Bytes"),
  createScalarField(
    "created_at",
    ScalarType.DateTime,
    undefined,
    true,
    undefined,
    undefined,
    undefined,
    NOW + "()",
  ),
  createScalarField("edited_at", ScalarType.DateTime),
]);

const certificateHistoryModel = createModel("CertificateHistory", [
  createScalarField(
    "id",
    ScalarType.String,
    undefined,
    true,
    true,
    true,
    undefined,
    CUID + "()",
  ),
  createObjectField(
    "certificate",
    "Certificate",
    undefined,
    true,
    undefined,
    ["cert_id"],
    ["id"],
    ReferentialActions.Cascade,
  ),
  createScalarField("cert_id", ScalarType.String, undefined, true),
  createScalarField("action", ScalarType.String, undefined, true),
  createScalarField(
    "created_at",
    ScalarType.DateTime,
    undefined,
    true,
    undefined,
    undefined,
    undefined,
    NOW + "()",
  ),
]);
const uploadImfxModel = createModel("UploadImfx", [
  createScalarField(
    "id",
    ScalarType.String,
    undefined,
    true,
    true,
    true,
    undefined,
    UUID + "()",
  ),
  createObjectField(
    "certificate",
    "Certificate",
    undefined,
    true,
    undefined,
    ["certId"],
    ["id"],
    ReferentialActions.Cascade,
  ),
  createScalarField("certId", ScalarType.String, undefined, true),
  createObjectField("docList", "Bytes"),
  createObjectField("docListSign", "Bytes"),
  createObjectField("doc1", "Bytes"),
  createObjectField("doc1Sign", "Bytes"),
  createScalarField(
    "createDate",
    ScalarType.DateTime,
    undefined,
    true,
    undefined,
    undefined,
    undefined,
    NOW + "()",
  ),
  createScalarField("createUser", ScalarType.String, undefined, true),
  createScalarField("modifyDate", ScalarType.DateTime),
  createScalarField("modifyUser", ScalarType.String),
  createScalarField("deleteDate", ScalarType.DateTime),
  createScalarField("deleteUser", ScalarType.String),
  createScalarField("senderEmail", ScalarType.String),
  createScalarField("senderName", ScalarType.String),
  createScalarField("recipient", ScalarType.String),
  createObjectField("imfxContent", "Bytes"),
  createScalarField("imfxFilename", ScalarType.String),
  createObjectField("sessionPassRaw", "Bytes"),
  createScalarField("sessionPass", ScalarType.String),
  createObjectField("encryptedSessPassRaw", "Bytes"),
  createScalarField("encryptedSessPass", ScalarType.String),
  createObjectField("encryptedImfxRaw", "Bytes"),
  createScalarField("encryptedImfx", ScalarType.String),
  createScalarField("response", ScalarType.String),
  createObjectField("attachments", "UploadAttachments", true, true),
]);

const uploadAttachmentsModel = createModel("UploadAttachments", [
  createScalarField(
    "id",
    ScalarType.String,
    undefined,
    true,
    true,
    true,
    undefined,
    UUID + "()",
  ),
  createObjectField(
    "uploadPackage",
    "UploadImfx",
    undefined,
    true,
    undefined,
    ["uploadPackageId"],
    ["id"],
    ReferentialActions.Cascade,
  ),
  createScalarField("uploadPackageId", ScalarType.String, undefined, true),
  createScalarField("docLink", ScalarType.Int),
  createScalarField("fileName", ScalarType.Int),
  createObjectField("fileContent", "Bytes"),
  createObjectField("fileSign", "Bytes"),
  createScalarField(
    "createDate",
    ScalarType.DateTime,
    undefined,
    true,
    undefined,
    undefined,
    undefined,
    NOW + "()",
  ),
  createScalarField("deleteDate", ScalarType.DateTime),
]);

export {
  certificateModel,
  certificateHistoryModel,
  addedDocsModel,
  goodsModel,
  uploadAttachmentsModel,
  uploadImfxModel,
};
