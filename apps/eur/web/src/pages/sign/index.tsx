import { TCustomsInfo, customsInfoSchema } from "@/schema/eur/customs";
import { zodResolver } from "@hookform/resolvers/zod";
import { EUSignCPFrontend } from "md-sign";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CustomsInfoPage } from "./customs-info-page";
import EUSignContext from "./eusign-context";
import { PKPage } from "./pk-page";
import { ProcessContainer } from "./process-container";
import { SignPage } from "./sign-page";

type TPk = {
  privateKey: Uint8Array;
};

export function SignAndSend(props: { certId: string }) {
  const [euSign, setEUSign] = useState<EUSignCPFrontend>();
  const [pk, setPK] = useState<TPk>();
  const [packageId, setPackageId] = useState<string>();

  const resetForm = () => {
    setPK(undefined);
    setPackageId(undefined);
  };

  const form = useForm<TCustomsInfo>({
    resolver: zodResolver(customsInfoSchema),
  });

  useEffect(() => {}, [pk]);

  return (
    <EUSignContext.Provider value={{ euSign, setEUSign }}>
      {euSign == null && <LoaderPage />}
      {euSign && !pk && <PKPage onRead={(PKey) => setPK(PKey)} />}
      {euSign && pk && !packageId && (
        <SignPage
          onResetClick={() => {
            resetForm();
            console.info("SignPage.reset");
          }}
          onSign={(packageId) => {
            setPackageId(packageId);
          }}
          certId={props.certId}
        />
      )}
      {packageId && (
        <CustomsInfoPage
          onPrev={() => {
            resetForm();
            console.info("FileToSignPage.prev");
          }}
          form={form}
          packageId={packageId}
        />
      )}
    </EUSignContext.Provider>
  );
}

function LoaderPage() {
  const { setEUSign } = useContext(EUSignContext);

  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState();

  useEffect(() => {
    const initLibrary = () => {
      setLoading(true);
      setErrorText(undefined);

      const library = new EUSignCPFrontend();

      library
        .loadLib()
        .then(() => library.initLib())
        .then(() => {
          setLoading(false);
          setEUSign(library);
        })
        .catch((error) => {
          setLoading(false);
          setErrorText(
            error.toString().replace("http://iit.com.ua", "https://iit.com.ua"),
          );
          console.error(error);
        });
    };

    initLibrary();
    return () => {};
  }, [setEUSign]);

  return (
    <ProcessContainer
      loaderText={loading ? "Ініціалізація криптографічної бібліотеки" : null}
      statusText={errorText}
      statusError={true}
    ></ProcessContainer>
  );
}
