import { useContext, useEffect, useState } from "react";
import eusignContext from "./eusign-context";
import {
  ERROR_NO_SIGN,
  ERROR_SIGN,
  ERROR_UNKNOWN,
  ERROR_URL_INIT,
  ERROR_URL_SAVE,
  PROCESS_STATUS_SIGN_FILE,
} from "./constants";
import { axios } from "../../utils/axios";
import { ProcessContainer } from "./process-container";
import { TPackageListBase64, UploadSaveRequestBody } from "@/shared-types";

export function SignPage(props: {
  onResetClick: () => void;
  onSign: (packageId: string) => void;
  certId: string;
}) {
  const { euSign } = useContext(eusignContext);

  const [loaderText, setLoaderText] = useState<string>();
  const [error, setError] = useState<string>();

  const signFile = async () => {
    try {
      if (!euSign) throw ERROR_URL_INIT;
      setLoaderText(PROCESS_STATUS_SIGN_FILE);
      const signature = await euSign?.SignData("1", true, true);
      if (signature) {
        const _package = await axios
          .post<TPackageListBase64>("upload/init", {
            certId: props.certId,
            signature: signature,
          })
          .then((r) => r.data)
          .catch((e) => {
            throw ERROR_URL_INIT;
          });

        console.log(_package);

        await Promise.all(
          _package.files.map(async (file) => {
            try {
              const content = await euSign.BASE64Decode(file.content);
              const signData = await euSign.SignData(content, true, true);

              if (!signData) throw ERROR_SIGN;

              file.sign = signData;
            } catch (e) {
              console.error(e);
              throw ERROR_SIGN;
            }
          }),
        );

        console.log(_package);

        const savePayload: UploadSaveRequestBody = {
          packageId: _package.id,
          signs: _package.files.map((file) => {
            return {
              field: file.field,
              fileId: file.fileId,
              sign: file.sign as string,
            };
          }),
        };

        await axios.post("api/upload/save", savePayload).catch((e) => {
          throw ERROR_URL_SAVE;
        });

        props.onSign(_package.id);
      } else {
        throw ERROR_NO_SIGN;
      }
    } catch (e) {
      setLoaderText(undefined);
      setError(e ? e.toString() : ERROR_UNKNOWN);
    }
  };

  useEffect(() => {
    signFile();
    return () => {};
  }, []);

  useEffect(() => {
    if (loaderText) {
      setError(undefined);
    }
  }, [loaderText]);

  // useEffect(() => {
  //   if (result) {
  //     // window.electron.ipcRenderer.send("save-this", result, props.file?.name + ".p7s");
  //     const file: FileInterface = {
  //       content: result,
  //       name:
  //         (typeof props.file === "string" ? "some_name" : props.file?.name) +
  //         ".p7s",
  //       size: result.length,
  //     };
  //     props.onSign(file);
  //   }
  // }, [result]);

  return (
    <ProcessContainer
      loaderText={loaderText}
      statusText={error}
      statusError={error != null}
      prevText={"Назад"}
      onPrevClick={props.onResetClick}
    ></ProcessContainer>
  );
}
