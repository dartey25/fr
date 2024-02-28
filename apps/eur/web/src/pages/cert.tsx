import { TFormSchema, THistory, defaultValues, formSchema } from "@/schema/eur";
import { Button } from "@/ui";
import { useModalStore } from "@/ui/modal/store/query";
import { useStatusModal } from "@/ui/modal/store/status";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  Link,
  useLoaderData,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Object as _Object } from "ts-toolbelt";
import {
  deleteCertificate,
  getIMFX,
  getPdf,
  handleDownload,
  saveCertificate,
  updateCertificate,
} from "../actions/cert";
import { Form } from "../components/eur/layout/form";
import { Sidebar } from "../components/eur/layout/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { router } from "../router";
import { TCertTab } from "../router/routes";
import { SignAndSend } from "./sign";
import { toast } from "sonner";

export type TCertData = _Object.Merge<
  TFormSchema,
  { id?: string; history?: THistory[] }
>;
interface ICert {
  certId?: string;
  data?: TCertData;
  search?: { tab?: TCertTab };
  isNewByExample?: boolean;
}

function Cert({ isNewByExample }: ICert) {
  const data = useLoaderData({ strict: false });
  const search = useSearch({ strict: false }) as {
    tab: TCertTab;
  };

  const { certId } = useParams({ strict: false });
  const { create: createStatusModal, setStatus } = useStatusModal();
  const { create: createModal } = useModalStore();
  const [tab, setTab] = useState<TCertTab>(search?.tab || "info");
  const onTabChange = (value: TCertTab) => {
    setTab(value);
    router.navigate({ search: { tab: value } });
  };
  const certificateDelete = useMutation({
    mutationFn: deleteCertificate,
  });

  const certificateCreator = useMutation({
    mutationFn: (values: TFormSchema) => saveCertificate(values),
  });

  const certificateUpdate = useMutation({
    mutationFn: (values: TFormSchema) => updateCertificate(values, certId!),
  });

  const onSubmit = async (values: TFormSchema) => {
    const mutant =
      certId && !isNewByExample ? certificateUpdate : certificateCreator;
    if (isNewByExample) {
      delete values.id;
    }
    createStatusModal({
      status: "pending",
      onSuccessCallback: () => {
        window.location.reload();
      },
      onCloseCallback: () => router.navigate({ to: "/" }),
    });
    try {
      await mutant.mutateAsync({ ...values });
      setStatus("success");
    } catch (error) {
      console.log(error);
      setStatus("error");
    }
  };

  const def = data ? data : defaultValues;

  const form = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: def,
  });

  const navigate = useNavigate({ from: "/cert" });

  return (
    <>
      <div className="navbar navbar-light navbar-expand-lg border-top-0">
        <div className="navbar-collapse">
          <div className="my-1 my-sm-2 my-lg-0">
            <Link to="/" from="/cert">
              <Button variant="light" icon="circle-left2" title="Назад" />
            </Link>
            <Button
              icon="floppy-disk"
              className="ml-2"
              onClick={() => {
                form.handleSubmit(onSubmit)();
              }}
            >
              Зберегти
            </Button>
            {certId && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button icon="menu" className="ml-2" variant="light" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-fit tw-z-[100]"
                  >
                    <DropdownMenuItem
                      onClick={() => {
                        router.navigate({
                          to: "/cert/new/$certId",
                          from: "/cert/$certId",
                          params: { certId },
                          search: { tab: "info" },
                        });
                      }}
                    >
                      <DropdownMenuShortcut className="tw-mr-2">
                        <i className="icon-copy3" />
                      </DropdownMenuShortcut>
                      Новий за зразком
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="tw-text-red-500 hover:tw-text-red-500"
                      onClick={() => {
                        certificateDelete.mutate(certId, {
                          onSuccess: () => {
                            toast.success("Видалено");
                            navigate({ to: "/" });
                          },
                          onError: () => {
                            toast.error("Помилка");
                          },
                        });
                      }}
                    >
                      <DropdownMenuShortcut className="tw-mr-2 ">
                        <i className="icon-trash" />
                      </DropdownMenuShortcut>
                      Видалити
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button icon="download4" className="ml-2" variant="light">
                      Вивантажити
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-fit tw-z-[100]"
                  >
                    <DropdownMenuItem
                      onClick={() =>
                        handleDownload(() => getPdf(certId, "empty"))
                      }
                    >
                      <DropdownMenuShortcut className="tw-mr-2 ">
                        <i className="icon-printer4" />
                      </DropdownMenuShortcut>
                      Друк на бланк
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleDownload(() => getPdf(certId, "blank"))
                      }
                    >
                      <DropdownMenuShortcut className="tw-mr-2 ">
                        <i className="icon-printer4" />
                      </DropdownMenuShortcut>
                      Друк на лист
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleDownload(() => getPdf(certId, "exp"))
                      }
                    >
                      <DropdownMenuShortcut className="tw-mr-2 ">
                        <i className="icon-printer4" />
                      </DropdownMenuShortcut>
                      Декларація експортера
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleDownload(() => getPdf(certId, "med"))
                      }
                    >
                      <DropdownMenuShortcut className="tw-mr-2 ">
                        <i className="icon-printer4" />
                      </DropdownMenuShortcut>
                      Декларація експортера EUR-MED
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDownload(() => getIMFX(certId))}
                    >
                      <DropdownMenuShortcut className="tw-mr-2 ">
                        <img
                          src="https://www.mdoffice.com.ua/md-eur1/images/imfx3_eur1@2x.png"
                          srcSet="https://www.mdoffice.com.ua/md-eur1/images/imfx3_eur1.png, https://www.mdoffice.com.ua/md-eur1/images/imfx3_eur1@2x.png 2x"
                          alt="icon"
                        />
                      </DropdownMenuShortcut>
                      Електронна копія (imfx)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  icon="paperplane"
                  className="ml-2"
                  variant="light"
                  onClick={() =>
                    createModal({
                      title: "Підписання та відправка",
                      contentFn: () => <SignAndSend certId={certId} />,
                    })
                  }
                >
                  Підписати та відправити
                </Button>
                <Button
                  icon="database-export"
                  className="ml-2"
                  variant="light"
                  disabled
                >
                  Перевірити повідомлення
                </Button>
              </>
            )}
          </div>
          <span className="navbar-text ml-lg-auto d-none d-lg-inline-block">
            &nbsp;
          </span>
        </div>
      </div>

      <div className="page-content">
        <Sidebar
          data={isNewByExample ? undefined : data?.history}
          tab={tab}
          changeTab={onTabChange}
        />

        {/* Form */}
        <Form
          form={form}
          onSubmit={onSubmit}
          certId={certId}
          tab={tab}
          onTabChange={onTabChange}
          isNewByExample={isNewByExample}
        />
      </div>
    </>
  );
}

export { Cert };
