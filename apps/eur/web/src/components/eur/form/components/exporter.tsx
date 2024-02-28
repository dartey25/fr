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
import { FormComponentProps } from "../schema";
import { schemaOptional } from "../../../../utils";
import { useFormStore } from "../store";
import React from "react";

export function Exporter({ control, schema }: FormComponentProps) {
  const { exporter } = useFormStore((state) => state.structure);
  const legendRef = React.useRef<HTMLLegendElement>(null);
  const fieldId = React.useId();

  React.useEffect(() => {
    exporter.ref = legendRef;
    exporter.fieldId = fieldId;
  }, [legendRef, exporter, fieldId]);

  return (
    <>
      <Legend ref={legendRef}>1. Експортер</Legend>
      <FieldSet id="document-form-exporter">
        <FormRow>
          <FormField
            control={control}
            name="exporter_tax"
            render={({ field }) => (
              <FormItem>
                <Label required={!schemaOptional(schema.exporter_tax)}>
                  Код ЄДРПОУ чи ДРФО
                </Label>
                <FormControl className="col-5">
                  <Input {...field} id={fieldId} />
                </FormControl>
              </FormItem>
            )}
          />
        </FormRow>

        <FormRow>
          <FormField
            control={control}
            name="exporter_eori"
            render={({ field }) => (
              <FormItem>
                <Label required={!schemaOptional(schema.exporter_eori)}>
                  Код EORI або акредитації митниці
                </Label>
                <FormControl className="col-5">
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </FormRow>

        <FormRow>
          <FormField
            control={control}
            name="exporter_name"
            render={({ field }) => (
              <FormItem>
                <Label required={!schemaOptional(schema.exporter_name)}>
                  Найменування
                </Label>
                <FormControl className="col-9">
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </FormRow>

        <FormRow>
          <FormField
            control={control}
            name="exporter_address"
            render={({ field }) => (
              <FormItem>
                <Label required={!schemaOptional(schema.exporter_address)}>
                  Адреса
                </Label>
                <FormControl className="col-9">
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </FormRow>

        <FormRow>
          <Label required>Країна (код, назва)</Label>
          <div className="col-5">
            <div className="row">
              <div className="col-3">
                <Input value="UA" readOnly />
              </div>
              <div className="col-9">
                <Input value="UKRAINE" readOnly />
              </div>
            </div>
          </div>
        </FormRow>
      </FieldSet>
    </>
  );
}
