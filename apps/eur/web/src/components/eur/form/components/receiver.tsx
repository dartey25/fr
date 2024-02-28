import {
  Legend,
  FieldSet,
  FormRow,
  Label,
  Input,
  FormItem,
  FormField,
  FormControl,
} from "@/ui";
import { FormComponentProps } from "../schema";
import { schemaOptional } from "../../../../utils";
import { CountryOption, options } from "./country-modal";
import { useFormStore } from "../store";
import React from "react";

export function Receiver({
  control,
  schema,
  callBack,
}: FormComponentProps & { callBack: (option: CountryOption) => void }) {
  const { receiver } = useFormStore((state) => state.structure);
  const legendRef = React.useRef<HTMLLegendElement>(null);
  const fieldId = React.useId();

  React.useEffect(() => {
    if (receiver) {
      receiver.ref = legendRef;
      receiver.fieldId = fieldId;
    }
  }, [legendRef, receiver, fieldId]);
  return (
    <>
      <Legend ref={legendRef}>3. Вантажоодержувач</Legend>
      <FieldSet>
        <FormRow>
          <FormField
            control={control}
            name="destination_eori"
            render={({ field }) => (
              <FormItem>
                <Label required={!schemaOptional(schema.destination_eori)}>
                  Код EORI або акредитації митниці
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
            name="destination_name"
            render={({ field }) => (
              <FormItem>
                <Label required={!schemaOptional(schema.destination_name)}>
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
            name="destination_address"
            render={({ field }) => (
              <FormItem>
                <Label required={!schemaOptional(schema.destination_address)}>
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
          <Label required={!schemaOptional(schema.destination_cnt)}>
            Країна (код, назва)
          </Label>
          <div className="col-5">
            <div className="row">
              <FormField
                control={control}
                name="destination_cnt"
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
                name="destination_country"
                render={({ field }) => (
                  <FormItem>
                    <FormControl className="col-9">
                      <Input
                        withModal
                        modalOptions={options("dst", callBack)}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </FormRow>
      </FieldSet>
    </>
  );
}
