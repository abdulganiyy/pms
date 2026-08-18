"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CustomTable } from "@/components/table/CustomTable";
import axios from "axios";
import { createSelectionColumn } from "@/components/table/SelectionColumn";
import { buildQueryParams } from "@/utils/helper-function";
import ErrorState from "@/components/ErrorState";
import { TableSkeleton } from "@/components/table/TableSkeleton";
import { ReservationType } from "@/types";

import { StatusBadge } from "../StatusBadge";
import { differenceInCalendarDays, format } from "date-fns";
import { Button } from "@base-ui/react";
import { Eye, EyeIcon } from "lucide-react";
import ReservationDetails from "./ReservationDetails";

export const Reservations = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [openCreateReservationDialog, setOpenCreateReservationDialog] =
    useState(false);
  const [openReservationDialog, setOpenReservationDialog] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["rooms", pagination],
    queryFn: async () => {
      const params = buildQueryParams({
        page: String(pagination.pageIndex + 1),
        limit: String(pagination.pageSize),
      });
      const res = await axios.get<any>(`/api/reservation?${params.toString()}`);
      return res.data;
    },
  });

  console.log(data?.data);

  function handleDelete(ids: string[]) {}

  if (isLoading) {
    return <TableSkeleton rows={10} columns={7} />;
  }

  if (isError) {
    return (
      <ErrorState
        title={error?.message ?? "Unable to load reservations"}
        description="Please check your connection and try again."
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {/* <CreateRoom
          openDialog={openCreateRoomDialog}
          setOpenDialog={setOpenCreateRoomDialog}
        /> */}
      </div>
      <div>
        <CustomTable
          data={data?.data as ReservationType[]}
          onDeleteSelected={handleDelete}
          columns={[
            createSelectionColumn<ReservationType>(),
            {
              id: "guest",
              header: "Guest",
              cell: ({ row }) => {
                return (
                  <div>{`${row.original.guest.firstName} ${row.original.guest.lastName}`}</div>
                );
              },
            },
            {
              accessorKey: "checkIn",
              header: "Check In",
              cell: ({ row }) => {
                return (
                  <div>
                    {row.original?.checkIn
                      ? format(new Date(row.original.checkIn), "PPP")
                      : undefined}
                  </div>
                );
              },
            },
            {
              accessorKey: "checkOut",
              header: "Check Out",
              cell: ({ row }) => {
                return (
                  <div>
                    {row.original?.checkOut
                      ? format(new Date(row.original.checkOut), "PPP")
                      : undefined}
                  </div>
                );
              },
            },
            {
              id: "nights",
              header: "Nights",
              cell: ({ row }) => {
                return (
                  <div>
                    {differenceInCalendarDays(
                      row.original.checkOut,
                      row.original.checkIn,
                    )}
                  </div>
                );
              },
            },
            {
              accessorKey: "nightlyRate",
              header: "Rate",
              cell: ({ row }) => {
                return (
                  <div>
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: `${row.original.roomRate?.currency ?? "NGN"}`,
                      maximumFractionDigits: 0,
                    }).format(row.original.nightlyRate ?? 0)}{" "}
                    / night`
                  </div>
                );
              },
            },
            {
              accessorKey: "totalAmount",
              header: "Total Amount",
              cell: ({ row }) => {
                return (
                  <div>
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: `${row.original.roomRate?.currency ?? "NGN"}`,
                      maximumFractionDigits: 0,
                    }).format(row.original.totalAmount ?? 0)}
                    `
                  </div>
                );
              },
            },
            {
              id: "adults",
              header: "Adults",
              cell: ({ row }) => {
                return <div>{row.original.adults}</div>;
              },
            },
            {
              id: "children",
              header: "Children",
              cell: ({ row }) => {
                return <div>{row.original.children}</div>;
              },
            },
            {
              id: "type",
              header: "Reseravtion Type",
              cell: ({ row }) => {
                return (
                  <div>
                    <StatusBadge
                      type="reservationType"
                      status={row.original.type}
                    />
                  </div>
                );
              },
            },
            {
              accessorKey: "status",
              header: "Reservation Status",
              cell: ({ row }) => {
                return (
                  <div>
                    <StatusBadge
                      type="reservation"
                      status={row.original.status}
                    />
                  </div>
                );
              },
            },
            {
              header: "Actions",
              cell: ({ row }) => (
                <div className="flex gap-2">
                  <Button onClick={() => setOpenReservationDialog(true)}>
                    <EyeIcon />
                  </Button>
                  <ReservationDetails
                    reservation={row.original}
                    openDialog={openReservationDialog}
                    setOpenDialog={setOpenReservationDialog}
                  />
                </div>
              ),
            },
          ]}
          searcheable

          meta={data?.meta as { total: number; limit: number }}
          pagination={pagination}
          onPaginationChange={setPagination}
          emptyTitle="No rooms yet"
          emptyDescription="Create your first reservation."
          emptyActionLabel="New Reservation"
          onEmptyAction={() => {
            setOpenCreateReservationDialog(true);
          }}
        />
      </div>
    </div>
  );
};
