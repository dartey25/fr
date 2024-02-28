import {
  Legend,
  FieldSet,
  FormRow,
  Textarea,
  FormField,
  FormItem,
  FormControl,
} from "@/ui";
import { FormComponentProps } from "../schema";
import { useFormStore } from "../store";
import React from "react";

export function Notes({ control }: FormComponentProps) {
  const { transport, remark } = useFormStore((state) => state.structure);
  const legendRef = React.useRef<HTMLLegendElement>(null);
  const fieldId1 = React.useId();
  const fieldId2 = React.useId();

  React.useEffect(() => {
    if (transport) {
      transport.ref = legendRef;
      transport.fieldId = fieldId1;
    }
    if (remark) {
      remark.ref = legendRef;
      remark.fieldId = fieldId2;
    }
  }, [legendRef, remark, fieldId1, fieldId2, transport]);
  return (
    <div className="row">
      <div className="col-sm-6">
        <Legend>6. Особливості транспортування</Legend>
        <FieldSet>
          <FormRow>
            <FormField
              control={control}
              name="transport"
              render={({ field }) => (
                <FormItem>
                  <FormControl className="col-12">
                    <Textarea {...field} id={fieldId1} />
                  </FormControl>
                </FormItem>
              )}
            />
          </FormRow>
        </FieldSet>
      </div>
      <div className="col-sm-6">
        <Legend>7. Зауваження</Legend>
        <FieldSet>
          <FormRow>
            <FormField
              control={control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormControl className="col-12">
                    <Textarea {...field} id={fieldId2} />
                  </FormControl>
                </FormItem>
              )}
            />
          </FormRow>
        </FieldSet>
      </div>
    </div>
  );
}
