import { TCustomsInfo } from "@/schema/eur/customs";
import { TEndpointSendBody } from "@/shared-types";
import { UseFormReturn } from "react-hook-form";
import { ERROR_UNKNOWN, PROCESS_STATUS_SEND } from "./constants";
import { useEffect, useState } from "react";
import { axios } from "../../utils/axios";
import defaultAxios, { AxiosError } from "axios";
import { ProcessContainer } from "./process-container";
import {
  Combobox,
  Form,
  FormControl,
  FormField,
  FormItem,
  Input,
  Label,
  TOption,
} from "@/ui";
import { handleDownload } from "../../actions/cert";

type TEndpointData = {
  code: string;
  name: string;
  note?: string;
};

type TEndpointResponse = {
  ok: boolean;
  endpont: TEndpointData[];
};

function makeEndpointOptions(data: TEndpointData[]): TOption[] {
  if (!data || !data.length) return [];
  return data.map((item: TEndpointData) => {
    return {
      key: item.code,
      value: item.name,
    };
  });
}

export function CustomsInfoPage(props: {
  onPrev: () => void;
  form: UseFormReturn<TCustomsInfo>;
  packageId: string;
}) {
  const [loaderText, setLoaderText] = useState<string>();
  const [status, setStatus] = useState<string>();
  const [statusError, setStatusError] = useState<boolean>();
  const [endpointData, setEndpointData] = useState<TEndpointData[]>([]);

  useEffect(() => {
    defaultAxios
      .get<TEndpointResponse>(
        "https://www.mdoffice.com.ua/ua/eur1.cert.api_endpoint_list",
      )
      .then((r) => r.data)
      .then((data) => data.endpont)
      .then((endpointData) => setEndpointData(endpointData))
      .catch(console.log);
  }, [setEndpointData]);

  const onSubmit = async (values: TCustomsInfo) => {
    setLoaderText(PROCESS_STATUS_SEND);
    try {
      const payload: TEndpointSendBody = {
        id: "1",
        packageId: props.packageId,
        senderEmail: values.email,
        recipient: values.custCode,
        senderName: values.name,
      };

      // handleDownload(() =>
      //   axios.post("api/endpoint/send", payload, { responseType: "blob" }),
      // );

      const response = await axios
        .post("/endpoint/send", payload)
        .then((r) => r.data);
      setLoaderText(undefined);
      setStatus(response);
    } catch (error) {
      setLoaderText(undefined);
      if (error instanceof AxiosError) {
        setStatus(error ? error.response?.data.message : ERROR_UNKNOWN);
      } else {
        setStatus(error ? error.toString() : ERROR_UNKNOWN);
      }

      setStatusError(true);
    }
  };

  return (
    <ProcessContainer
      loaderText={loaderText}
      statusText={status}
      statusError={statusError}
      prevText={"Назад"}
      onPrevClick={props.onPrev}
      nextText={"Відправити"}
      onNextClick={props.form.handleSubmit(onSubmit)}
    >
      <Form {...props.form}>
        <form onSubmit={(e) => e.preventDefault}>
          <FormField
            control={props.form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="form-group row mb-2">
                  <Label
                    className="col-form-label col-sm-3 text-right"
                    required
                  >
                    Email відправника
                  </Label>
                  <FormControl className="col-sm-9">
                    <Input {...field} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={props.form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <div className="form-group row mb-2">
                  <Label
                    className="col-form-label col-sm-3 text-right"
                    required
                  >
                    ПІБ відправника
                  </Label>
                  <FormControl className="col-sm-9">
                    <Input {...field} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={props.form.control}
            name="custCode"
            render={({ field }) => (
              <FormItem>
                <div className="form-group row mb-2">
                  <Label className="col-form-label col-sm-3 text-right">
                    Код розділу митного оформлення
                  </Label>
                  <FormControl className="col-sm-9">
                    <Input {...field} />

                    {/* <Combobox<TCustomsInfo>
                      text={{
                        placeholder: "Код розділу",
                        notFound: "Розділ відсутній",
                      }}
                      values={makeEndpointOptions(endpointData)}
                      formPath="custCode"
                    /> */}
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </ProcessContainer>
  );
}
