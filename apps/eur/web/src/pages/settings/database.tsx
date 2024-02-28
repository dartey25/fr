import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  Input,
  Label,
} from "@/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TDatabaseSchema, databaseSchema } from "@/schema/eur/database";
import {
  DatabaseSetupForm,
  connectToDatabase,
} from "../../components/database-setup-form";
import { useConfig } from "../../store/config";
import { useState } from "react";
import { toast } from "sonner";
import { axios } from "../../utils/axios";

export function Database() {
  const [loading, setLoading] = useState<boolean>(false);
  const onSubmit = (values: TDatabaseSchema) => {
    connectToDatabase(
      values,
      (response) => response.message,
      (e) => {
        console.error(e);
        return e.response?.data?.message ?? 'Помилка';
      },
      () => setLoading(false),
    );
  };

  const databaseConfig = useConfig((s) => s.database);

  const form = useForm<TDatabaseSchema>({
    resolver: zodResolver(databaseSchema),
    defaultValues: databaseConfig,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DatabaseSetupForm form={form} />

        <div className="tw-space-y-3 tw-mb-2">
          <legend className="tw-text-base tw-font-semibold tw-text-gray-700 tw-mb-4 tw-mt-4">
            Резевне копіювання
          </legend>

          <FormField
            control={form.control}
            name="backUpPath"
            render={({ field }) => (
              <FormItem>
                <div className="tw-flex tw-items-center ">
                  <Label className="!tw-p-0 !tw-max-w-md !tw-flex-1 !tw-text-start">
                    Шлях до збереження резервної копії
                  </Label>
                </div>
                <FormControl>
                  <Input {...field} readOnly />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="tw-w-full tw-flex tw-mt-8">
          <div className="tw-ml-auto tw-flex tw-gap-x-1">
            <Button
              disabled={loading}
              onClick={(ev) => {
                ev.preventDefault();
                toast.promise(
                  axios.get("database/backup").then((r) => r.data),
                  {
                    loading: "Триває резервне копіювання...",
                    success: "Успішно створено резервну копію",
                    error: "Помилка створення резервної копії",
                  },
                );
              }}
              variant="light"
            >
              Зробити резервну копію
            </Button>
            <Button
              disabled={loading}
              onClick={(ev) => {
                ev.preventDefault();
                toast.promise(
                  axios.get("database/restore").then((r) => r.data),
                  {
                    loading: "Триває відновлення бази даних...",
                    success: "Успішно відновлено базу даних",
                    error: "Помилка відновлення бази даних",
                  },
                );
              }}
              variant="light"
            >
              Відновити з копії
            </Button>
            <Button
              disabled={loading}
              onClick={form.handleSubmit(onSubmit)}
              className="tw-ml-auto"
            >
              Зберегти
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
