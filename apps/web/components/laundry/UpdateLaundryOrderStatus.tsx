"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

import { Button } from "../ui/button";
import { LaundryOrder } from "@/types";

type Props = {
  order: LaundryOrder;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const UpdateLaundryOrderStatus = ({ order }: Props) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (status: string) => {
      const res = await axios.patch(`/api/laundry/orders/${order.id}/status`, {
        status,
      });

      return res.data;
    },

    onSuccess: () => {
      toast.success("Laundry order updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["laundryorders"],
      });
    },

    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ?? "Unable to update laundry order",
      );
    },
  });

  const handleUpdate = (status: string) => {
    mutation.mutate(status);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {order.status === "PENDING" && (
        <Button
          onClick={() => handleUpdate("RECEIVED")}
          disabled={mutation.isPending}
        >
          Receive
        </Button>
      )}

      {order.status === "RECEIVED" && (
        <Button
          onClick={() => handleUpdate("PROCESSING")}
          disabled={mutation.isPending}
        >
          Start Processing
        </Button>
      )}

      {order.status === "PROCESSING" && (
        <Button
          onClick={() => handleUpdate("READY")}
          disabled={mutation.isPending}
        >
          Mark Ready
        </Button>
      )}

      {order.status === "READY" && (
        <Button
          onClick={() => handleUpdate("DELIVERED")}
          disabled={mutation.isPending}
        >
          Deliver
        </Button>
      )}

      {["PENDING", "RECEIVED", "PROCESSING"].includes(order.status) && (
        <Button
          variant="destructive"
          onClick={() => handleUpdate("CANCELLED")}
          disabled={mutation.isPending}
        >
          Cancel
        </Button>
      )}
    </div>
  );
};

export default UpdateLaundryOrderStatus;
