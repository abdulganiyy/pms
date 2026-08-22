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
import { GymMembership } from "@/types";
import { useState } from "react";

type Props = {
  membership: GymMembership;
};

const RoomChargeGymMembership = ({ membership }: Props) => {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState<boolean>(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        `/api/gym/membership/${membership.id}/roomcharge`,
      );

      return res.data;
    },

    onSuccess: () => {
      toast.success("Gym membership charge posted to room");

      queryClient.invalidateQueries({
        queryKey: ["gymmemberships"],
      });

      setOpen(false);
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ?? "Unable to charge membership to room",
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
          <DialogTitle>Charge Gym Membership to Room</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This amount will be added to the guest's folio.
          </p>

          <div className="rounded-lg border p-4">
            <div className="flex justify-between">
              <span>Membership total</span>

              <strong>₦{Number(membership.price).toLocaleString()}</strong>
            </div>

            {membership.reservation?.room?.number && (
              <div className="mt-2 text-sm text-muted-foreground">
                Room {membership.reservation?.room?.number}
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

export default RoomChargeGymMembership;
