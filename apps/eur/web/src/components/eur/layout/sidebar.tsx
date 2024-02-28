import { Card, CardContent, CardHeader, CardTitle } from "@/ui";
import { TCertData } from "../../../pages/cert";
import { THistory } from "../form/schema";
import {
  TFormItem,
  useDocsStore,
  useFormStore,
  useGoodsStore,
} from "../form/store";
import { format } from "date-fns";
import uk from "date-fns/locale/uk";
import _ from "lodash";
import { ScrollArea } from "../../../components/ui/scroll-area";
import React, { useEffect, useState } from "react";
import { TCertTab } from "../../../router/routes";

export function Sidebar({
  data,
  tab,
  changeTab,
}: {
  data: TCertData["history"];
  tab: TCertTab;
  changeTab: (v: TCertTab) => void;
}) {
  return (
    <ScrollArea className="tw-w-[27%]">
      <div className="sidebar-content pt-lg-3 pl-lg-3 pr-lg-3">
        <Card>
          <CardHeader>
            <CardTitle>Структура</CardTitle>
          </CardHeader>
          <FormNavigation changeTab={changeTab} tab={tab} />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Повідомлення</CardTitle>
          </CardHeader>
          <CardContent>
            <i>Зауваження відсутні</i>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Останні дії</CardTitle>
          </CardHeader>
          <HistoryWrapper allowWrap={!!(data && data?.length > 4)}>
            <CardContent>
              {data ? (
                <ul className="media-list">
                  {data.map((item) => (
                    <HistoryItem key={item.id} data={item} />
                  ))}
                </ul>
              ) : (
                <i>Відсутні дані</i>
              )}
            </CardContent>
          </HistoryWrapper>
          {data && (
            <div className="card-footer bg-white">
              <span>Всього {data.length}</span>
            </div>
          )}
        </Card>
      </div>
    </ScrollArea>
  );
}

const HistoryWrapper = (props: {
  allowWrap: boolean;
  children: React.ReactNode;
}) => {
  const Element = props.allowWrap ? (ScrollArea as React.ComponentType) : "div";
  const bottomRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [bottomRef]);
  return (
    <Element className={props.allowWrap ? "tw-h-[300px]" : undefined}>
      {props.children}
      {props.allowWrap && <div ref={bottomRef} />}
    </Element>
  );
};

function getAssets(action: string) {
  let color, icon, text;
  switch (action) {
    case "create":
      color = "success";
      icon = "check";
      text = "Створено документ";
      break;
    case "edit":
      color = "primary";
      icon = "pencil";
      text = "Змінено документ";
      break;
    case "pdf":
      color = "warning";
      icon = "file-pdf";
      text = "Надруковано PDF";
      break;
    case "imfx":
      color = "warning";
      icon = "file-zip";
      text = "Завантажено IMFX";
      break;
  }
  return [color, icon, text];
}

const HistoryItem = ({ data: { action, created_at } }: { data: THistory }) => {
  const [color, icon, text] = getAssets(action);
  return (
    <li className="media">
      <div className="mr-3">
        <div
          className={`btn border-${color ?? "primary"} text-${
            color ?? "primary"
          } bg-transparent rounded-round border-2 btn-icon`}
        >
          <i className={`icon-${icon ?? "pencil"}`}></i>
        </div>
      </div>
      <div className="media-body">
        {text ?? "Невизначена дія"}
        <div className="text-muted font-size-sm">
          {`${format(new Date(created_at), "dd", {
            locale: uk,
          })} ${_.capitalize(
            format(new Date(created_at), "MMMM, HH:mm", { locale: uk }),
          )}`}
        </div>
      </div>
    </li>
  );
};

