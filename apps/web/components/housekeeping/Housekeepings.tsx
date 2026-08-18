"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CustomTable } from "@/components/table/CustomTable";
import axios from "axios";
import { createSelectionColumn } from "@/components/table/SelectionColumn";
import { buildQueryParams } from "@/utils/helper-function";
import ErrorState from "@/components/ErrorState";
import { TableSkeleton } from "@/components/table/TableSkeleton";
import { Housekeeping } from "@/types";

import { StatusBadge } from "../StatusBadge";
import CreateHousekeepingTask from "./CreateHousekeepingTask";
import HousekeepingDetails from "./HousekeepingDetails";
import CancelHousekeeping from "./CancelHousekeeping";

export const Housekeepings = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [openCreateHousekeepingDialog, setOpenCreateHousekeepingDialog] =
    useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["housekeepings", pagination],
    queryFn: async () => {
      const params = buildQueryParams({
        page: String(pagination.pageIndex + 1),
        limit: String(pagination.pageSize),
      });
      const res = await axios.get<any>(
        `/api/housekeeping?${params.toString()}`,
      );
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
        title={error?.message ?? "Unable to load housekeeping tasks"}
        description="Please check your connection and try again."
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreateHousekeepingTask
          openDialog={openCreateHousekeepingDialog}
          setOpenDialog={setOpenCreateHousekeepingDialog}
        />
      </div>
      <div>
        <CustomTable
          data={data?.data as Housekeeping[]}
          onDeleteSelected={handleDelete}
          columns={[
            createSelectionColumn<Housekeeping>(),
            {
              id: "room",
              header: "Room",
              cell: ({ row }) => {
                return <div>{row.original?.room.number}</div>;
              },
            },

            {
              accessorKey: "notes",
              header: "Notes",
              cell: ({ row }) => {
                return <div>{row.original.notes}</div>;
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
              header: "Actions",
              cell: ({ row }) => (
                <div className="flex gap-2">
                  <HousekeepingDetails housekeeping={row.original} />
                  <CancelHousekeeping housekeeping={row.original} />
                </div>
              ),
            },
          ]}
          searcheable

          meta={data?.meta as { total: number; limit: number }}
          pagination={pagination}
          onPaginationChange={setPagination}
          emptyTitle="No housekeeping tasks yet"
          emptyDescription="Create your first housekeeping task."
          emptyActionLabel="New Housekeeping Task"
          onEmptyAction={() => {
            setOpenCreateHousekeepingDialog(true);
          }}
        />
      </div>
    </div>
  );
};
