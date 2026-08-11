"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cancelReservationFieldConfig } from "@/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import FormBuilder from "../form/FormBuilder";
import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { ReservationType } from "@/types";
import { cancelReservationSchema } from "@/schema";
import { Button } from "../ui/button";

type CancelReservationProps = {
  reservationId: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const CancelReservation = ({
  reservationId,
  open,
  setOpen,
}: CancelReservationProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof cancelReservationSchema>) => {
      if (!reservationId) {
        throw new Error("Reservation ID is required");
      }

      const res = await axios.post(
        `/api/reservation/${reservationId}/cancel`,
        data,
      );

      return res.data;
    },

    onSuccess: () => {
      toast.success("Reservation cancelled successfully");

      queryClient.invalidateQueries({
        queryKey: ["rooms"],
      });

      setOpen(false);
    },

    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Failed to cancel reservation",
      );
    },
  });

  async function onSubmit(values: z.infer<typeof cancelReservationSchema>) {
    await mutation.mutateAsync(values);
  }

  if (!reservationId) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="destructive" onClick={() => setOpen(true)}>
            Cancel Reservation
          </Button>
        }
      ></DialogTrigger>
      <DialogContent className="min-w-xl max-h-3/4 overflow-auto">
        <DialogHeader>
          <DialogTitle>Cancel Reservation</DialogTitle>

          <FormBuilder
            config={cancelReservationFieldConfig}
            schema={cancelReservationSchema}
            onSubmit={onSubmit}
            submitText={
              mutation.isPending ? "Cancelling..." : "Cancel Reservation"
            }
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CancelReservation;
