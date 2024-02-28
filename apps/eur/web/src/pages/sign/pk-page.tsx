import { useContext, useEffect, useState } from "react";
import { ProcessContainer } from "./process-container";
import {
  ERROR_NO_KEYMEDIA,
  ERROR_UNKNOWN,
  PROCESS_STATUS_READ_PRIVATE_KEY,
} from "./constants";
import eusignContext from "./eusign-context";

export function PKPage(props: { onRead: (readedPKey: any) => void }) {
  const { euSign } = useContext(eusignContext);

  const [KMs, setKMs] = useState<any[]>();
  const [updatingKM, setUpdatingKM] = useState<boolean>(false);
  const [updateKM, setUpdateKM] = useState<boolean>(false);

  const [KMsVisible, setKMsVisible] = useState<string[]>([]);

  const [pkTypes, setPKTypes] = useState<number>(1);
  const [selectedCA, setSelectedCA] = useState<string>();
  const [selectedKM, setSelectedKM] = useState<string>();
  const [privateKey, setPrivateKey] = useState<Uint8Array>();
  const [password, setPassword] = useState<string>("Umj55gdd");

  const [loaderText, setLoaderText] = useState<string>();
  const [status, setStatus] = useState<string>();
  const [statusError, setStatusError] = useState<boolean>();

  const initForm = () => {
    euSign?.GetKeyMedias().then((KeyMedias) => {
      setKMs(KeyMedias);
      beginUpdateKMs();
    });
  };

  useEffect(() => {
    initForm();
    return () => {};
  }, []);

  const GetSelectedCA = () => {
    const CAs = euSign?.m_CAs || [];
    if (CAs === null || CAs.length === 0) {
      return null;
    }
    if (CAs.length === 1) {
      return CAs[0];
    }
    const index = Number(selectedCA);
    return index !== 0 ? CAs[index - 1] : null;
  };

  const GetKMsVisibleNames = (keyMediaList?: any[]) => {
    const arr: string[] = [];
    if (keyMediaList != null) {
      keyMediaList.forEach((item: any) => {
        arr.push(item.visibleName);
      });
    }
    return arr;
  };

  const IsKMConnected = (keyMedia: any, keyMediaList: any[]) => {
    for (let i = 0; i < keyMediaList.length; i++) {
      const element = keyMediaList[i];
      if (
        keyMedia.typeIndex === element.typeIndex &&
        keyMedia.devIndex === element.devIndex &&
        keyMedia.visibleName === element.visibleName
      ) {
        return true;
      }
    }
    return false;
  };

  const IsKMsUpdated = (keyMediaList1: any[], keyMediaList2?: any[]) => {
    const visibleNames1 = GetKMsVisibleNames(keyMediaList1);
    const visibleNames2 = GetKMsVisibleNames(keyMediaList2);
    if (visibleNames1.length !== visibleNames2.length) {
      return true;
    }
    for (let i = 0; i < visibleNames1.length; i++) {
      if (visibleNames1[i] !== visibleNames2[i]) {
        return true;
      }
    }
    return false;
  };

  const beginUpdateKMs = () => {
    if (updatingKM) {
      setUpdateKM(true);
    } else {
      setUpdateKM(true);
      setUpdatingKM(true);
      /*Modal.onClose(() => {
                  this.StopUpdateKMs();
              });*/
      euSign
        ?.GetKeyMedias()
        .then((KeyMedias) => {
          setUpdatingKM(false);
          if (updateKM) {
            if (
              //@ts-expect-error just because
              this.m_readedPKey !== null &&
              //@ts-expect-error just because
              this.m_readedPKey.keyMedia !== null
            ) {
              //@ts-expect-error just because
              if (!IsKMConnected(this.m_readedPKey.keyMedia, KeyMedias)) {
                KeyMedias = [];
              }
            }
            if (IsKMsUpdated(KeyMedias, KMs)) {
              setKMs(KeyMedias);
            }
            setTimeout(() => {
              if (updateKM) {
                beginUpdateKMs();
              }
              // eslint-disable-next-line no-magic-numbers
            }, 1e3);
          }
        })
        .catch((error) => {
          setUpdatingKM(false);
          console.error(error);
          if (updateKM) {
            setStatus(
              "Виникла помилка при оновленні списку носіїв ключової інформації",
            );
            setStatusError(true);
          }
          StopUpdateKMs();
        });
    }
  };

  const StopUpdateKMs = () => {
    setUpdateKM(false);
  };

  useEffect(() => {
    const KeyMedias = KMs || [];
    let oldKM: any | null = null;
    if (selectedKM) {
      for (let a = 0; a < KeyMedias.length; a++) {
        if (KeyMedias[a].visibleName === selectedKM) {
          oldKM = KeyMedias[a];
          break;
        }
      }
      setSelectedKM(undefined);
    }

    setKMsVisible(GetKMsVisibleNames(KeyMedias));

    if (oldKM) {
      setSelectedKM(oldKM.visibleName);
    }
  }, [KMs]);

  const GetSelectedKM = () => {
    if (KMs == null) {
      return null;
    }

    for (let i = 0; i < KMs.length; i++) {
      const n = KMs[i];
      if (n.visibleName === selectedKM) {
        const keyMedia = euSign?.euSign.EndUserKeyMedia(n);
        keyMedia.password = password;
        /*  if (e.is(':visible')) {
                      keyMedia.user = e.val();
                  }*/
        return keyMedia;
      }
    }
    return null;
  };

  const handleActionClick = async () => {
    setLoaderText(PROCESS_STATUS_READ_PRIVATE_KEY);
    setStatus(undefined);

    const issuerCN = GetSelectedCA()?.issuerCNs[0] || null;
    const keyMedia = GetSelectedKM();
    let readedPKey: any = null;

    Promise.resolve()
      .then(() => {
        if (keyMedia !== null) {
          return euSign?.ReadPrivateKey(keyMedia, null, issuerCN);
        } else if (privateKey !== null) {
          return euSign?.ReadPrivateKeyBinary(
            privateKey,
            password,
            null,
            issuerCN,
          );
        }
        return Promise.reject(ERROR_NO_KEYMEDIA);
      })
      .then(() => {
        readedPKey = {};
        if (keyMedia !== null) {
          readedPKey.keyMedia = keyMedia;
        } else if (privateKey !== null) {
          readedPKey.privateKey = privateKey;
        }
        StopUpdateKMs();
      })
      .then(() => euSign?.GetOwnCertificates())
      .then((certArray) => euSign?.GetSupportedSignAlgos(certArray))
      .then(() => {
        setLoaderText(undefined);
        console.info("PK read success");
        props.onRead(readedPKey);
      })
      .catch((error) => {
        const userCA = error.errorCode === 5 ? selectedCA : undefined;
        setLoaderText(undefined);
        setStatus(error ? error.toString() : ERROR_UNKNOWN);
        setStatusError(true);
        console.error("PK read fail", error, userCA);
      });
  };

  return (
    <ProcessContainer
      loaderText={loaderText}
      statusText={status}
      statusError={statusError}
      nextText={"Зчитати ключ"}
      onNextClick={() => handleActionClick()}
    >
      <div className="form-group row mb-2">
        <label className="col-form-label col-sm-3 text-right">Тип ключа</label>
        <div className="col-sm-9">
          <div className="form-check">
            <label className="form-check-label">
              <input
                type="radio"
                className="form-check-input"
                value="1"
                checked={pkTypes === 1}
                onChange={() => setPKTypes(1)}
              />
              Файловий
            </label>
          </div>
          <div className="form-check">
            <label className="form-check-label">
              <input
                type="radio"
                className="form-check-input"
                value="2"
                checked={pkTypes === 2}
                onChange={() => setPKTypes(2)}
              />
              Токен (захищений носій)
            </label>
          </div>
        </div>
      </div>

      {euSign && euSign.m_CAs.length > 0 && (
        <div className="form-group row mb-2">
          <label className="col-form-label col-sm-3 text-right">ЦСК</label>
          <div className="col-sm-5">
            <select
              className="form-control"
              onChange={(ev) => setSelectedCA(ev.currentTarget.value)}
              value={selectedCA}
            >
              <option value={0}>Визначити автоматично</option>
              {euSign.m_CAs.map((item, index) => (
                <option key={item.issuerCNs[0]} value={index + 1}>
                  {item.issuerCNs[0]}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {pkTypes === 1 && (
        <div className="form-group row mb-2">
          <label className="col-form-label col-sm-3 text-right">
            Файл ключа
          </label>
          <div className="col-sm-5">
            <FormUploadFile
              accept={".dat,.pfx,.pk8,.zs2,.jks"}
              onChange={(file) => {
                euSign?.BASE64Decode(file.content).then((data) => {
                  setPrivateKey(data);
                });
              }}
            />
          </div>
        </div>
      )}

      {pkTypes === 2 && (
        <div className="form-group row mb-2">
          <label className="col-form-label col-sm-3 text-right">Носій</label>
          <div className="col-sm-5">
            <select
              className="form-control"
              onChange={(ev) => setSelectedKM(ev.currentTarget.value)}
              value={selectedKM}
            >
              {KMsVisible.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="form-group row mb-2">
        <label className="col-form-label col-sm-3 text-right">Пароль</label>
        <div className="col-sm-5">
          <input
            type="password"
            className="form-control"
            onChange={(e) => setPassword(e.currentTarget.value)}
            value={password}
          />
        </div>
      </div>
    </ProcessContainer>
  );
}

interface FileInterface {
  content: string;
  name: string;
  size: number;
}

function FormUploadFile(props: {
  accept?: string;
  onChange: (file: FileInterface) => void;
}) {
  const [file, setFile] = useState<File>();

  useEffect(() => {
    if (file) {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        let content: string = fileReader.result as string;
        content = content.substring(content.indexOf(";base64,") + 8);

        props.onChange({ content, name: file.name, size: file.size });
      };
      fileReader.readAsDataURL(file);
    }
  }, [file]);

  function handleFileChosen(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      e.target.value = "";
    }
  }

  return (
    <div className="uniform-uploader">
      <input
        type="file"
        className="form-control-uniform"
        accept={props.accept}
        onChange={handleFileChosen}
      />
      <span className="filename" style={{ userSelect: "none" }}>
        {file ? file.name : "Не вибрано жодного файлу"}
      </span>
      <span className="action btn btn-light" style={{ userSelect: "none" }}>
        Виберіть файл
      </span>
    </div>
  );
}
