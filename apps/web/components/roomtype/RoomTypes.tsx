"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CustomTable } from "@/components/table/CustomTable";
import axios from "axios";
import { createSelectionColumn } from "@/components/table/SelectionColumn";
import { buildQueryParams } from "@/utils/helper-function";
import ErrorState from "@/components/ErrorState";
import { TableSkeleton } from "@/components/table/TableSkeleton";
import { type RoomType as Roomtype, User } from "@/types";
import CreateNewRoomType from "./CreateNewRoomType";
import RoomType from "./RoomType";
import EditRoomType from "./EditRoomType";
import DeleteRoomType from "./DeleteRoomType";

export const RoomTypes = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [openCreateRoomTypeDialog, setOpenCreateRoomTypeDialog] =
    useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["roomtypes", pagination],
    queryFn: async () => {
      const params = buildQueryParams({
        page: String(pagination.pageIndex + 1),
        limit: String(pagination.pageSize),
      });
      const res = await axios.get<any>(`/api/roomtype?${params.toString()}`);
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
        title={error?.message ?? "Unable to load room types"}
        description="Please check your connection and try again."
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreateNewRoomType
          openDialog={openCreateRoomTypeDialog}
          setOpenDialog={setOpenCreateRoomTypeDialog}
        />
      </div>
      <div>
        <CustomTable
          data={data?.data as Roomtype[]}
          onDeleteSelected={handleDelete}
          columns={[
            createSelectionColumn<Roomtype>(),

            {
              accessorKey: "name",
              header: "Name",
            },

            {
              accessorKey: "code",
              header: "Code",
            },
            {
              accessorKey: "description",
              header: "Description",
            },
            {
              accessorKey: "maxAdults",
              header: "Max Adults",
            },
            {
              accessorKey: "maxChildren",
              header: "Max Children",
            },
            {
              accessorKey: "baseOccupancy",
              header: "Base Occupancy",
            },
            {
              accessorKey: "size",
              header: "Room Size",
            },
            {
              header: "Actions",
              cell: ({ row }) => (
                <div className="flex gap-2">
                  <RoomType roomtype={row.original} />
                  <EditRoomType roomtype={row.original} />
                  <DeleteRoomType roomtype={row.original} />
                </div>
              ),
            },
          ]}
          searcheable

          meta={data?.meta as { total: number; limit: number }}
          pagination={pagination}
          onPaginationChange={setPagination}
          emptyTitle="No room types yet"
          emptyDescription="Create your first room type."
          emptyActionLabel="New Room Type"
          onEmptyAction={() => {
            setOpenCreateRoomTypeDialog(true);
          }}
        />
      </div>
    </div>
  );
};
