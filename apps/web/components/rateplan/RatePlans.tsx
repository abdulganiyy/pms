"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CustomTable } from "@/components/table/CustomTable";
import axios from "axios";
import { createSelectionColumn } from "@/components/table/SelectionColumn";
import { buildQueryParams } from "@/utils/helper-function";
import ErrorState from "@/components/ErrorState";
import { TableSkeleton } from "@/components/table/TableSkeleton";
import { type RatePlan } from "@/types";
import { CreateRatePlan } from "./CreateRatePlan";
import { DeleteRatePlan } from "./DeleteRatePlan";
import { RatePlanDetails } from "./RatePlanDetails";
import { EditRatePlan } from "./EditRatePlan";

const RatePlans = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [openCreateRatePlanDialog, setOpenCreateRatePlanDialog] =
    useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["rateplans", pagination],
    queryFn: async () => {
      const params = buildQueryParams({
        page: String(pagination.pageIndex + 1),
        limit: String(pagination.pageSize),
      });
      const res = await axios.get<any>(`/api/rateplan?${params.toString()}`);
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
        <CreateRatePlan
          openDialog={openCreateRatePlanDialog}
          setOpenDialog={setOpenCreateRatePlanDialog}
        />
      </div>
      <div>
        <CustomTable
          data={data?.data as RatePlan[]}
          onDeleteSelected={handleDelete}
          columns={[
            createSelectionColumn<RatePlan>(),

            {
              accessorKey: "name",
              header: "Name",
            },

            {
              accessorKey: "cancellationPolicy",
              header: "Cancellation Policy",
            },
            {
              accessorKey: "includesBreakfast",
              header: "Includes Breakfast",
            },
            {
              accessorKey: "refundable",
              header: "Refundable",
            },
            {
              header: "Actions",
              cell: ({ row }) => (
                <div className="flex gap-2">
                  <RatePlanDetails rateplan={row.original} />
                  <EditRatePlan rateplan={row.original} />
                  <DeleteRatePlan rateplan={row.original} />
                </div>
              ),
            },
          ]}
          searcheable

          meta={data?.meta as { total: number; limit: number }}
          pagination={pagination}
          onPaginationChange={setPagination}
          emptyTitle="No rate plans yet"
          emptyDescription="Create your first rate plan."
          emptyActionLabel="New Rate Plan"
          onEmptyAction={() => {
            setOpenCreateRatePlanDialog(true);
          }}
        />
      </div>
    </div>
  );
};

export default RatePlans;
