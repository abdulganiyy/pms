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
  DialogTrigger,
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

import { LaundryOrder } from "@/types";

type Props = {
  order: LaundryOrder;
};

const PayLaundryOrder = ({ order }: Props) => {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState<boolean>(false);

  const [method, setMethod] = useState<"CASH" | "CARD">("CASH");

  const [amount, setAmount] = useState(String(order.total));

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(`/api/laundry/order/${order.id}/pay`, {
        method,
        amount: Number(amount),
      });

      return res.data;
    },

    onSuccess: () => {
      toast.success("Laundry payment recorded successfully");

      queryClient.invalidateQueries({
        queryKey: ["laundryorders"],
      });

      setOpen(false);
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ?? "Unable to record laundry payment",
      );
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="outline">Pay</Button>}
      ></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Laundry Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Laundry order total</p>

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

export default PayLaundryOrder;
