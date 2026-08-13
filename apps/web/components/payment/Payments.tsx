"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CustomTable } from "@/components/table/CustomTable";
import axios from "axios";
import { createSelectionColumn } from "@/components/table/SelectionColumn";
import { buildQueryParams } from "@/utils/helper-function";
import ErrorState from "@/components/ErrorState";
import { TableSkeleton } from "@/components/table/TableSkeleton";
import { StatusBadge } from "../StatusBadge";

export const Payments = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["payments", pagination],
    queryFn: async () => {
      const params = buildQueryParams({
        page: String(pagination.pageIndex + 1),
        limit: String(pagination.pageSize),
      });
      const res = await axios.get<any>(`/api/payment?${params.toString()}`);
      return res.data;
    },
  });

  function handleDelete(ids: string[]) {}

  if (isLoading) {
    return <TableSkeleton rows={10} columns={7} />;
  }

  if (isError) {
    return (
      <ErrorState
        title={error?.message ?? "Unable to load payments"}
        description="Please check your connection and try again."
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end"></div>
      <div>
        <CustomTable
          data={data?.data as any[]}
          onDeleteSelected={handleDelete}
          columns={[
            createSelectionColumn<any>(),
            {
              accessorKey: "id",
              header: "Payment Number",
              cell: ({ row }) => {
                return <div>{row.original.id.slice(-6)}</div>;
              },
            },

            {
              id: "type",
              header: "Payment Method",
              cell: ({ row }) => {
                return (
                  <StatusBadge type="folio" status={row.original.method} />
                );
              },
            },
            {
              accessorKey: "amount",
              header: "Amount",
              cell: ({ row }) => {
                return (
                  <div>
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                      maximumFractionDigits: 0,
                    }).format(row.original.amount ?? 0)}
                  </div>
                );
              },
            },
          ]}
          searcheable

          meta={data?.meta as { total: number; limit: number }}
          pagination={pagination}
          onPaginationChange={setPagination}
          emptyTitle="No payments yet"
          emptyDescription="Create your first transaction."
          emptyActionLabel="Create a transaction"
          onEmptyAction={() => {}}
        />
      </div>
    </div>
  );
};
