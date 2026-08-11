"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CustomTable } from "@/components/table/CustomTable";
import axios from "axios";
import { createSelectionColumn } from "@/components/table/SelectionColumn";
import { buildQueryParams } from "@/utils/helper-function";
import ErrorState from "@/components/ErrorState";
import { TableSkeleton } from "@/components/table/TableSkeleton";
import { RoomRate } from "@/types";
import CreateRoomRate from "./CreateRoomRate";
import RoomRateDetails from "./RoomRateDetails";
import EditRoomRate from "./EditRoomRate";
import DeleteRoomRate from "./DeleteRoomRate";
import { format } from "date-fns";

export const RoomRates = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [openCreateRoomRateDialog, setOpenCreateRoomRateDialog] =
    useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["roomrates", pagination],
    queryFn: async () => {
      const params = buildQueryParams({
        page: String(pagination.pageIndex + 1),
        limit: String(pagination.pageSize),
      });
      const res = await axios.get<any>(`/api/roomrate?${params.toString()}`);
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
        title={error?.message ?? "Unable to load room rates"}
        description="Please check your connection and try again."
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreateRoomRate
          openDialog={openCreateRoomRateDialog}
          setOpenDialog={setOpenCreateRoomRateDialog}
        />
      </div>
      <div>
        <CustomTable
          data={data?.data as RoomRate[]}
          onDeleteSelected={handleDelete}
          columns={[
            createSelectionColumn<RoomRate>(),

            {
              id: "roomType",
              header: "Room Type",
              cell: ({ row }) => {
                return <div>{row.original.roomType.name}</div>;
              },
            },

            {
              id: "ratePlan",
              header: "Rate Plan",
              cell: ({ row }) => {
                return <div>{row.original.ratePlan.name}</div>;
              },
            },

            {
              accessorKey: "startDate",
              header: "Start Date",
              cell: ({ row }) => {
                return (
                  <div>{format(row.original.startDate, "MMMM do, yyyy")}</div>
                );
              },
            },
            {
              accessorKey: "endDate",
              header: "End Date",
              cell: ({ row }) => {
                return (
                  <div>{format(row.original.endDate, "MMMM do, yyyy")}</div>
                );
              },
            },
            {
              accessorKey: "price",
              header: "Price",
            },
            {
              accessorKey: "currency",
              header: "Currency",
            },

            {
              header: "Actions",
              cell: ({ row }) => (
                <div className="flex gap-2">
                  <RoomRateDetails roomrate={row.original} />
                  <EditRoomRate roomrate={row.original} />
                  <DeleteRoomRate roomrate={row.original} />
                </div>
              ),
            },
          ]}
          meta={data?.meta as { total: number; limit: number }}
          pagination={pagination}
          onPaginationChange={setPagination}
          emptyTitle="No room rates yet"
          emptyDescription="Create your first room rate."
          emptyActionLabel="New Room Rate"
          onEmptyAction={() => {
            setOpenCreateRoomRateDialog(true);
          }}
        />
      </div>
    </div>
  );
};
