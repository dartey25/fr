import { FilterFn } from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
import { RowData, Table } from "@tanstack/react-table";
import { z } from "zod";
import { formSchema } from "@/schema/eur";
import { Object } from "ts-toolbelt";

type TableProps<T extends RowData> = {
  table: Table<T>;
};

type EUR = Object.Merge<
  Pick<
    z.infer<typeof formSchema>,
    "exporter_name" | "remarks" | "destination_name" | "goods"
  >,
  {
    id: string;
    status?: string;
    created_at: Date;
    edited_at: Date;
  }
>;

const fuzzyFilter: FilterFn<EUR> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value.trim());

  // Store the ranking info
  addMeta(itemRank);

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

export { fuzzyFilter };
export type { EUR, TableProps };
