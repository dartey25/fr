import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { DayPicker } from "react-day-picker";
import { uk } from "date-fns/locale";

import { cn } from "../../utils";
import { Object } from "ts-toolbelt";
import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "tw-inline-flex tw-items-center tw-justify-center tw-rounded-md tw-text-sm tw-font-medium tw-transition-colors focus-visible:tw-outline-none focus-visible:tw-ring-1 focus-visible:tw-tw-ring-slate-950 disabled:tw-pointer-events-none disabled:tw-opacity-50",
  {
    variants: {
      variant: {
        default:
          "tw-bg-slate-900 tw-text-slate-50 shadow hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90",
        destructive:
          "bg-red-500 text-slate-50 shadow-sm hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90",
        outline:
          "border border-slate-200 bg-transparent shadow-sm hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-50",
        secondary:
          "bg-slate-100 text-slate-900 shadow-sm hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
        ghost: "",
        link: "text-slate-900 underline-offset-4 hover:underline dark:text-slate-50",
      },
      size: {
        default: "tw-h-9 tw-px-4 tw-py-2",
        sm: "tw-h-8 tw-rounded-md tw-px-3 tw-text-xs",
        lg: "tw-h-10 tw-rounded-md tw-px-8",
        icon: "tw-h-9 tw-w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type CalendarProps = Object.Merge<
  React.ComponentProps<typeof DayPicker>,
  { close: () => void }
>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  close,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("tw-p-3", className)}
      locale={uk}
      classNames={{
        months:
          "tw-flex flex-col sm:tw-flex-row tw-space-y-4 sm:tw-space-x-4 sm:tw-space-y-0",
        month: "tw-space-y-4",
        caption:
          "tw-flex tw-justify-center tw-pt-1 tw-relative tw-items-center",
        caption_label: "tw-text-sm tw-font-medium tw-capitalize",
        nav: "tw-space-x-1 tw-flex tw-items-center",
        nav_button: cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "tw-h-7 tw-bg-transparent tw-p-0 tw-opacity-50 hover:tw-opacity-100",
        ),
        nav_button_previous: "tw-absolute tw-left-1",
        nav_button_next: "tw-absolute tw-right-1",
        table: "tw-w-full tw-border-collapse tw-space-y-1",
        head_row: "tw-flex",
        head_cell:
          "tw-text-muted-foreground tw-rounded-md tw-w-9 tw-text-center tw-font-normal tw-text-[0.8rem] tw-capitalize",
        row: "tw-flex tw-w-full tw-mt-2",
        cell: cn(
          "tw-relative tw-p-0 tw-text-center tw-text-sm focus-within:tw-relative focus-within:tw-z-20 [&:has([aria-selected])]:tw-bg-blue-100",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:tw-rounded-r-md [&:has(>.day-range-start)]:tw-rounded-l-md first:[&:has([aria-selected])]:tw-rounded-l-md last:[&:has([aria-selected])]:tw-rounded-r-md"
            : "[&:has([aria-selected])]:tw-rounded-md",
        ),
        day: cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "tw-h-8 tw-w-8 tw-p-0 tw-font-normal aria-selected:tw-opacity-100 hover:tw-bg-blue-100 tw-select-none",
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "tw-bg-blue-100 tw-text-gray-900 hover:tw-bg-blue-100 hover:tw-text-gray-900 focus:tw-bg-blue-100 focus:tw-text-gray-900",
        day_today: "tw-text-red-600 tw-text-gray-900",
        day_outside: "tw-text-muted-foreground tw-opacity-50",
        day_disabled: "tw-text-muted-foreground tw-opacity-50",
        day_range_middle:
          "aria-selected:tw-bg-blue-100 aria-selected:tw-text-gray-900",
        day_hidden: "invisible",
        ...classNames,
      }}
      weekStartsOn={1}
      components={{
        IconLeft: () => <ChevronLeftIcon className="tw-h-4 tw-w-4" />,
        IconRight: () => <ChevronRightIcon className="tw-h-4 tw-w-4" />,
      }}
      onDayClick={close}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
