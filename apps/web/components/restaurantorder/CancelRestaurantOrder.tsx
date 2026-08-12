"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";

import { RestaurantOrder } from "@/types";

type Props = {
  order: RestaurantOrder;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CancelRestaurantOrder = ({ order, open, setOpen }: Props) => {
  const queryClient = useQueryClient();

  const [reason, setReason] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(`/api/restaurantorder/${order.id}/cancel`, {
        reason,
      });

      return res.data;
    },

    onSuccess: () => {
      toast.success("Restaurant order cancelled");

      queryClient.invalidateQueries({
        queryKey: ["restaurantorders"],
      });

      setOpen(false);
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Unable to cancel order");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Restaurant Order</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Cancelling this order will preserve the order record for audit
            purposes.
          </p>

          <Textarea
            placeholder="Enter cancellation reason..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />

          <Button
            variant="destructive"
            className="w-full"
            disabled={mutation.isPending || !reason.trim()}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? "Cancelling..." : "Cancel Order"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CancelRestaurantOrder;
