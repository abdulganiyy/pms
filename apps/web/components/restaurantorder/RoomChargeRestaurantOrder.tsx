"use client";

import axios from "axios";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { RestaurantOrder } from "@/types";

type Props = {
  order: RestaurantOrder;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const RoomChargeRestaurantOrder = ({ order, open, setOpen }: Props) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        `/api/restaurantorder/${order.id}/roomcharge`,
      );

      return res.data;
    },

    onSuccess: () => {
      toast.success("Restaurant charge posted to room");

      queryClient.invalidateQueries({
        queryKey: ["restaurantorders"],
      });

      setOpen(false);
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Unable to charge room");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Charge Restaurant Order to Room</DialogTitle>
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

export default RoomChargeRestaurantOrder;
