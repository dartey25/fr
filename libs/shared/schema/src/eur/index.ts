import { z } from "../zod";
import { Control } from "react-hook-form";

const goods = z.array(
  z
    .object({
      id: z.string().cuid().optional(),
      name: z.string().min(1).max(1600),
      quant: z.coerce.number().int(),
      unit_code: z.coerce
        .number()
        .int()
        .min(3, { message: "Невірне значення коду" }),
      unit_name: z.string().min(1).max(200).optional(),
      inv_num: z.string().min(1).max(50),
      inv_date: z.coerce.date().nullish(),
    })
    .nullish(),
);

const added_docs = z.array(
  z.object({
    id: z.string().cuid().optional(),
    doc_type: z.coerce.number().int().min(0).nullish(),
    doc_num: z.string().nullish(),
    doc_date: z.coerce.date().nullish(),
    file_name: z.string().nullish(),
    file_type: z.string().nullish(),
    file_size: z.coerce
      .number()
      .int()
      .max(500000, {
        message: "Митниця не дозволяє передавати файли більше 500Кб",
      })
      .nullish(),
    file_content: z.string().nullish(),
  }),
);

const formSchema = z.object({
  id: z.string().cuid().optional(),
  cert_num: z.string().max(10).optional().nullable(),
  cert_lang: z.string().length(2).nullish(),

  exporter_tax: z.coerce
    .number()
    .int()
    .lte(9999999999, {
      message: "Код має бути коротший або дорівнювати 10 символам",
    })
    .nullish(),
  exporter_eori: z.string().max(17).nullish(),
  exporter_name: z.string().min(1).max(200),
  exporter_address: z.string().min(1).max(200),

  btw2_code: z.string().max(2),
  btw2_name: z.string().max(80),

  destination_eori: z.string().max(17).nullish(),
  destination_name: z.string().max(200).nullish(),
  destination_address: z.string().max(200).nullish(),
  destination_cnt: z.string().max(2).nullish(),
  destination_country: z.string().max(80).nullish(),

  orig_code: z.string().max(2).nullish(),
  orig_name: z.string().max(80).nullish(),
  dest_code: z.string().max(2).nullish(),
  dest_name: z.string().max(80).nullish(),

  transport: z.string().max(400).nullish(),
  remarks: z.string().max(400).nullish(),

  goods: goods.nullish(),

  customs_permission_ce_place: z.string().max(200).nullish(),
  customs_permission_ce_date: z.coerce.date().nullish(),
  customs_permission_ce_name: z.string().max(200).nullish(),
  customs_permission_cust_name: z.string().max(80).nullish(),
  customs_permission_gtd_type: z.string().max(10).nullish(),
  customs_permission_gtd_num: z.string().max(30).nullish(),
  customs_permission_gtd_date: z.coerce.date().nullish(),

  declaration_place: z.string().min(1).max(200),
  declaration_date: z.coerce.date(),
  declaration_name: z.string().min(1).max(200),

  receive_form_conditions: z.string().max(30000).nullish(),
  receive_form_docs: z.string().max(30000).nullish(),
  receive_form_app_place: z.string().max(200).nullish(),
  receive_form_app_date: z.coerce.date().nullish(),
  receive_form_app_fio: z.string().max(200).nullish(),
  added_docs: added_docs.nullish(),
});

const defaultValues: Partial<z.infer<typeof formSchema>> = {
  cert_lang: "EN",
  btw2_code: "EU",
  btw2_name: "European Union",
  orig_code: "UA",
  orig_name: "UKRAINE",
  dest_code: "EF",
  dest_name: "EFTA",
  goods: [
    {
      name: "",
      inv_date: undefined,
      inv_num: "",
      quant: 0,
      unit_code: 0,
    },
  ],
};

type FormComponentProps = {
  control: Control<z.infer<typeof formSchema>>;
  schema: typeof formSchema.shape;
};

type THistory = {
  id: string;
  action: string;
  created_at: Date;
};

type TFormSchema = z.infer<typeof formSchema>;
type TGoods = z.infer<typeof goods>;
type TDocs = z.infer<typeof added_docs>;

export { formSchema, defaultValues };
export type { TFormSchema, TGoods, TDocs, FormComponentProps, THistory };
