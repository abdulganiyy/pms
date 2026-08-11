"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CustomTable } from "@/components/table/CustomTable";
import axios from "axios";
import { createSelectionColumn } from "@/components/table/SelectionColumn";
import { buildQueryParams } from "@/utils/helper-function";
import ErrorState from "@/components/ErrorState";
import { TableSkeleton } from "@/components/table/TableSkeleton";
import { Room } from "@/types";
import RoomDetails from "./RoomDetails";
import EditRoom from "./EditRoom";
import DeleteRoom from "./DeleteRoom";
import CreateRoom from "./CreateRoom";
import { StatusBadge } from "../StatusBadge";

export const Rooms = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [openCreateRoomDialog, setOpenCreateRoomDialog] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["rooms", pagination],
    queryFn: async () => {
      const params = buildQueryParams({
        page: String(pagination.pageIndex + 1),
        limit: String(pagination.pageSize),
      });
      const res = await axios.get<any>(`/api/room?${params.toString()}`);
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
        title={error?.message ?? "Unable to load rooms"}
        description="Please check your connection and try again."
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreateRoom
          openDialog={openCreateRoomDialog}
          setOpenDialog={setOpenCreateRoomDialog}
        />
      </div>
      <div>
        <CustomTable
          data={data?.data as Room[]}
          onDeleteSelected={handleDelete}
          columns={[
            createSelectionColumn<Room>(),

            {
              accessorKey: "number",
              header: "Room Number",
            },

            {
              id: "type",
              header: "Room Type",
              cell: ({ row }) => {
                return <div>{row.original.roomType.name}</div>;
              },
            },
            {
              accessorKey: "floor",
              header: "Floor",
              cell: ({ row }) => {
                return <div>{row.original?.floor}</div>;
              },
            },
            {
              accessorKey: "status",
              header: "Room Status",
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
                  <RoomDetails room={row.original} />
                  <EditRoom room={row.original} />
                  <DeleteRoom room={row.original} />
                </div>
              ),
            },
          ]}
          searcheable

          meta={data?.meta as { total: number; limit: number }}
          pagination={pagination}
          onPaginationChange={setPagination}
          emptyTitle="No rooms yet"
          emptyDescription="Create your first room."
          emptyActionLabel="New Room"
          onEmptyAction={() => {
            setOpenCreateRoomDialog(true);
          }}
        />
      </div>
    </div>
  );
};
