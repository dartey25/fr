import { useQuery } from "@tanstack/react-query";

import React from "react";

import {
  PaginationState,
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { getCertificates } from "../../../actions/cert";
import { EUR, fuzzyFilter } from "./table-models";
import { format } from "date-fns";
import {
  ActionButtons,
  CustomTable,
  DebouncedInput,
  Dropdown,
  PageSelect,
} from "./components";
import { Link } from "@tanstack/react-router";
import { Button } from "@/ui";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

export function DataTable() {
  const columnHelper = createColumnHelper<EUR>();
  const [globalFilter, setGlobalFilter] = React.useState("");

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("status", {
        cell: (info) => (
          <i>
            {info.getValue() === "print" && (
              <i className="icon-printer4" title="Надрукований"></i>
            )}
          </i>
        ),
        header: () => <span>Статус</span>,
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("exporter_name", {
        cell: (info) => <span>{info.getValue()}</span>,
        header: () => <span>Еспортер</span>,
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("destination_name", {
        cell: (info) => <span>{info.getValue()}</span>,
        header: () => <span>Вантажоодержувач</span>,
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("remarks", {
        cell: (info) => <span>{info.getValue()}</span>,
        header: () => <span>Особливості транспортування</span>,
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("goods", {
        cell: (info) => {
          const value = info.getValue();
          console.log(value && value.length > 1, value);
          return (
            <span>
              {value && value[0] ? `1. ${value[0].name}` : ""}
              {value && value.length > 1 && (
                <i className="icon-circle-down2 tw-ml-1" />
              )}
            </span>
          );
        },
        header: () => <span>Товари</span>,
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("created_at", {
        cell: (info) => (
          <span>{format(new Date(info.getValue()), "dd.MM.yyyy HH:mm")}</span>
        ),
        header: () => <span>Дата створення</span>,
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("edited_at", {
        cell: (info) => {
          if (info.getValue()) {
            const date = new Date(info.getValue());
            return date && <span>{format(date, "dd.MM.yyyy HH:mm")}</span>;
          } else {
            return null;
          }
        },
        header: () => <span>Дата редагування</span>,
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("id", {
        cell: (info) => {
          return (
            <div className="tw-flex tw-justify-end">
              <Dropdown id={info.getValue()} />
            </div>
          );
        },
        header: () => null,
        footer: (info) => info.column.id,
      }),
    ],
    [columnHelper],
  );

  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });

  const fetchDataOptions = {
    pageIndex,
    pageSize,
  };
  const dataQuery = useQuery({
    queryKey: ["certificate-list", fetchDataOptions],
    queryFn: () => getCertificates(fetchDataOptions),
  });

  const defaultData = React.useMemo(() => [], []);

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  const table = useReactTable({
    data: dataQuery.data?.data ?? defaultData,
    columns,
    pageCount: dataQuery.data?.pageCount ?? 0,
    state: {
      pagination,
      globalFilter,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    manualPagination: true,
    debugTable: true,
  });

  return (
    <>
      <div className="tw-flex tw-items-center tw-justify-between tw-p-5 tw-border-b-[1px] tw-border-[#ddd]">
        <div className="tw-flex">
          <Link to="/cert" search={{ tab: "info" }}>
            <Button icon="plus22">Додати</Button>
          </Link>
          <div className="tw-border-[1px] tw-border-[#ddd] tw-rounded-[3px] tw-w-[200px] tw-flex tw-items-center tw-justify-between tw-py-[7px] tw-px-[14px] tw-ml-2">
            <DebouncedInput
              value={globalFilter ?? ""}
              onChange={(value) => setGlobalFilter(String(value))}
              className="tw-border-none tw-outline-none tw-bg-transparent"
              placeholder="Пошук..."
            />
            <MagnifyingGlassIcon className="tw-text-[#787878] tw-relative tw-top-[1px]" />
          </div>
        </div>
        <PageSelect table={table} />
      </div>

      <CustomTable table={table} state={{ ...dataQuery }} />
      <ActionButtons table={table} counter={dataQuery?.data?.total ?? 0} />
    </>
  );
}
