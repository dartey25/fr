import { Control } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "@/schema/eur";

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
  control: Control<z.infer<typeof formSchema>, any>;
  schema: typeof formSchema.shape;
};

type TFormSchema = z.infer<typeof formSchema>;
type THistory = {
  id: string;
  action: string;
  created_at: Date;
};

export { formSchema, defaultValues };
export type { FormComponentProps, TFormSchema, THistory };