const FormNavigation = (props: {
  tab: TCertTab;
  changeTab: (v: TCertTab) => void;
}) => {
  const structure = useFormStore((state) => state.structure);
  const { structure: goodsStruct } = useGoodsStore();
  const { structure: docsStruct } = useDocsStore();
  return (
    <ul className="ui-fancytree fancytree-container fancytree-plain tw-text-[#333333]">
      {Object.keys(structure).map((key, index) => {
        const item = structure[key];
        if (item.type === "table") {
          return (
            <FormNavigationTable
              key={index}
              data={structure[key]}
              dataKey={key}
              structure={key === "goods" ? goodsStruct : docsStruct}
              changeTab={props.changeTab}
            />
          );
        }
        return (
          <FormNavigationItem
            key={index}
            data={structure[key]}
            dataKey={key}
            {...props}
          />
        );
      })}
    </ul>
  );
};

const FormNavigationTable = ({
  data,
  dataKey,
  structure,
  changeTab,
}: {
  data: TFormItem;
  dataKey: string;
  structure: string[];
  changeTab: (v: TCertTab) => void;
}) => {
  const [open, setOpen] = useState(false);
  const { goods } = useFormStore((state) => state.structure);
  const scroll = () => {
    console.log("scroll", dataKey);
    if (dataKey === "goods") {
      goods.ref?.current?.scrollIntoView({ behavior: "instant" });
    } else {
      document
        .getElementById(structure[0])
        ?.scrollIntoView({ behavior: "instant" });
    }
  };
  if (data.type === "table") {
    return (
      <li>
        <span
          className={`tw-select-none fancytree-node fancytree-folder  ${
            structure.length
              ? " fancytree-has-children fancytree-exp-c fancytree-ico-cf"
              : "fancytree-node fancytree-folder fancytree-lastsib fancytree-exp-nl fancytree-ico-cf"
          } ${
            open ? "fancytree-expanded fancytree-ico-ef fancytree-exp-e" : ""
          }`}
          onClick={() => {
            setOpen(!open);
            if (dataKey === "addedDocs") {
              changeTab("documents");
            } else if (dataKey === "goods") {
              changeTab("info");

              setTimeout(() => {
                scroll();
              }, 150);
            }
          }}
        >
          <span className="fancytree-expander"></span>
          <span role="presentation" className="fancytree-icon" />
          <span className="fancytree-title">
            {data.name}
            {structure.length ? `(${structure.length})` : ""}
          </span>
        </span>
        {open && structure.length ? (
          <ul role="group">
            {structure.map((id, index) => (
              <li
                role="treeitem"
                aria-selected="false"
                onClick={() => {
                  const field = document.getElementById(id);
                  if (dataKey === "addedDocs") {
                    changeTab("documents");
                  } else if (dataKey === "goods") {
                    changeTab("info");
                  }
                  setTimeout(() => {
                    field?.scrollIntoView({ behavior: "instant" });
                    field?.focus();
                  }, 150);
                }}
              >
                <span className="fancytree-node fancytree-exp-n fancytree-ico-c">
                  <span className="fancytree-expander"></span>
                  <span role="presentation" className="fancytree-icon"></span>
                  <span className="fancytree-title">{index + 1}</span>
                </span>
              </li>
            ))}
          </ul>
        ) : undefined}
      </li>
    );
  }
};

const FormNavigationItem = ({
  data,
  dataKey,
  tab,
  changeTab,
}: {
  data: TFormItem;
  dataKey: string;
  tab: TCertTab;
  changeTab: (v: TCertTab) => void;
}) => {
  const scrollFocus = (d: TFormItem) => {
    d.ref?.current?.scrollIntoView({ behavior: "instant" });
    d.fieldId && document.getElementById(d.fieldId)?.focus();
  };
  return (
    <li
      onClick={() => {
        console.log(dataKey, tab);
        if (dataKey === "receiveForm") {
          changeTab("receive");
        } else if (tab === "receive" || tab === "documents") {
          changeTab("info");
        }
        setTimeout(() => {
          scrollFocus(data);
        }, 150);
      }}
    >
      <span className="fancytree-node fancytree-exp-n fancytree-ico-c">
        <span className="fancytree-expander"></span>
        <span role="presentation" className="fancytree-icon"></span>
        <span className="fancytree-title">{data.name}</span>
      </span>
    </li>
  );
};
