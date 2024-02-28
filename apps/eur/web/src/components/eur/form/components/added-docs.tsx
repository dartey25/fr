import {
  Legend,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableHeader,
  Button,
  DatePicker,
  Input,
  Combobox,
  EmptyRow,
  TOption,
  FormMessage,
} from "@/ui";
import axios from "axios";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import {
  FieldArrayWithId,
  FieldError,
  FieldValues,
  UseFormRegister,
  useFieldArray,
  useFormContext,
  useFormState,
} from "react-hook-form";
import { FormComponentProps } from "../schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { TFormSchema } from "@/schema/eur";
import { useDocsStore } from "../store";
import { ChangeEvent, useEffect, useState } from "react";

async function getDocTypes() {
  const result = await axios.get<{
    data: TOption[];
  }>("mdoffice/eur1.cert.dic_api?p_type=doc");
  return result.data.data;
}

export function AddDocs({ control }: FormComponentProps) {
  const docTypesQuery = useQuery({
    queryKey: ["doc-types"],
    queryFn: getDocTypes,
  });

  const { register } = useFormContext();
  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: "added_docs",
  });

  const { setStruct } = useDocsStore();

  useEffect(() => {
    const struct = fields.map((field) => field.id);
    setStruct(struct);
  }, [fields, setStruct]);

  const appendField = () => append({});

  const deleteAll = () => {
    const indexes: number[] = [];
    let i = 0;
    fields.map(() => indexes.push(i++));
    remove(indexes);
  };

  return (
    <>
      <Legend id="test">
        Прикладені документи до електронної копії
        <Button
          variant="light"
          icon="plus22"
          className="ml-2"
          onClick={() => appendField()}
        >
          Додати запис
        </Button>
        {fields?.length > 1 && (
          <Button
            variant="light"
            icon="trash"
            className="ml-2"
            onClick={deleteAll}
          >
            Видалити всі
          </Button>
        )}
      </Legend>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead />
            <TableHead>Тип документа</TableHead>
            <TableHead>Номер документа</TableHead>
            <TableHead>Дата документа</TableHead>
            <TableHead>Файл</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields?.length ? (
            fields.map((field, index) => {
              const canMoveUp = !!fields[index - 1];
              const canMoveDown = !!fields[index + 1];
              return (
                <InputRow
                  data={field}
                  index={index}
                  onDelete={() => remove(index)}
                  canMoveUp={canMoveUp}
                  canMoveDown={canMoveDown}
                  onMoveUp={() => swap(index, index - 1)}
                  onMoveDown={() => swap(index, index + 1)}
                  docTypesQuery={docTypesQuery}
                  register={register}
                />
              );
            })
          ) : (
            <EmptyRow width={6} />
          )}
        </TableBody>
      </Table>
    </>
  );
}

type TFileErrors = {
  file_name?: FieldError;
  file_size?: FieldError;
  file_type?: FieldError;
};

