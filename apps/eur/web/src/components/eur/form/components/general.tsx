import {
  Legend,
  FieldSet,
  FormRow,
  Label,
  Input,
  FormControl,
  FormField,
  FormItem,
} from "@/ui";
import { FormComponentProps } from "../schema";
import { schemaOptional } from "../../../../utils";
import { useFormStore } from "../store";
import React from "react";

export function GeneralInfo({ control, schema }: FormComponentProps) {
  const { general } = useFormStore((state) => state.structure);
  const legendRef = React.useRef<HTMLLegendElement>(null);
  const fieldId = React.useId();

  React.useEffect(() => {
    if (general) {
      general.ref = legendRef;
      general.fieldId = fieldId;
    }
  }, [legendRef, general, fieldId]);
  return (
    //placeholder="ххх.мммммм"
    <>
      <Legend ref={legendRef}>Загальні відомості</Legend>
      <FieldSet id="document-form-general">
        <FormRow>
          <FormField
            control={control}
            name="cert_num"
            render={({ field }) => (
              <FormItem>
                <Label required={!schemaOptional(schema.cert_num)}>
                  <b>EUR.1</b> No
                </Label>
                <FormControl className="col-3">
                  <Input    mask="+4\9 99 999 99" maskChar=" " {...field} id={fieldId} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="cert_lang"
            render={({ field }) => (
              <FormItem>
                <Label required={!schemaOptional(schema.cert_lang)}>
                  Мова заповнення сертифіката
                </Label>
                <FormControl className="col-2">
                  <Input placeholder="EN" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </FormRow>
      </FieldSet>
    </>
  );
}
