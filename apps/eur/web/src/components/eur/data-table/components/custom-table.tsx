import { CaretSortIcon } from "@radix-ui/react-icons";
import { UseQueryResult } from "@tanstack/react-query";
import { flexRender, RowData, Table } from "@tanstack/react-table";
import { ErrorBoundary } from "react-error-boundary";
import { Loader } from "@mdoffice/md-component-react";

type Props<T extends RowData> = {
  table: Table<T>;
  state: UseQueryResult<T>;
};

export function CustomTable<T extends RowData>(props: Props<T>) {
  return (
    <table className="table table-xs dataTable no-footer tw-border-b-[1px] tw-border-[#b7b7b7]">
      <thead>
        {props.table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id} colSpan={header.colSpan}>
                <div className="tw-flex tw-items-center tw-cursor-pointer">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  <CaretSortIcon className="tw-h-4 tw-w-4 tw-shrink-0 tw-opacity-50 tw-ml-auto" />
                </div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <ErrorBoundary
        fallbackRender={({ error }) => <TableError error={error} />}
      >
        <TableBody {...props} />
      </ErrorBoundary>
    </table>
  );
}

function TableBody<T extends RowData>({ table, state }: Props<T>) {
  if (state.isLoading) {
    return (
      <tbody className="tw-h-[500px]">
        <tr className="tw-h-full">
          <td colSpan={8} className="text-center font-italic py-3">
            <Loader text="Завантажую..." />
          </td>
        </tr>
      </tbody>
    );
  }

  if (state.isError) {
    return <TableError error={state.error} />;
  }

  return (
    <tbody>
      {table.getRowModel().rows.length > 0 ? (
        table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))
      ) : (
        <tr>
          <td valign="top" colSpan={8} className="text-center">
            Дані відсутні
          </td>
        </tr>
      )}
    </tbody>
  );
}

function TableError(props: { error: Error }) {
  // console.error(props.error);
  return (
    <tbody>
      <tr>
        <td colSpan={8} className="text-center font-italic py-3">
          Упс, сталася помилка
        </td>
      </tr>
    </tbody>
  );
}