function InputRow(props: {
  data: FieldArrayWithId;
  docTypesQuery: UseQueryResult<TOption[]>;
  onDelete?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  register: UseFormRegister<FieldValues>;
  index: number;
  id?: number;
}) {
  const {
    errors: { added_docs: err },
    defaultValues,
  } = useFormState<TFormSchema>();
  const { setValue, getValues } = useFormContext<TFormSchema>();
  const [comboboxInitialValue, setComboboxInitialValue] = useState<number>();

  useEffect(() => {
    const docValues = getValues().added_docs;
    if (docValues?.length) {
      const initialValue = docValues[props.index].doc_type;
      initialValue && setComboboxInitialValue(initialValue);
    }
  }, []);

  function handleFileSelect(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;

    if (!files) return;

    const file = files[0];

    if (!file) return;

    function _arrayBufferToBase64(buffer: ArrayBuffer) {
      let binary = "";
      const bytes = new Uint8Array(buffer);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (
        e.target &&
        e.target.result &&
        e.target.result instanceof ArrayBuffer
      ) {
        setValue(`added_docs.${props.index}.file_name`, file.name);
        setValue(`added_docs.${props.index}.file_type`, file.type);
        setValue(`added_docs.${props.index}.file_size`, file.size);
        setValue(
          `added_docs.${props.index}.file_content`,
          _arrayBufferToBase64(e.target.result),
        );
        console.log(getValues().added_docs);
      }
    };

    reader.readAsArrayBuffer(file);
  }

  const makeFileErrors = (): TFileErrors | undefined => {
    if (!err || !err[props.index]) return;

    return {
      file_name: err[props.index]?.file_name,
      file_size: err[props.index]?.file_size,
      file_type: err[props.index]?.file_type,
    };
  };

  return (
    <TableRow>
      <TableCell>{props.index + 1}</TableCell>
      <TableCell>
        <Combobox<TFormSchema>
          text={{
            placeholder: "Код документа",
            notFound: "Код відсутній",
          }}
          values={props.docTypesQuery.data}
          isLoading={props.docTypesQuery.isLoading}
          isError={props.docTypesQuery.isError}
          formPath="added_docs"
          initialValue={comboboxInitialValue}
        />
        {err && err[props.index]?.doc_type && (
          <div className="tw-text-start">
            <FormMessage>{err[props.index]?.doc_type?.message}</FormMessage>
          </div>
        )}
      </TableCell>
      <TableCell>
        <Input
          {...props.register(`added_docs.${props.index}.doc_num`)}
          id={props.data.id}
        />
        {err && err[props.index]?.doc_num && (
          <div className="tw-text-start">
            <FormMessage>{err[props.index]?.doc_num?.message}</FormMessage>
          </div>
        )}
      </TableCell>
      <TableCell>
        <DatePicker
          fieldKey={`added_docs.${props.index}.doc_date`}
          value={
            defaultValues?.added_docs &&
            defaultValues.added_docs[props.index]?.doc_date
          }
          {...props.register(`added_docs.${props.index}.doc_date`)}
        />
        {err && err[props.index]?.doc_date && (
          <div className="tw-text-start">
            <FormMessage>{err[props.index]?.doc_date?.message}</FormMessage>
          </div>
        )}
      </TableCell>
      <td>
        <FileInput
          {...props.register(`added_docs.${props.index}.file_name`)}
          fileName={
            defaultValues?.added_docs &&
            defaultValues.added_docs[props.index]?.file_name
          }
          fileErrors={makeFileErrors()}
          onChange={handleFileSelect}
        />
      </td>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="light" icon="menu" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="tw-w-56">
            <DropdownMenuItem
              onClick={() => {
                if (props.canMoveUp) props.onMoveUp();
              }}
            >
              Просунути вгору
              <DropdownMenuShortcut className="tw-ml-auto">
                <ArrowUpIcon />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (props.canMoveDown) props.onMoveDown();
              }}
            >
              Просунути вниз
              <DropdownMenuShortcut className="tw-ml-auto">
                <ArrowDownIcon />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="tw-text-red-500 hover:tw-text-red-500"
              onClick={props.onDelete}
            >
              Видалити
              <DropdownMenuShortcut className="tw-ml-auto">
                <i className="icon-trash" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

const FileInput = ({
  onChange,
  fileErrors,
  fileName,
  ...other
}: {
  onChange: (ev: ChangeEvent<HTMLInputElement>) => void;
  fileName?: string | null;
  fileErrors?: TFileErrors;
} & Omit<React.HTMLAttributes<HTMLInputElement>, "onChange">) => {
  return (
    <>
      {fileName && (
        <span className="badge badge-flat border-success text-success mb-1">
          {fileName}
        </span>
      )}
      <input {...other} type="file" onChange={onChange} />
      {fileErrors &&
        Object.values(fileErrors).map((error: FieldError | undefined) => (
          <div className="tw-text-start">
            <FormMessage>{error?.message}</FormMessage>
          </div>
        ))}
    </>
  );
};
