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
import { FormComponentProps, formSchema } from "@/schema/eur";
import { schemaOptional } from "../../../../utils";
import { useFormStore } from "../store";
import React from "react";

export function CustomsPermission({ control }: FormComponentProps) {
  const schema = formSchema.shape;
  const { customsPermission } = useFormStore((state) => state.structure);
  const legendRef = React.useRef<HTMLLegendElement>(null);
  const fieldId = React.useId();

  React.useEffect(() => {
    if (customsPermission) {
      customsPermission.ref = legendRef;
      customsPermission.fieldId = fieldId;
    }
  }, [legendRef, customsPermission, fieldId]);

  return (
    <>
      <Legend ref={legendRef}>11. Митний дозвіл</Legend>
      <FieldSet>
        <FormRow>
          <FormField
            control={control}
            name={"customs_permission_ce_place"}
            render={({ field }) => (
              <FormItem>
                <Label
                  size="sm"
                  required={!schemaOptional(schema.customs_permission_ce_place)}
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
            name={"customs_permission_ce_date"}
            render={({ field }) => (
              <FormItem>
                <Label
                  size="xs"
                  required={!schemaOptional(schema.customs_permission_ce_date)}
                >
                  Дата
                </Label>
                <FormControl className="col">
                  <DatePicker
                    fieldKey="customs_permission_ce_date"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={"customs_permission_ce_name"}
            render={({ field }) => (
              <FormItem>
                <Label
                  size="xs"
                  required={!schemaOptional(schema.customs_permission_ce_name)}
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

        <FormRow>
          <FormField
            control={control}
            name={"customs_permission_cust_name"}
            render={({ field }) => (
              <FormItem>
                <Label
                  size="sm"
                  required={
                    !schemaOptional(schema.customs_permission_cust_name)
                  }
                >
                  Митниця
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
            name={"customs_permission_gtd_type"}
            render={({ field }) => (
              <FormItem>
                <Label
                  size="sm"
                  required={!schemaOptional(schema.customs_permission_gtd_type)}
                >
                  Тип ВМД
                </Label>
                <FormControl className="col">
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="customs_permission_gtd_num"
            render={({ field }) => (
              <FormItem>
                <Label
                  size="xs"
                  required={!schemaOptional(schema.customs_permission_gtd_num)}
                >
                  Номер ВМД
                </Label>
                <FormControl className="col">
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="customs_permission_gtd_date"
            render={({ field }) => (
              <FormItem>
                <Label
                  size="xs"
                  required={!schemaOptional(schema.customs_permission_gtd_date)}
                >
                  Дата ВМД
                </Label>
                <FormControl className="col">
                  <DatePicker
                    fieldKey="customs_permission_gtd_date"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </FormRow>
      </FieldSet>
    </>
  );
}
