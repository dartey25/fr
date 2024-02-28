import {
  Label,
  Input,
  Button,
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  CardContent,
  CardFooter,
} from "@/ui";
import { Clipboard } from "@/ui/clipboard";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TToken, tokenSchema } from "@/schema/eur/license";
import { TTabProps } from "./license";
import { useEffect, useState } from "react";
import { Checkbox } from "@/ui/checkbox";
import { axios } from "../../utils/axios";
import { toast } from "sonner";

export function Token(props: TTabProps) {
  const tokenForm = useForm<TToken>({
    resolver: zodResolver(tokenSchema),
    defaultValues: {
      token: props.values?.license?.token,
      terms: props.values?.license?.terms,
    },
  });
  const [hwidErr, setHwidErr] = useState<boolean>(false);

  const onSubmit = (v: TToken) => {
    props.onSubmit(v);
    props.onNext && props.onNext();
  };

  useEffect(() => {
    const getHWID = async () => {
      const id = await axios
        .get("/license/hwid")
        .then((r) => r.data)
        .then((data) => data.hwid)
        .catch((e) => {
          setHwidErr(true);
          toast.error(
            "Помилка отримання ідентифікатора комп'ютера. Активація продукту неможлива",
          );
        });
      setHwidErr(false);
      tokenForm.setValue("hwid", id);
    };
    getHWID();
  });

  return (
    <Form {...tokenForm}>
      <CardContent className="tw-px-8">
        <form onSubmit={tokenForm.handleSubmit(onSubmit)}>
          <div className="tw-mb-4">
            <h3 className="tw-font-medium tw-mb-0 tw-text-[15px]">
              Введіть ключ ліцензії
            </h3>
          </div>

          <div className="tw-space-y-3 tw-mb-2">
            <FormField
              control={tokenForm.control}
              name="hwid"
              render={({ field }) => (
                <FormItem>
                  <div className="tw-flex tw-items-center ">
                    <Label className="!tw-p-0 !tw-max-w-md !tw-flex-1 !tw-text-start">
                      Ваш ID комп&apos;ютера
                    </Label>
                    <Clipboard
                      content={tokenForm.getValues().hwid?.toString()}
                      onClick={() => {
                        navigator.clipboard.writeText(
                          tokenForm.getValues().hwid?.toString(),
                        );
                        toast.success("Успішно скопійовано");
                      }}
                    />
                  </div>
                  <FormControl>
                    <Input {...field} readOnly />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={tokenForm.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <Label
                    htmlFor="license-key"
                    className="!tw-p-0 !tw-max-w-md"
                    required
                    requiredPos="right"
                  >
                    Ключ ліцензії
                  </Label>
                  <FormControl>
                    <Input
                      id="license-key"
                      mask="XXXX-XXXX-XXXX-XXXX"
                      placeholder="XXXX-XXXX-XXXX-XXXX"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={tokenForm.control}
              name="terms"
              render={({ field }) => (
                <FormItem>
                  <div className="tw-flex tw-items-center tw-space-x-2 tw-mt-4">
                    <FormControl noMessage>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="terms"
                      />
                    </FormControl>
                    <label
                      htmlFor="terms"
                      className="tw-text-sm tw-leading-none peer-disabled:tw-cursor-not-allowed peer-disabled:tw-opacity-70"
                    >
                      Прийняти умови користування
                    </label>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </CardContent>

      <CardFooter className="tw-flex tw-justify-end">
        <Button disabled={hwidErr} onClick={tokenForm.handleSubmit(onSubmit)}>
          Далі
        </Button>
      </CardFooter>
    </Form>
  );
}
