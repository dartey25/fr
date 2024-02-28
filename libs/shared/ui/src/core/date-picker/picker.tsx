import * as React from "react";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { FieldValues, Path, PathValue, useFormContext } from "react-hook-form";
import { format } from "date-fns";

interface DatePickerProps<T> extends React.HTMLAttributes<HTMLInputElement> {
  value?: Date | null;
  fieldKey: Path<T>;
  withButton?: boolean;
}

export function DatePicker<T extends FieldValues>({
  withButton = true,
  fieldKey,
  ...input
}: DatePickerProps<T>) {
  const [date, setDate] = React.useState<Date | undefined>(
    input.value ? new Date(input.value) : undefined,
  );

  const { setValue } = useFormContext<T>();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    input.value && setDate(input.value);
  }, []);

  React.useEffect(() => {
    date && setValue(fieldKey, date as PathValue<T, Path<T>>);
  }, [date, setValue, fieldKey]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="input-group">
          <span className="input-group-prepend">
            {withButton && (
              <span className="input-group-text">
                <i className="icon-calendar2"></i>
              </span>
            )}
          </span>
          <input
            {...input}
            className="form-control"
            value={
              date &&
              format(
                typeof date === "string" ? new Date(date) : date,
                "dd.MM.yyyy",
              )
            }
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          close={() => {
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
