"use client";

import axios from "axios";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { LaundryOrder } from "@/types";
import { useState } from "react";

type Props = {
  order: LaundryOrder;
};

const RoomChargeLaundryOrder = ({ order }: Props) => {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState<boolean>(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(`/api/laundry/order/${order.id}/roomcharge`);

      return res.data;
    },

    onSuccess: () => {
      toast.success("Laundry charge posted to room");

      queryClient.invalidateQueries({
        queryKey: ["laundryorders"],
      });

      setOpen(false);
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          "Unable to charge laundry order to room",
      );
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="outline">Room Charge</Button>}
      ></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Charge Laundry Order to Room</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This amount will be added to the guest's folio.
          </p>

          <div className="rounded-lg border p-4">
            <div className="flex justify-between">
              <span>Order total</span>

              <strong>₦{Number(order.total).toLocaleString()}</strong>
            </div>

            {order.roomNumber && (
              <div className="mt-2 text-sm text-muted-foreground">
                Room {order.roomNumber}
              </div>
            )}
          </div>

          <Button
            className="w-full"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? "Posting charge..." : "Charge to Room"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoomChargeLaundryOrder;
