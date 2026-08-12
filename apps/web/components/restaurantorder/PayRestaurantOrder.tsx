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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { RestaurantOrder } from "@/types";

type Props = {
  order: RestaurantOrder;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const PayRestaurantOrder = ({ order, open, setOpen }: Props) => {
  const queryClient = useQueryClient();

  const [method, setMethod] = useState<"CASH" | "CARD">("CASH");

  const [amount, setAmount] = useState(String(order.total));

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(`/api/restaurantorder/${order.id}/pay`, {
        method,
        amount: Number(amount),
      });

      return res.data;
    },

    onSuccess: () => {
      toast.success("Payment recorded successfully");

      queryClient.invalidateQueries({
        queryKey: ["restaurantorders"],
      });

      setOpen(false);
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Unable to record payment");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Restaurant Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Order total</p>

            <p className="text-lg font-semibold">
              ₦{Number(order.total).toLocaleString()}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Method</label>

            <Select
              value={method}
              onValueChange={(value) => setMethod(value as "CASH" | "CARD")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="CASH">Cash</SelectItem>

                <SelectItem value="CARD">Card</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>

            <Input
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <Button
            className="w-full"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? "Processing..." : "Record Payment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PayRestaurantOrder;
