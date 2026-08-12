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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { RestaurantOrder } from "@/types";

type Props = {
  order: RestaurantOrder;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const RefundRestaurantOrder = ({ order, open, setOpen }: Props) => {
  const queryClient = useQueryClient();

  const [amount, setAmount] = useState(String(order.total));

  const [reason, setReason] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(`/api/restaurantorder/${order.id}/refund`, {
        amount: Number(amount),
        reason,
      });

      return res.data;
    },

    onSuccess: () => {
      toast.success("Refund processed successfully");

      queryClient.invalidateQueries({
        queryKey: ["restaurantorders"],
      });

      setOpen(false);
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Unable to process refund");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Refund Restaurant Order</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <div className="flex justify-between">
              <span>Order total</span>

              <strong>₦{Number(order.total).toLocaleString()}</strong>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Refund Amount</label>

            <Input
              type="number"
              min={0}
              max={Number(order.total)}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Reason</label>

            <Textarea
              placeholder="Why is this order being refunded?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <Button
            variant="destructive"
            className="w-full"
            disabled={mutation.isPending || Number(amount) <= 0}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? "Processing refund..." : "Refund Order"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RefundRestaurantOrder;
