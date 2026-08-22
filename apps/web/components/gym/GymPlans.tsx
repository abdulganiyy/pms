"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { CustomTable } from "@/components/table/CustomTable";
import { TableSkeleton } from "@/components/table/TableSkeleton";
import ErrorState from "@/components/ErrorState";
import { createSelectionColumn } from "@/components/table/SelectionColumn";

import CreateGymPlan from "./CreateGymPlan";
import { formatGymDuration } from "@/utils/helper-function";

type GymPlan = {
  id: string;
  name: string;
  description?: string;
  duration: string;
  durationValue: number;
  price: number | string;
  isActive: boolean;
};

export const GymPlans = () => {
  const [openCreate, setOpenCreate] = useState(false);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["gym-plans"],

    queryFn: async () => {
      const res = await axios.get("/api/gym/plan");

      return res.data;
    },
  });

  if (isLoading) {
    return <TableSkeleton rows={8} columns={6} />;
  }

  if (isError) {
    return (
      <ErrorState
        title={error?.message ?? "Unable to load gym plans"}
        description="Please check your connection and try again."
        onRetry={refetch}
      />
    );
  }

  console.log(data);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreateGymPlan openDialog={openCreate} setOpenDialog={setOpenCreate} />
      </div>

      <CustomTable
        data={(data ?? []) as GymPlan[]}
        columns={[
          createSelectionColumn<GymPlan>(),

          {
            id: "name",
            header: "Plan",
            cell: ({ row }) => (
              <div className="font-medium">{row.original.name}</div>
            ),
          },

          {
            id: "duration",
            header: "Duration",
            cell: ({ row }) =>
              formatGymDuration(
                row.original.duration,
                row.original.durationValue,
              ),
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
            id: "status",
            header: "Status",
            cell: ({ row }) => (row.original.isActive ? "Active" : "Inactive"),
          },
        ]}
        meta={
          { total: 10, limit: 10 } as {
            total: number;
            limit: number;
          }
        }
        showPagination={false}
        pagination={pagination}
        onPaginationChange={setPagination}
        emptyTitle="No gym plans"
        emptyDescription="Create a membership plan before registering members."
        emptyActionLabel="New Plan"
        onEmptyAction={() => setOpenCreate(true)}
      />
    </div>
  );
};
