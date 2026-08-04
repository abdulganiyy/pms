"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CustomTable } from "@/components/table/CustomTable";
import Status from "@/components/Status";
import axios from "axios";
import { Edit, Edit2, EyeIcon, Pen, Plus, Trash, Trash2 } from "lucide-react";
import { createSelectionColumn } from "@/components/table/SelectionColumn";
import { buildQueryParams } from "@/utils/helper-function";
import ErrorState from "@/components/ErrorState";
import { TableSkeleton } from "@/components/table/TableSkeleton";
import { IconDialog } from "@/components/IconDialog";
import CreateNewGuest from "@/components/guest/CreateNewGuest";
import EditGuest from "@/components/guest/EditGuest";
import { Guest } from "@/types";
import GuestDetails from "@/components/guest/GuestDetails";
import DeleteGuest from "@/components/guest/DeleteGuest";

export default function GuestPage() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [openCreateNewGuestDialog, setOpenCreateNewGuestDialog] =
    useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["guests", pagination.pageIndex, pagination.pageSize],
    queryFn: async () => {
      const params = buildQueryParams({
        page: String(pagination.pageIndex + 1),
        limit: String(pagination.pageSize),
      });
      const res = await axios.get<any>(`/api/guest?${params.toString()}`);
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
        title="Unable to load guests"
        description="Please check your connection and try again."
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-[#1F384C] text-lg leading-5.75">
          Guest Management
        </h2>

        <CreateNewGuest
          openDialog={openCreateNewGuestDialog}
          setOpenDialog={setOpenCreateNewGuestDialog}
        />
      </div>
      <div>
        <CustomTable
          data={data.data as Guest[]}
          onDeleteSelected={handleDelete}
          columns={[
            createSelectionColumn<Guest>(),
            {
              id: "user",
              header: "Full Name",
              cell: ({ row }) => {
                const { firstName, lastName } = row.original;

                return (
                  <div>
                    {firstName} {lastName}
                  </div>
                );
              },
            },

            {
              accessorKey: "phone",
              header: "Phone Number",
            },
            {
              accessorKey: "email",
              header: "Email",
            },
            {
              accessorKey: "nationality",
              header: "Country",
            },
            {
              header: "Actions",
              cell: ({ row }) => (
                <div className="flex gap-2">
                  <GuestDetails guest={row.original} />
                  <EditGuest guest={row.original} />
                  <DeleteGuest guest={row.original} />
                </div>
              ),
            },
          ]}
          searcheable

          meta={data?.meta as { total: number; limit: number }}
          pagination={pagination}
          onPaginationChange={setPagination}
          emptyTitle="No guests yet"
          emptyDescription="Create your first guest to get started."
          emptyActionLabel="New Guest"
          onEmptyAction={() => {
            setOpenCreateNewGuestDialog(true);
          }}
        />
      </div>
    </div>
  );
}
