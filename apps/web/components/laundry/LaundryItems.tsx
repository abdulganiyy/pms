"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { CustomTable } from "@/components/table/CustomTable";
import { TableSkeleton } from "@/components/table/TableSkeleton";
import ErrorState from "@/components/ErrorState";
import { createSelectionColumn } from "@/components/table/SelectionColumn";
import CreateLaundryItem from "./CreateLaundryItem";

type LaundryItem = {
  id: string;
  name: string;
  description?: string;
  type: string;
  price: number | string;
  isActive: boolean;
};

export const LaundryItems = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["laundry-items"],

    queryFn: async () => {
      const res = await axios.get("/api/laundry/item");

      return res.data;
    },
  });

  if (isLoading) {
    return <TableSkeleton rows={10} columns={6} />;
  }

  if (isError) {
    return (
      <ErrorState
        title={error?.message ?? "Unable to load laundry items"}
        description="Please check your connection and try again."
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreateLaundryItem
          openDialog={openCreate}
          setOpenDialog={setOpenCreate}
        />
      </div>

      <CustomTable
        data={(data ?? []) as LaundryItem[]}
        columns={[
          createSelectionColumn<LaundryItem>(),

          {
            id: "name",
            header: "Name",
            cell: ({ row }) => (
              <div className="font-medium">{row.original.name}</div>
            ),
          },

          {
            id: "type",
            header: "Type",
            cell: ({ row }) => row.original.type,
          },

          {
            id: "price",
            header: "Price",
            cell: ({ row }) =>
              new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
                maximumFractionDigits: 0,
              }).format(Number(row.original.price)),
          },

          {
            id: "active",
            header: "Status",
            cell: ({ row }) => (row.original.isActive ? "Active" : "Inactive"),
          },
        ]}
        searcheable
        meta={
          { total: 10, limit: 10 } as {
            total: number;
            limit: number;
          }
        }
        pagination={pagination}
        onPaginationChange={setPagination}
        emptyTitle="No laundry items"
        emptyDescription="Create laundry services before creating orders."
        emptyActionLabel="New Laundry Item"
        onEmptyAction={() => setOpenCreate(true)}
      />
    </div>
  );
};
