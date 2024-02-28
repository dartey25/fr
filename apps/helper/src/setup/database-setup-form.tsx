import { TDatabaseSchema } from "@/schema/eur/database";
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, Input, Label } from "@/ui";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { invoke } from "@tauri-apps/api/tauri";

function makeConnector(
  type: string,
  host: string,
  port: number,
  user: string,
  password: string,
  database: string,
) {
  return `${type}://${user}:${password}@${host}:${port}/${database}`;
}

export function connectToDatabase(
  values: TDatabaseSchema,
  onSuccess: (response: { connected: boolean; message: string }) => string,
  onError: (e: any) => string,
  onFinally: () => void,
  backUp?: boolean,
) {
  // let isError: boolean = false;
  // if (backUp) {
  // toast.promise(
  //   invoke('connect', values),
  //   {
  //     loading: "Триває резервне копіювання...",
  //     success: "Успішно",
  //     error: () => {
  //       isError = true;
  //       return "Помилка резервного копіювання. Далі процес неможливий";
  //     },
  //     finally: () => {
  //       if (!isError) {
  //         toast.promise(
  //           axios
  //             .post("database/connect", values, { timeout: 60000 })
  //             .then((r) => r.data),
  //           {
  //             loading: "Триває підключення...",
  //             success: onSuccess,
  //             error: onError,
  //             finally: onFinally,
  //           },
  //         );
  //       }
  //     },
  //   },
  // );
  // } else {
  toast.promise(
    invoke<{ connected: boolean; message: string }>("connect_to_database", values),
    {
      loading: "Триває підключення...",
      success: onSuccess,
      error: onError,
      finally: onFinally,
    },
  );
}

export function DatabaseSetupForm(props: {
  form: UseFormReturn<TDatabaseSchema>;
}) {
  const [host, setHost] = useState<string | undefined>(
    props.form.getValues().host,
  );
  const [port, setPort] = useState<number | undefined>(
    props.form.getValues().port,
  );
  const [username, setUsername] = useState<string | undefined>(
    props.form.getValues().username,
  );
  const [password, setPassword] = useState<string | undefined>(
    props.form.getValues().password,
  );
  const [database, setDatabase] = useState<string | undefined>(
    props.form.getValues().database,
  );

  useEffect(() => {
    const setConnectionUrl = (
      host?: string,
      port?: number,
      username?: string,
      password?: string,
      database?: string,
    ) => {
      if (host && port && username && password && database) {
        props.form.setValue(
          "connectionUrl",
          makeConnector(
            props.form.getValues().provider,
            host,
            port,
            username,
            password,
            database,
          ),
        );
      }
    };

    setConnectionUrl(host, port, username, password, database);
  }, [host, port, username, password, database, props.form]);
  return (
    <div className="tw-space-y-3 tw-mb-2">
      <FormField
        control={props.form.control}
        name="provider"
        render={({ field }) => (
          <FormItem>
            <div className="tw-flex tw-items-center ">
              <Label className="!tw-p-0 !tw-max-w-md !tw-flex-1 !tw-text-start">
                Провайдер
              </Label>
            </div>
            <FormControl>
              <Input {...field} readOnly />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={props.form.control}
        name="host"
        render={({ field }) => (
          <FormItem>
            <Label
              className="!tw-p-0 !tw-max-w-md"
              required
              requiredPos="right"
            >
              Хост
            </Label>
            <FormControl>
              <Input
                {...field}
                onChange={(ev) => {
                  field.onChange(ev);
                  setHost(ev.currentTarget.value);
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={props.form.control}
        name="port"
        render={({ field }) => (
          <FormItem>
            <Label
              className="!tw-p-0 !tw-max-w-md"
              required
              requiredPos="right"
            >
              Порт
            </Label>
            <FormControl>
              <Input
                {...field}
                onChange={(ev) => {
                  field.onChange(ev);
                  setPort(Number(ev.currentTarget.value));
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={props.form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <Label
              className="!tw-p-0 !tw-max-w-md"
              required
              requiredPos="right"
            >
              Користувач
            </Label>
            <FormControl>
              <Input
                {...field}
                onChange={(ev) => {
                  field.onChange(ev);
                  setUsername(ev.currentTarget.value);
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={props.form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <Label
              className="!tw-p-0 !tw-max-w-md"
              required
              requiredPos="right"
            >
              Пароль
            </Label>
            <FormControl>
              <Input
                {...field}
                onChange={(ev) => {
                  field.onChange(ev);
                  setPassword(ev.currentTarget.value);
                }}
                type="password"
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={props.form.control}
        name="database"
        render={({ field }) => (
          <FormItem>
            <Label
              className="!tw-p-0 !tw-max-w-md"
              required
              requiredPos="right"
            >
              База даних
            </Label>
            <FormControl>
              <Input
                {...field}
                onChange={(ev) => {
                  field.onChange(ev);
                  setDatabase(ev.currentTarget.value);
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={props.form.control}
        name="connectionUrl"
        render={({ field }) => (
          <FormItem>
            <Label
              className="!tw-p-0 !tw-max-w-md"
              required
              requiredPos="right"
            >
              URL підключення
            </Label>
            <FormControl>
              <Input
                {...field}
                readOnly
                placeholder="Заповніть поля вище для генерування url на підключення"
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
