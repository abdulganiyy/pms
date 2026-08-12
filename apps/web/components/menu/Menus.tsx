"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CustomTable } from "@/components/table/CustomTable";
import axios from "axios";
import { createSelectionColumn } from "@/components/table/SelectionColumn";
import { buildQueryParams } from "@/utils/helper-function";
import ErrorState from "@/components/ErrorState";
import { TableSkeleton } from "@/components/table/TableSkeleton";
import { Menu } from "@/types";
import MenuDetails from "./MenuDetails";
import CreateMenu from "./CreateMenu";
import EditMenu from "./EditMenu";
import DeleteMenu from "./DeleteMenu";

export const Menus = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [openCreateMenuDialog, setOpenCreateMenuDialog] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["menus", pagination],
    queryFn: async () => {
      const params = buildQueryParams({
        page: String(pagination.pageIndex + 1),
        limit: String(pagination.pageSize),
      });
      const res = await axios.get<any>(`/api/menu?${params.toString()}`);
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
        title={error?.message ?? "Unable to load menus"}
        description="Please check your connection and try again."
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreateMenu
          openDialog={openCreateMenuDialog}
          setOpenDialog={setOpenCreateMenuDialog}
        />
      </div>
      <div>
        <CustomTable
          data={data?.data as Menu[]}
          onDeleteSelected={handleDelete}
          columns={[
            createSelectionColumn<Menu>(),

            {
              id: "name",
              header: "Menu Title",
              cell: ({ row }) => {
                return <div>{row.original.name}</div>;
              },
            },
            {
              id: "price",
              header: "Menu Price",
              cell: ({ row }) => {
                return <div>{row.original.price}</div>;
              },
            },
            {
              id: "description",
              header: "Menu Description",
              cell: ({ row }) => {
                return <div>{row.original.description}</div>;
              },
            },
            {
              header: "Actions",
              cell: ({ row }) => (
                <div className="flex gap-2">
                  <MenuDetails menu={row.original} />
                  <EditMenu menu={row.original} />
                  <DeleteMenu menu={row.original} />
                </div>
              ),
            },
          ]}
          searcheable

          meta={data?.meta as { total: number; limit: number }}
          pagination={pagination}
          onPaginationChange={setPagination}
          emptyTitle="No menus yet"
          emptyDescription="Create your first rmenu."
          emptyActionLabel="New Menu"
          onEmptyAction={() => {
            setOpenCreateMenuDialog(true);
          }}
        />
      </div>
    </div>
  );
};
