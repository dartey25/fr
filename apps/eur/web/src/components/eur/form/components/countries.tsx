import {
  Legend,
  FieldSet,
  FormRow,
  Input,
  FormField,
  FormItem,
  FormControl,
} from "@/ui";
import { CountryOption, options } from "./country-modal";
import { FormComponentProps } from "../schema";
import { useFormStore } from "../store";
import React from "react";

export function Countries({
  control,
  origCallBack,
  destCallBack,
}: FormComponentProps & {
  origCallBack: (option: CountryOption) => void;
  destCallBack: (option: CountryOption) => void;
}) {
  const { originCountry, destinationCountry } = useFormStore(
    (state) => state.structure,
  );
  const legendRef = React.useRef<HTMLLegendElement>(null);
  const fieldId1 = React.useId();
  const fieldId2 = React.useId();

  React.useEffect(() => {
    if (originCountry) {
      originCountry.ref = legendRef;
      originCountry.fieldId = fieldId1;
    }
    if (destinationCountry) {
      destinationCountry.ref = legendRef;
      destinationCountry.fieldId = fieldId2;
    }
  }, [legendRef, originCountry, fieldId1, fieldId2, destinationCountry]);

  return (
    <div className="row">
      <div className="col-sm-6">
        <Legend ref={legendRef}>
          4. Країна, група країн або територій, які вважаються країною
          походження
        </Legend>
        <FieldSet id="document-form-btw">
          <FormRow>
            <div className="col-9">
              <div className="row">
                <FormField
                  control={control}
                  name="orig_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl className="col-sm-3">
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="orig_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl className="col-sm-9">
                        <Input
                          withModal
                          modalOptions={options("orig", origCallBack)}
                          {...field}
                          id={fieldId1}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </FormRow>
        </FieldSet>
      </div>
      <div className="col-sm-6">
        <Legend>5. Країна, група країн або територій призначення</Legend>
        <FieldSet id="document-form-btw">
          <FormRow>
            <div className="col-9">
              <div className="row">
                <FormField
                  control={control}
                  name="dest_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl className="col-sm-3">
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="dest_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl className="col-sm-9">
                        <Input
                          withModal
                          modalOptions={options("dest", destCallBack)}
                          {...field}
                          id={fieldId2}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </FormRow>
        </FieldSet>
      </div>
    </div>
  );
}
