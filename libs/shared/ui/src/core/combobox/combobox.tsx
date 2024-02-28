import * as React from "react";
import { CaretDownIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "../../utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { UseQueryResult } from "@tanstack/react-query";
import { Loader } from "@mdoffice/md-component-react";
import { ErrorFallback } from "../error";
import { FieldValues, Path, PathValue, useFormContext } from "react-hook-form";

interface Text {
  placeholder?: string;
  search?: string;
  notFound?: string;
}

type TValue<T> = PathValue<T, Path<T>>;

interface ComboboxProps<T> extends React.HTMLAttributes<HTMLInputElement> {
  text?: Text;
  values?: TOption[];
  isLoading?: UseQueryResult["isLoading"];
  isError?: UseQueryResult["isError"];
  initialValue?: TValue<T>;
  formPath: Path<T>;
}

export type TOption = { key: string; value: string };

export function Combobox<T extends FieldValues>({
  text,
  values,
  isError,
  isLoading,
  initialValue,
  formPath,
}: ComboboxProps<T>) {
  const { setValue: setFormValue } = useFormContext<T>();
  const [open, setOpen] = React.useState(false);
  const [comboboxValue, setComboboxValue] = React.useState<
    TValue<T> | undefined
  >(initialValue);

  const onSelect = (currentValue: TValue<T>) => {
    if (currentValue === comboboxValue) {
      setComboboxValue(undefined);
    } else {
      setComboboxValue(currentValue);
      setFormValue(formPath, currentValue as PathValue<T, Path<T>>);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          role="combobox"
          aria-controls="combobox-options"
          aria-expanded={open}
          className="form-control tw-flex tw-justify-between tw-items-center"
        >
          <span className="tw-line-clamp-1 tw-text-start">
            {comboboxValue
              ? values?.find((item) => item.key === comboboxValue.toString())
                  ?.value
              : text?.placeholder
                ? text.placeholder
                : ""}
          </span>
          <CaretDownIcon className="tw-ml-2 tw-h-4 tw-w-4 tw-shrink-0 tw-opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="tw-w-[200px] tw-p-0">
        <Command>
          <CommandInput
            placeholder={text?.search ? text.search : "Шукати"}
            className="tw-h-9 tw-outline-none"
          />
          <CommandEmpty>
            {text?.notFound ? text.notFound : "Не знайдено"}
          </CommandEmpty>
          <CommandGroup>
            <CommandItems
              onSelect={onSelect}
              value={comboboxValue}
              values={values}
              isError={isError}
              isLoading={isLoading}
            />
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function CommandItems<T extends FieldValues>(props: {
  values?: TOption[];
  isLoading?: UseQueryResult["isLoading"];
  isError?: UseQueryResult["isError"];
  onSelect: (value: TValue<T>) => void;
  value?: number;
}) {
  if (props.isLoading) {
    return <Loader />;
  }

  if (props.isError) {
    return <ErrorFallback />;
  }

  const makeNum = (snum: string): string => {
    const arr = snum.split("");
    while (arr.length < 4) {
      arr.unshift("0");
    }
    return arr.join("");
  };

  return (
    <div>
      {props.values
        ? props.values.map((item, index) => (
            <CommandItem
              key={index}
              onSelect={() => {
                props.onSelect(item.key as TValue<T>);
              }}
            >
              <span className="tw-mr-2">{makeNum(item.key)}</span>-
              <span className="tw-ml-2">{item.value}</span>
              <CheckIcon
                className={cn(
                  "tw-ml-auto tw-h-4 tw-w-4",
                  props.value?.toString() === item.key
                    ? "tw-opacity-100"
                    : "tw-opacity-0",
                )}
              />
            </CommandItem>
          ))
        : "Не вдалося завантажити"}
    </div>
  );
}
