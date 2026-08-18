"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CustomTable } from "@/components/table/CustomTable";
import axios from "axios";
import { createSelectionColumn } from "@/components/table/SelectionColumn";
import { buildQueryParams } from "@/utils/helper-function";
import ErrorState from "@/components/ErrorState";
import { TableSkeleton } from "@/components/table/TableSkeleton";
import { Maintenance } from "@/types";

import { StatusBadge } from "../StatusBadge";
import CreateMaintenance from "./CreateMaintenance";
import MaintenanceDetails from "./MaintenanceDetails";
import DeleteMaintenance from "./CancelMaintenance";
import CancelMaintenance from "./CancelMaintenance";

export const Maintenances = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [openCreateMaintenanceDialog, setOpenCreateMaintenanceDialog] =
    useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["maintenances", pagination],
    queryFn: async () => {
      const params = buildQueryParams({
        page: String(pagination.pageIndex + 1),
        limit: String(pagination.pageSize),
      });
      const res = await axios.get<any>(`/api/maintenance?${params.toString()}`);
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
        title={error?.message ?? "Unable to load maintenance tasks"}
        description="Please check your connection and try again."
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreateMaintenance
          openDialog={openCreateMaintenanceDialog}
          setOpenDialog={setOpenCreateMaintenanceDialog}
        />
      </div>
      <div>
        <CustomTable
          data={data?.data as Maintenance[]}
          onDeleteSelected={handleDelete}
          columns={[
            createSelectionColumn<Maintenance>(),
            {
              id: "room",
              header: "Room",
              cell: ({ row }) => {
                return <div>{row.original?.room.number}</div>;
              },
            },

            {
              accessorKey: "title",
              header: "Title",
            },

            {
              accessorKey: "description",
              header: "Description",
              cell: ({ row }) => {
                return <div>{row.original.description}</div>;
              },
            },
            {
              accessorKey: "assignedTo",
              header: "Assigned To",
              cell: ({ row }) => {
                return <div>{row.original?.assignedTo?.fullname}</div>;
              },
            },
            {
              accessorKey: "status",
              header: "Status",
              cell: ({ row }) => {
                return (
                  <div>
                    <StatusBadge type="room" status={row.original.status} />
                  </div>
                );
              },
            },
            {
              accessorKey: "priority",
              header: "Priority Status",
              cell: ({ row }) => {
                return (
                  <div>
                    <StatusBadge type="room" status={row.original.priority} />
                  </div>
                );
              },
            },
            {
              header: "Actions",
              cell: ({ row }) => (
                <div className="flex gap-2">
                  <MaintenanceDetails maintenance={row.original} />
                  <CancelMaintenance maintenance={row.original} />
                </div>
              ),
            },
          ]}
          searcheable

          meta={data?.meta as { total: number; limit: number }}
          pagination={pagination}
          onPaginationChange={setPagination}
          emptyTitle="No maintenance tasks yet"
          emptyDescription="Create your first maintenance task."
          emptyActionLabel="New Maintenance Task"
          onEmptyAction={() => {
            setOpenCreateMaintenanceDialog(true);
          }}
        />
      </div>
    </div>
  );
};
