import {
  Legend,
  FieldSet,
  FormRow,
  Label,
  Input,
  FormField,
  FormItem,
  FormControl,
} from "@/ui";
import { CountryOption, options } from "./country-modal";
import { FormComponentProps } from "../schema";
import { schemaOptional } from "../../../../utils";
import { useFormStore } from "../store";
import React from "react";

export function CertificateUse({
  control,
  schema,
  callBack,
}: FormComponentProps & { callBack: (option: CountryOption) => void }) {
  const { agreement_countries } = useFormStore((state) => state.structure);
  const legendRef = React.useRef<HTMLLegendElement>(null);
  const fieldId = React.useId();

  React.useEffect(() => {
    if (agreement_countries) {
      agreement_countries.ref = legendRef;
      agreement_countries.fieldId = fieldId;
    }
  }, [legendRef, agreement_countries, fieldId]);
  return (
    <>
      <Legend ref={legendRef}>
        2. Сертифікат, що використовується для преференційної торгівлі між
      </Legend>

      <FieldSet id="document-form-btw">
        <FormRow>
          <Label required={!schemaOptional(schema.btw2_code)}>
            <b>UKRAINE</b> та
          </Label>
          <div className="col-5">
            <div className="row">
              <FormField
                control={control}
                name="btw2_code"
                render={({ field }) => (
                  <FormItem>
                    <FormControl className="col-3">
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="btw2_name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl className="col-9">
                      <Input
                        withModal
                        modalOptions={options("btw2", callBack)}
                        {...field}
                        id={fieldId}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <span className="form-text text-muted">
                вставити відповідні країни, групи країн або територій (код
                країни, назва)
              </span>
            </div>
          </div>
        </FormRow>
      </FieldSet>
    </>
  );
}
