import {
  Legend,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
  TableHead,
  TableHeader,
  Button,
  Textarea,
  DatePicker,
  Input,
  EmptyRow,
  FormMessage,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/ui";
import { FormComponentProps, TFormSchema } from "../schema";
import {
  FieldArrayWithId,
  FieldValues,
  UseFieldArrayRemove,
  UseFormRegister,
  UseFormRegisterReturn,
  useFieldArray,
  useFormContext,
  useFormState,
} from "react-hook-form";
import { useModalStore } from "@/ui/modal/store/query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { DebouncedInput } from "../../data-table/components";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useFormStore, useGoodsStore } from "../store";

export function Goods({ control }: FormComponentProps) {
  const { register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "goods",
  });
  const { setStruct } = useGoodsStore();
  const { goods } = useFormStore((state) => state.structure);
  const legendRef = React.useRef<HTMLLegendElement>(null);

  React.useEffect(() => {
    if (goods) {
      goods.ref = legendRef;
    }
  }, [legendRef, goods]);

  useEffect(() => {
    const struct = fields.map((field) => field.id);
    setStruct(struct);
  }, [fields, setStruct]);

  const appendField = () =>
    append({
      name: "",
      quant: 0,
      inv_date: new Date(),
      inv_num: "",
      unit_code: 0,
      unit_name: "",
    });

  return (
    <>
      <Legend ref={legendRef}>Товари</Legend>
      <Table>
        <TableCaption className="p-0">
          <Button variant="light" icon="plus22" onClick={appendField}>
            Додати товар
          </Button>
          {/* <Button variant="light" icon="file-spreadsheet" className="ml-2">
            Імпорт з Excel
          </Button> */}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>
              8. Номер позиції; позначки та номери; номер та тип упаковки; опис
              товарів
              <span className="text-danger ml-1">*</span>
            </TableHead>
            <TableHead className="tw-w-[10%]">
              9. Вага брутто
              <span className="text-danger ml-1">*</span>
            </TableHead>
            <TableHead className="tw-w-[15%]">
              9. Інша міра (код, назва)
              <span className="text-danger ml-1">*</span>
            </TableHead>
            <TableHead className="tw-w-[10%]">10. Номер рахунку</TableHead>
            <TableHead className="tw-w-[10%]">10. Дата рахунку</TableHead>
            <TableHead className="tw-w-[5%]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields?.length > 0 ? (
            fields.map((field, index) => (
              <GoodsRow
                key={field.id}
                field={field}
                remove={remove}
                index={index}
                register={register}
              />
            ))
          ) : (
            <EmptyRow width={6} />
          )}
        </TableBody>
      </Table>
    </>
  );
}

