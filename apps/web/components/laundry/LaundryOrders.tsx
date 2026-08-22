"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { CustomTable } from "@/components/table/CustomTable";
import { createSelectionColumn } from "@/components/table/SelectionColumn";
import { TableSkeleton } from "@/components/table/TableSkeleton";
import ErrorState from "@/components/ErrorState";
import { StatusBadge } from "../StatusBadge";

import { buildQueryParams } from "@/utils/helper-function";
import { LaundryOrder } from "@/types";

import CreateLaundryOrder from "./CreateLaundryOrder";
import LaundryOrderDetails from "./LaundryOrderDetails";

export const LaundryOrders = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [openCreateLaundryOrderDialog, setOpenCreateLaundryOrderDialog] =
    useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["laundryorders", pagination],

    queryFn: async () => {
      const params = buildQueryParams({
        page: String(pagination.pageIndex + 1),
        limit: String(pagination.pageSize),
      });

      const res = await axios.get(`/api/laundry/order?${params.toString()}`);

      return res.data;
    },
  });

  console.log(data);

  function handleDelete(ids: string[]) {
    // Laundry orders should generally be
    // cancelled rather than deleted.
    console.log("Cancel laundry orders", ids);
  }

  if (isLoading) {
    return <TableSkeleton rows={10} columns={8} />;
  }

  if (isError) {
    return (
      <ErrorState
        title={error?.message ?? "Unable to load laundry orders"}
        description="Please check your connection and try again."
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreateLaundryOrder
          openDialog={openCreateLaundryOrderDialog}
          setOpenDialog={setOpenCreateLaundryOrderDialog}
        />
      </div>

      <CustomTable
        data={(data?.data ?? []) as LaundryOrder[]}
        onDeleteSelected={handleDelete}
        columns={[
          createSelectionColumn<LaundryOrder>(),

          {
            id: "id",
            header: "Order",
            cell: ({ row }) => (
              <div className="font-medium">#{row.original.id.slice(-6)}</div>
            ),
          },

          {
            id: "guest",
            header: "Guest",
            cell: ({ row }) => (
              <div>
                {row.original.guest
                  ? `${row.original.guest.firstName} ${row.original.guest.lastName}`
                  : "—"}
              </div>
            ),
          },

          {
            id: "room",
            header: "Room",
            cell: ({ row }) => (
              <div>{row.original.reservation?.room?.number ?? "—"}</div>
            ),
          },

          {
            id: "items",
            header: "Items",
            cell: ({ row }) => <div>{row.original.items?.length ?? 0}</div>,
          },

          {
            id: "total",
            header: "Total",
            cell: ({ row }) => (
              <div className="font-medium">
                {new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                  maximumFractionDigits: 0,
                }).format(Number(row.original.total ?? 0))}
              </div>
            ),
          },

          {
            id: "status",
            header: "Status",
            cell: ({ row }) => (
              <StatusBadge type="laundry" status={row.original.status} />
            ),
          },

          {
            id: "createdAt",
            header: "Created",
            cell: ({ row }) => (
              <div>{new Date(row.original.createdAt).toLocaleDateString()}</div>
            ),
          },

          {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
              <LaundryOrderDetails laundryOrder={row.original} />
            ),
          },
        ]}
        searcheable
        meta={
          data?.meta as {
            total: number;
            limit: number;
          }
        }
        pagination={pagination}
        onPaginationChange={setPagination}
        emptyTitle="No laundry orders yet"
        emptyDescription="Create your first laundry order."
        emptyActionLabel="New Order"
        onEmptyAction={() => setOpenCreateLaundryOrderDialog(true)}
      />
    </div>
  );
};
