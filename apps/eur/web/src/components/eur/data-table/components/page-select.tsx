import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { RowData } from "@tanstack/react-table";
import { TableProps } from "../table-models";

export function PageSelect<T extends RowData>({ table }: TableProps<T>) {
  return (
    <div className="tw-w-200px">
      <Select
        value={table.getState().pagination.pageSize.toString()}
        onValueChange={(value: string) => {
          table.setPageSize(Number(value));
        }}
      >
        <SelectTrigger className="tw-w-fit">
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectGroup>
            {[10, 25, 50, 100].map((pageSize) => (
              <SelectItem key={pageSize} value={pageSize.toString()}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
