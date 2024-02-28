import {
  Legend,
  FieldSet,
  FormRow,
  Label,
  Input,
  Textarea,
  DatePicker,
  FormField,
  FormItem,
  FormControl,
} from "@/ui";
import { FormComponentProps } from "../schema";
import { useFormStore } from "../store";
import React from "react";

export function ReceiveForm({ control }: FormComponentProps) {
  const { receiveForm } = useFormStore((state) => state.structure);
  const legendRef = React.useRef<HTMLLegendElement>(null);
  const fieldId = React.useId();

  React.useEffect(() => {
    if (receiveForm) {
      receiveForm.ref = legendRef;
      receiveForm.fieldId = fieldId;
    }
  }, [legendRef, receiveForm, fieldId]);
  return (
    <>
      <Legend ref={legendRef}>Заява на отримання</Legend>
      <FieldSet>
        <FormRow>
          <Label>
            Обставини, які дозволили товарам відповідати зазначеним вище умовам
          </Label>
          <FormField
            control={control}
            name="receive_form_conditions"
            render={({ field }) => (
              <FormItem>
                <FormControl className="col">
                  <Textarea rows={5} {...field} id={fieldId} />
                </FormControl>
              </FormItem>
            )}
          />
        </FormRow>
        <FormRow>
          <Label>Документи, що додаються до заяви</Label>
          <FormField
            control={control}
            name="receive_form_docs"
            render={({ field }) => (
              <FormItem>
                <FormControl className="col">
                  <Textarea rows={5} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </FormRow>
        <FormRow>
          <Label>Місце заяви</Label>
          <FormField
            control={control}
            name="receive_form_app_place"
            render={({ field }) => (
              <FormItem>
                <FormControl className="col">
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </FormRow>
        <FormRow>
          <Label>Дата заяви</Label>
          <FormField
            control={control}
            name="receive_form_app_date"
            render={({ field }) => (
              <FormItem>
                <FormControl className="col">
                  <DatePicker fieldKey="receive_form_app_date" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </FormRow>
        <FormRow>
          <Label>Подавач заяви</Label>
          <FormField
            control={control}
            name="receive_form_app_fio"
            render={({ field }) => (
              <FormItem>
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
