import {
  Card,
  CardHeader,
  CardTitle,
  Content,
  Form as CoreForm,
  ScrollArea,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/ui";
import {
  AddDocs,
  CertificateUse,
  Countries,
  CustomsPermission,
  ExportDeclaration,
  Exporter,
  GeneralInfo,
  Goods,
  Notes,
  ReceiveForm,
  Receiver,
} from "../form/components";
import { CountryOption } from "../form/components/country-modal";
import { TFormSchema, formSchema } from "@/schema/eur";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { TCertTab } from "../../../router/routes";

export function Form({
  form,
  onSubmit,
  certId,
  tab,
  onTabChange,
  isNewByExample,
}: {
  form: UseFormReturn<TFormSchema, any, undefined>;
  onSubmit: (values: TFormSchema) => Promise<void>;
  certId?: string;
  tab: TCertTab;
  onTabChange: (v: TCertTab) => void;
  isNewByExample?: boolean;
}) {
  const ref = React.useRef<HTMLFormElement>(null);
  return (
    <ScrollArea className="tw-w-full">
      <Content>
        <Card>
          <Tabs value={tab} onValueChange={(v) => onTabChange(v as TCertTab)}>
            <CardHeader className="pb-0 pt-sm-0 pr-sm-0">
              <CardTitle>
                <b>Сертифікати EUR.1</b> -{" "}
                {isNewByExample
                  ? "Створення за зразком"
                  : certId
                    ? "Редагування"
                    : "Створення"}
              </CardTitle>
              <div className="header-elements ">
                <TabsList className="nav-tabs-bottom card-header-tabs mx-0">
                  <TabsTrigger
                    value="info"
                    triggerVariant="crimson"
                    textVariant="crimson"
                  >
                    Інформація для EUR.1
                  </TabsTrigger>
                  <TabsTrigger
                    value="receive"
                    triggerVariant="crimson"
                    textVariant="crimson"
                  >
                    Заява на отримання
                  </TabsTrigger>
                  <TabsTrigger
                    value="documents"
                    triggerVariant="crimson"
                    textVariant="crimson"
                  >
                    Прикладені документи
                  </TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CoreForm {...form}>
              <form
                ref={ref}
                className="mb-0 px-2 py-3 mocha"
                onSubmit={(ev) => {
                  ev.preventDefault();
                  form.handleSubmit(onSubmit);
                }}
              >
                <TabsContent value="info">
                  <GeneralInfo
                    control={form.control}
                    schema={formSchema.shape}
                  />
                  <Exporter control={form.control} schema={formSchema.shape} />
                  <CertificateUse
                    control={form.control}
                    schema={formSchema.shape}
                    callBack={(option: CountryOption) => {
                      form.setValue("btw2_code", option.code);
                      form.setValue("btw2_name", option.name_en);
                    }}
                  />
                  <Receiver
                    control={form.control}
                    schema={formSchema.shape}
                    callBack={(option: CountryOption) => {
                      form.setValue("destination_cnt", option.code);
                      form.setValue("destination_country", option.name_en);
                    }}
                  />
                  <Countries
                    control={form.control}
                    schema={formSchema.shape}
                    origCallBack={(option: CountryOption) => {
                      form.setValue("orig_code", option.code);
                      form.setValue("orig_name", option.name_en);
                    }}
                    destCallBack={(option: CountryOption) => {
                      form.setValue("dest_code", option.code);
                      form.setValue("dest_name", option.name_en);
                    }}
                  />
                  <Notes control={form.control} schema={formSchema.shape} />
                  <Goods control={form.control} schema={formSchema.shape} />
                  <CustomsPermission
                    control={form.control}
                    schema={formSchema.shape}
                  />
                  <ExportDeclaration
                    control={form.control}
                    schema={formSchema.shape}
                  />
                </TabsContent>
                <TabsContent value="receive">
                  <ReceiveForm
                    control={form.control}
                    schema={formSchema.shape}
                  />
                </TabsContent>
                <TabsContent value="documents">
                  <AddDocs control={form.control} schema={formSchema.shape} />
                </TabsContent>
              </form>
            </CoreForm>
          </Tabs>
        </Card>
      </Content>
    </ScrollArea>
  );
}
