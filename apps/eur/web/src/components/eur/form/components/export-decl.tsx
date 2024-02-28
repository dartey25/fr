import {
  Legend,
  FieldSet,
  FormRow,
  Label,
  Input,
  DatePicker,
  FormField,
  FormItem,
  FormControl,
} from "@/ui";
import { FormComponentProps } from "../schema";
import { schemaOptional } from "../../../../utils";
import { useFormStore } from "../store";
import React from "react";

export function ExportDeclaration({ control, schema }: FormComponentProps) {
  const { exportDeclaration } = useFormStore((state) => state.structure);
  const legendRef = React.useRef<HTMLLegendElement>(null);
  const fieldId = React.useId();

  React.useEffect(() => {
    if (exportDeclaration) {
      exportDeclaration.ref = legendRef;
      exportDeclaration.fieldId = fieldId;
    }
  }, [legendRef, exportDeclaration, fieldId]);
  return (
    <>
      <Legend ref={legendRef}>12. Декларація від експортера</Legend>
      <FieldSet>
        <FormRow>
          <FormField
            control={control}
            name="declaration_place"
            render={({ field }) => (
              <FormItem>
                <Label
                  size="sm"
                  required={!schemaOptional(schema.declaration_place)}
                >
                  Місце
                </Label>
                <FormControl className="col">
                  <Input {...field} id={fieldId} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="declaration_date"
            render={({ field }) => (
              <FormItem>
                <Label
                  size="xs"
                  required={!schemaOptional(schema.declaration_date)}
                >
                  Дата
                </Label>
                <FormControl className="col">
                  <DatePicker fieldKey="declaration_date" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="declaration_name"
            render={({ field }) => (
              <FormItem>
                <Label
                  size="xs"
                  required={!schemaOptional(schema.declaration_name)}
                >
                  ПIБ
                </Label>
                <FormControl className="col">
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </FormRow>
      </FieldSet>
    </>
  );
}