function GoodsRow(props: {
  field: FieldArrayWithId;
  remove: UseFieldArrayRemove;
  index: number;
  register: UseFormRegister<FieldValues>;
}) {
  const {
    errors: { goods: err },
    defaultValues,
  } = useFormState<TFormSchema>();
  const { create } = useModalStore();
  const { setValue } = useFormContext<TFormSchema>();

  const index = props.index;
  return (
    <TableRow>
      <TableCell className="align-top">
        <Textarea
          className="h-[56px]"
          {...props.register(`goods.${props.index}.name`)}
          id={props.field.id}
        />
        {err && err[props.index]?.name && (
          <div className="tw-text-start">
            <FormMessage>{err[props.index]?.name?.message}</FormMessage>
          </div>
        )}
      </TableCell>
      <TableCell className="align-top">
        <Input
          {...props.register(`goods.${props.index}.quant`, {
            setValueAs: (value: string) => Number(value),
          })}
        />
        {err && err[props.index]?.quant && (
          <div className="tw-text-start">
            <FormMessage>{err[props.index]?.quant?.message}</FormMessage>
          </div>
        )}
      </TableCell>
      <TableCell className="align-top">
        <CombinedInput
          codeProps={props.register(`goods.${props.index}.unit_code`)}
          nameProps={props.register(`goods.${props.index}.unit_name`)}
          onClick={() =>
            create({
              title: "Вибір одиниць вимірювання",
              queryOptions: {
                queryKey: ["units"],
                queryFn: async () => {
                  const res = await axios.get(
                    `mdoffice/eur1.cert.dic_api?p_type=measure`,
                  );
                  return res.data;
                },
                enabled: false,
              },
              contentFn: (props: any) => (
                <ModalContent
                  onSelect={(o: UnitOption) => {
                    try {
                      setValue(`goods.${index}.unit_code`, parseInt(o.code));
                      setValue(`goods.${index}.unit_name`, o.name_short_en);
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  {...props}
                />
              ),
            })
          }
        />
        {err &&
          (err[props.index]?.unit_code || err[props.index]?.unit_name) && (
            <div className="tw-text-start">
              <FormMessage>
                {err[props.index]?.unit_code?.message ??
                  err[props.index]?.unit_name?.message}
              </FormMessage>
            </div>
          )}
      </TableCell>
      <TableCell className="align-top">
        <Input {...props.register(`goods.${props.index}.inv_num`)} />
        {err && err[props.index]?.inv_num && (
          <div className="tw-text-start">
            <FormMessage>{err[props.index]?.inv_num?.message}</FormMessage>
          </div>
        )}
      </TableCell>
      <TableCell className="align-top">
        <DatePicker
          fieldKey={`goods.${props.index}.inv_date`}
          withButton={false}
          placeholder="dd.mm.yyyy"
          value={
            defaultValues?.goods && defaultValues.goods[props.index]?.inv_date
          }
          {...props.register(`goods.${props.index}.inv_date`)}
        />
        {err && err[props.index]?.inv_date && (
          <div className="tw-text-start">
            <FormMessage>{err[props.index]?.inv_date?.message}</FormMessage>
          </div>
        )}
      </TableCell>
      <TableCell className="align-top">
        <Button
          variant="light"
          icon="trash"
          className="text-nowrap btn-xs"
          onClick={() => props.remove(props.index)}
        >
          Видалити
        </Button>
      </TableCell>
    </TableRow>
  );
}

function CombinedInput(props: {
  onClick: () => void;
  codeProps: UseFormRegisterReturn;
  nameProps: UseFormRegisterReturn;
}) {
  return (
    <div className="input-group">
      <input
        type="number"
        min={0}
        className="form-control"
        {...props.codeProps}
      />
      <input className="form-control" {...props.nameProps} />
      <div className="input-group-append">
        <button className="btn btn-light" onClick={props.onClick}>
          ...
        </button>
      </div>
    </div>
  );
}

type UnitOption = {
  code: string;
  name_en?: string;
  name_ua?: string;
  name_short_en?: string;
  name_short_ua?: string;
};

function UnitTable(props: {
  list: UnitOption[];
  onSelect: (value: UnitOption) => void;
}) {
  const [filteredList, setFilteredList] = useState(props.list);
  const { dismiss } = useModalStore();

  const filter = (input: string | number) => {
    if (typeof input === "string") {
      if (input) {
        setFilteredList(() =>
          props.list.filter((item) => {
            return [
              item.name_en?.toLowerCase(),
              item.code.toLowerCase(),
              item.name_ua?.toLowerCase(),
              item.name_short_en?.toLowerCase(),
              item.name_short_ua?.toLowerCase(),
            ].some((str) => str?.includes(input.toLowerCase()));
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
            <th className="!tw-font-medium">Назва скорочена (англ.)</th>
            <th className="!tw-font-medium">Назва скорочена (укр.)</th>
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
                <td>{item.name_short_en}</td>
                <td>{item.name_short_ua}</td>
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
            <EmptyRow width={5} />
          )}
        </tbody>
      </table>
    </>
  );
}

function ModalContent(props: {
  data: { data: { all: UnitOption[]; top: UnitOption[] } };
  onSelect: (value: UnitOption) => void;
}) {
  return (
    <Tabs defaultValue="freq_use">
      <TabsList className="tw-pt-5">
        <TabsTrigger value="all">Всі</TabsTrigger>
        <TabsTrigger value="freq_use">Часто використовувані</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <UnitTable list={props.data.data.all} onSelect={props.onSelect} />
      </TabsContent>
      <TabsContent value="freq_use">
        <UnitTable list={props.data.data.top} onSelect={props.onSelect} />
      </TabsContent>
    </Tabs>
  );
}
