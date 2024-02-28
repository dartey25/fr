import { axios } from "../utils/axios";
import { AxiosResponse } from "axios";
import { TFormSchema } from "@/schema/eur";
import { toast } from "sonner";

async function getCertificates(options: {
  pageIndex: number;
  pageSize: number;
}) {
  const response = await axios.get(
    `api/cert?page=${options.pageIndex}&limit=${options.pageSize}`,
  );
  return response.data;
}

async function getCertificate(certId: string) {
  const response = await axios.get(`api/cert/${certId}`);
  return response.data;
}

async function saveCertificate(newCertificate: Record<string, any>) {
  const response = await axios.post("api/cert", newCertificate, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
}

async function updateCertificate(newCertificate: TFormSchema, id: string) {
  const response = await axios.patch<TFormSchema>(
    `api/cert/${id}`,
    newCertificate,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
}

async function deleteCertificate(certId: string) {
  const response = await axios.delete(`api/cert/${certId}`);
  return response.data;
}

function getPdf(certId: string, type: "empty" | "blank" | "exp" | "med") {
  return axios.get(`api/cert/pdf/${certId}/${type}`, { responseType: "blob" });
}

function getIMFX(certId: string) {
  return axios.get(`api/cert/imfx/${certId}`, { responseType: "blob" });
}

async function handleDownload(request: () => Promise<AxiosResponse>) {
  toast.promise(request, {
    loading: "Завантаження...",
    success: (response) => {
      const { data, headers } = response;

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      const type =
        /application\/(.+)/.exec(headers["content-type"] ?? "")?.[1] || ".pdf";
      const fileName =
        /filename="([^"]+)"/.exec(headers["content-disposition"] ?? "")?.[1] ||
        "cert." + type;
      a.download = fileName;

      function handleClick() {
        setTimeout(() => {
          URL.revokeObjectURL(url);
          a.removeEventListener("click", handleClick);
        }, 150);
      }

      a.addEventListener("click", handleClick);
      a.click();
      return "Успішно завантажено " + fileName;
    },
    error: () => "Помилка завантаження",
  });
}

export {
  getCertificates,
  getCertificate,
  saveCertificate,
  deleteCertificate,
  updateCertificate,
  getPdf,
  getIMFX,
  handleDownload,
};
