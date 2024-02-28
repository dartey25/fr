import { Card, CardContent, CardFooter, Form, Button } from "@/ui";
import { DatabaseSetupForm, connectToDatabase } from "./database-setup-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TDatabaseSchema, databaseSchema } from "@/schema/eur/database";
import { useForm } from "react-hook-form";
// import { useRouter, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import { useState } from "react";
// import { useConfig } from "../store/config";

export default function DatabaseSetup(): JSX.Element {
  // const databaseConfig = useConfig((s) => s.database);
  const form = useForm<TDatabaseSchema>({
    resolver: zodResolver(databaseSchema),
    defaultValues: { provider: "postgresql" },
  });
  // const router = useRouter();
  // const search = useSearch({ strict: false }) as { redirect: string };
  const [loading, setLoading] = useState<boolean>(false);

  async function onSubmit(values: TDatabaseSchema) {
    if (!values.connectionUrl) {
      console.log(values)
      return toast.error("Відсутнє url підключення");
    }
    connectToDatabase(
      values,
      (response) => {
        if (response.connected) {
          null;
        }
        return response.message;
      },
      (e) => {
        return e;
      },
      () => setLoading(false),
    );
  }

  return (
    <div className="tw-flex tw-mt-[7%] tw-justify-center tw-h-full">
      <Card className="tw-w-fit tw-h-fit tw-min-w-[500px] tw-px">
        <Form {...form}>
          <CardContent className="tw-px-8">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="tw-mb-4">
                <h3 className="tw-font-medium tw-mb-0 tw-text-[15px]">
                  Налаштування бази даних
                </h3>
              </div>

              <DatabaseSetupForm form={form} />
            </form>
          </CardContent>

          <CardFooter className="tw-flex tw-justify-end">
            <Button
              onClick={() =>
                onSubmit({
                  provider: "postgresql",
                  connectionUrl:
                    "postgresql://postgres:root@localhost:5432/mdweb",
                  database: "mdweb",
                  host: "localhost",
                  password: "root",
                  port: 5432,
                  username: "postgres",
                })
              }
              disabled={loading}
              variant="light"
              className="tw-mr-2"
              title="Пропустити та використовувати налаштування по замовчуванню. Пізніше це можна змінити"
            >
              Пропустити
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={loading}>
              Зберегти
            </Button>
          </CardFooter>
        </Form>
      </Card>
    </div>
  );
}
