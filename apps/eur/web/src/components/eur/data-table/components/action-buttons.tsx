import { RowData } from "@tanstack/react-table";
import { Button } from "@/ui";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { TableProps } from "../table-models";

export function ActionButtons<T extends RowData>({
  table,
  counter,
}: TableProps<T> & { counter: number }) {
  return (
    <div className="tw-w-full tw-flex tw-justify-between tw-items-center tw-p-5 ">
      <div className="tw-flex tw-items-center tw-gap-5">
        <Button
          variant="ghost"
          className="disabled:text-[#ccc]"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ArrowLeftIcon />
        </Button>
        <div className="tw-rounded-sm tw-p-[7px] tw-bg-[#37474f] tw-text-white">
          <span className="tw-h-5 tw-w-5 tw-block tw-text-center">
            {table.getState().pagination.pageIndex + 1}
          </span>
        </div>
        <Button
          variant="ghost"
          className="disabled:tw-text-[#ccc]"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ArrowRightIcon />
        </Button>
      </div>
      <span>{counter} записів</span>
    </div>
  );
}
