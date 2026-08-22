"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";

import { CustomTable } from "@/components/table/CustomTable";
import { TableSkeleton } from "@/components/table/TableSkeleton";
import ErrorState from "@/components/ErrorState";
import { createSelectionColumn } from "@/components/table/SelectionColumn";
import { StatusBadge } from "../StatusBadge";

import CreateGymMembership from "./CreateGymMembership";
import GymMembershipDetails from "./GymMembershipDetails";
import { GymMembership } from "@/types";

export const GymMemberships = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [openCreate, setOpenCreate] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["gym-memberships", pagination],

    queryFn: async () => {
      const res = await axios.get("/api/gym/membership");

      return res.data;
    },
  });

  if (isLoading) {
    return <TableSkeleton rows={10} columns={8} />;
  }

  if (isError) {
    return (
      <ErrorState
        title={error?.message ?? "Unable to load gym memberships"}
        description="Please check your connection and try again."
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreateGymMembership
          openDialog={openCreate}
          setOpenDialog={setOpenCreate}
        />
      </div>

      <CustomTable
        data={(data?.data ?? []) as GymMembership[]}
        columns={[
          createSelectionColumn<GymMembership>(),

          {
            id: "id",
            header: "Membership",
            cell: ({ row }) => (
              <div className="font-medium">#{row.original.id.slice(-6)}</div>
            ),
          },

          {
            id: "guest",
            header: "Guest",
            cell: ({ row }) =>
              row.original.guest
                ? `${row.original.guest.firstName} ${row.original.guest.lastName}`
                : "—",
          },

          {
            id: "plan",
            header: "Plan",
            cell: ({ row }) => row.original.plan?.name ?? "—",
          },

          {
            id: "startDate",
            header: "Start",
            cell: ({ row }) => format(new Date(row.original.startDate), "PPP"),
          },

          {
            id: "endDate",
            header: "Expires",
            cell: ({ row }) => format(new Date(row.original.endDate), "PPP"),
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
            cell: ({ row }) => (
              <StatusBadge type="gym" status={row.original.status} />
            ),
          },

          {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
              <GymMembershipDetails membership={row.original} />
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
        emptyTitle="No gym memberships"
        emptyDescription="Create your first gym membership."
        emptyActionLabel="New Membership"
        onEmptyAction={() => setOpenCreate(true)}
      />
    </div>
  );
};
