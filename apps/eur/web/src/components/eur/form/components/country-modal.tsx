import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/ui";
import axios from "axios";
import { DebouncedInput } from "../../data-table/components";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { EmptyRow } from "@/ui";
import { useState } from "react";
import { useModalStore } from "@/ui/modal/store/query";

export type CountryOption = {
  code: string;
  name_en: string;
  name_ua: string;
};

function CountryTable(props: {
  list: CountryOption[];
  onSelect: (value: CountryOption) => void;
}) {
  const [filteredList, setFilteredList] = useState(props.list);
  const { dismiss } = useModalStore();

  const filter = (input: string | number) => {
    if (typeof input === "string") {
      if (input) {
        setFilteredList(() =>
          props.list.filter((item) => {
            return [
              item.name_en.toLowerCase(),
              item.code.toLowerCase(),
              item.name_ua.toLowerCase(),
            ].some((str) => str.includes(input.toLowerCase()));
          }),
        );
      } else {
        setFilteredList(props.list);
      }
    }
  };
  return (
    <>
      <div className="tw-p-5 tw-pt-0 tw-border-b-[.5px] tw-border-gray-300">
        <div className="tw-border-[1px] tw-border-[#ddd] tw-rounded-[3px] tw-w-[200px] tw-flex tw-items-center tw-justify-between tw-py-[7px] tw-px-[14px] tw-ml-2">
          <DebouncedInput
            value={""}
            onChange={filter}
            className="tw-border-none tw-outline-none tw-bg-transparent"
            placeholder="Пошук..."
          />
          <MagnifyingGlassIcon className="tw-text-[#787878] tw-relative tw-top-[1px]" />
        </div>
      </div>
      <table className="table table-xs" data-field="orig">
        <thead>
          <tr>
            <th className="!tw-font-medium">Код</th>
            <th className="!tw-font-medium">Назва (англ.)</th>
            <th className="!tw-font-medium">Назва (укр.)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredList?.length > 0 ? (
            filteredList.map((item, index) => (
              <tr key={index}>
                <td>{item.code}</td>
                <td>{item.name_en}</td>
                <td>{item.name_ua}</td>
                <td className="text-right">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                      props.onSelect(item);
                      dismiss();
                    }}
                  >
                    Обрати
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <EmptyRow width={3} />
          )}
        </tbody>
      </table>
    </>
  );
}

function Content(props: {
  data: any;
  onSelect: (value: CountryOption) => void;
}) {
  return (
    <Tabs defaultValue="freq_use">
      <TabsList className="tw-pt-5">
        <TabsTrigger value="all">Всі</TabsTrigger>
        <TabsTrigger value="freq_use">Часто використовувані</TabsTrigger>
        <TabsTrigger value="efta">ЄАВТ</TabsTrigger>
        <TabsTrigger value="group_eu">ЄС</TabsTrigger>
        <TabsTrigger value="group_pem">ПанЄвроМед</TabsTrigger>
        <TabsTrigger value="group_list">Групи</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <CountryTable list={props.data.data.all} onSelect={props.onSelect} />
      </TabsContent>
      <TabsContent value="freq_use">
        <CountryTable
          list={props.data.data.freq_use}
          onSelect={props.onSelect}
        />
      </TabsContent>
      <TabsContent value="efta">
        <CountryTable list={props.data.data.efta} onSelect={props.onSelect} />
      </TabsContent>
      <TabsContent value="group_eu">
        <CountryTable
          list={props.data.data.group_eu}
          onSelect={props.onSelect}
        />
      </TabsContent>
      <TabsContent value="group_pem">
        <CountryTable
          list={props.data.data.group_pem}
          onSelect={props.onSelect}
        />
      </TabsContent>
      <TabsContent value="group_list">
        <CountryTable
          list={props.data.data.group_list}
          onSelect={props.onSelect}
        />
      </TabsContent>
    </Tabs>
  );
}

const options = (field: string, callBack: (value: CountryOption) => void) => {
  return {
    title: "Вибір країни",
    queryOptions: {
      queryKey: ["countries"],
      queryFn: async () => {
        const res = await axios.get(
          `mdoffice/eur1.cert.dic_api?p_type=country&p_field=${field}`,
        );
        return res.data;
      },
      enabled: false,
    },
    contentFn: (props: any) => <Content onSelect={callBack} {...props} />,
  };
};

export { options };
