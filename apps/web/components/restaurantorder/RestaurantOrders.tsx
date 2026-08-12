"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CustomTable } from "@/components/table/CustomTable";
import axios from "axios";
import { createSelectionColumn } from "@/components/table/SelectionColumn";
import { buildQueryParams } from "@/utils/helper-function";
import ErrorState from "@/components/ErrorState";
import { TableSkeleton } from "@/components/table/TableSkeleton";
import { RestaurantOrder } from "@/types";
import CreateRestaurantOrder from "./CreateRestaurantOrder";
import { StatusBadge } from "../StatusBadge";
import RestaurantOrderDetails from "./RestaurantOrderDetails";
import RestaurantOrderActionMenu from "./RestaurantOrderActionMenu";

// import RestaurantOrderDetails from "./RestaurantOrderDetails";
// import CreateRestaurantOrder from "./CreateRestaurantOrder";
// import EditRestaurantOrder from "./EditRestaurantOrder";
// import DeleteRestaurantOrder from "./DeleteRestaurantOrder";

export const RestaurantOrders = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [openCreateRestaurantOrderDialog, setOpenCreateRestaurantOrderDialog] =
    useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["restaurantorders", pagination],

    queryFn: async () => {
      const params = buildQueryParams({
        page: String(pagination.pageIndex + 1),
        limit: String(pagination.pageSize),
      });

      const res = await axios.get<any>(
        `/api/restaurantorder?${params.toString()}`,
      );

      return res.data;
    },
  });

  function handleDelete(ids: string[]) {
    // Implement bulk deletion/cancellation here
  }

  if (isLoading) {
    return <TableSkeleton rows={10} columns={8} />;
  }

  if (isError) {
    return (
      <ErrorState
        title={error?.message ?? "Unable to load restaurant orders"}
        description="Please check your connection and try again."
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreateRestaurantOrder
          openDialog={openCreateRestaurantOrderDialog}
          setOpenDialog={setOpenCreateRestaurantOrderDialog}
        />
      </div>

      <div>
        <CustomTable
          data={data?.data as RestaurantOrder[]}
          onDeleteSelected={handleDelete}
          columns={[
            createSelectionColumn<RestaurantOrder>(),

            {
              id: "id",
              header: "Order",
              cell: ({ row }) => {
                return (
                  <div className="font-medium">
                    #{row.original.id.slice(-6)}
                  </div>
                );
              },
            },

            {
              id: "roomNumber",
              header: "Room",
              cell: ({ row }) => {
                return (
                  <div>{row.original.reservation?.room?.number ?? "—"}</div>
                );
              },
            },

            {
              id: "guest",
              header: "Guest",
              cell: ({ row }) => {
                return (
                  <div>{`${row.original.guest?.firstName} ${row.original.guest?.lastName}`}</div>
                );
              },
            },

            // {
            //   id: "waiter",
            //   header: "Waiter",
            //   cell: ({ row }) => {
            //     return <div>{"—"}</div>;
            //   },
            // },

            {
              id: "items",
              header: "Items",
              cell: ({ row }) => {
                return <div>{row.original.items?.length ?? 0}</div>;
              },
            },

            // {
            //   id: "subtotal",
            //   header: "Subtotal",
            //   cell: ({ row }) => {
            //     return <div>{row.original.subtotal}</div>;
            //   },
            // },

            // {
            //   id: "tax",
            //   header: "Tax",
            //   cell: ({ row }) => {
            //     return <div>{row.original.tax}</div>;
            //   },
            // },

            {
              id: "total",
              header: "Total",
              cell: ({ row }) => {
                return (
                  <div className="font-medium">
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                      maximumFractionDigits: 0,
                    }).format(row.original.total ?? 0)}
                  </div>
                );
              },
            },

            {
              id: "status",
              header: "Status",
              cell: ({ row }) => {
                const status = row.original.status;

                return <StatusBadge type="restaurant" status={status} />;
              },
            },

            {
              id: "createdAt",
              header: "Created",
              cell: ({ row }) => {
                return (
                  <div>
                    {new Date(row.original.createdAt).toLocaleDateString()}
                  </div>
                );
              },
            },

            {
              header: "Actions",
              cell: ({ row }) => (
                <div className="flex gap-2">
                  <RestaurantOrderDetails restaurantorder={row.original} />
                  {/* <RestaurantOrderActionMenu order={row.original} /> */}
                </div>
              ),
            },
          ]}
          searcheable
          meta={data?.meta as { total: number; limit: number }}
          pagination={pagination}
          onPaginationChange={setPagination}
          emptyTitle="No restaurant orders yet"
          emptyDescription="Create your first restaurant order."
          emptyActionLabel="New Order"
          onEmptyAction={() => {
            setOpenCreateRestaurantOrderDialog(true);
          }}
        />
      </div>
    </div>
  );
};
