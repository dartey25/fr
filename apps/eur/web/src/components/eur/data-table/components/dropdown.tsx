import {
  deleteCertificate,
  getIMFX,
  getPdf,
  handleDownload,
} from "../../../../actions/cert";
import { Button } from "@/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import queryClient from "../../../../utils/query-client";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

export function Dropdown(props: { id: string }) {
  const navigate = useNavigate({ from: "/" });
  const certificateDelete = useMutation({
    mutationFn: deleteCertificate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificate-list"] });
    },
  });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="light" icon="menu" className="!tw-text-gray-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-fit">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() =>
              navigate({
                to: "/cert/$certId",
                params: { certId: props.id },
                search: { tab: "info" },
              })
            }
          >
            Правка
            <DropdownMenuShortcut className="tw-ml-auto">
              <i className="icon-pencil" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              navigate({
                to: "/cert/new/$certId",
                params: { certId: props.id },
                search: { tab: "info" },
              })
            }
          >
            Новий за зразком
            <DropdownMenuShortcut className="tw-ml-auto">
              <i className="icon-copy3" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleDownload(() => getPdf(props.id, "empty"))}
        >
          Друк на бланк
          <DropdownMenuShortcut className="tw-ml-auto">
            <i className="icon-printer4" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleDownload(() => getPdf(props.id, "blank"))}
        >
          Друк на лист
          <DropdownMenuShortcut className="tw-ml-auto">
            <i className="icon-printer4" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => handleDownload(() => getPdf(props.id, "exp"))}
          >
            Декларація експортера
            <DropdownMenuShortcut className="tw-ml-auto">
              <i className="icon-printer4" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleDownload(() => getPdf(props.id, "med"))}
          >
            Декларація експортера EUR-MED
            <DropdownMenuShortcut className="tw-ml-auto">
              <i className="icon-printer4 tw-ml-4" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleDownload(() => getIMFX(props.id))}
        >
          Електронна копія (imfx)
          <DropdownMenuShortcut className="tw-ml-auto">
            <img
              src="https://www.mdoffice.com.ua/md-eur1/images/imfx3_eur1@2x.png"
              srcSet="https://www.mdoffice.com.ua/md-eur1/images/imfx3_eur1.png, https://www.mdoffice.com.ua/md-eur1/images/imfx3_eur1@2x.png 2x"
            />
          </DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="tw-text-red-500 hover:tw-text-red-500"
          onClick={() => {
            certificateDelete.mutate(props.id);
          }}
        >
          Видалити
          <DropdownMenuShortcut className="tw-ml-auto">
            <i className="icon-trash" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
