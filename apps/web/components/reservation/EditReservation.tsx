"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { editReservationFieldConfig } from "@/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import FormBuilder from "../form/FormBuilder";
import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { ReservationType } from "@/types";
import { editReservationSchema } from "@/schema";
import { Button } from "../ui/button";

type EditReservationProps = {
  reservation: ReservationType | null;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditReservation = ({
  reservation,
  open,
  setOpen,
}: EditReservationProps) => {
  const queryClient = useQueryClient();

  /**
   * Update reservation
   */
  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof editReservationSchema>) => {
      if (!reservation?.id) {
        throw new Error("Reservation ID is required");
      }

      const res = await axios.patch(`/api/reservation/${reservation.id}`, data);

      return res.data;
    },

    onSuccess: () => {
      toast.success("Reservation updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["rooms"],
      });

      setOpen(false);
    },

    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Failed to update reservation",
      );
    },
  });

  async function onSubmit(values: z.infer<typeof editReservationSchema>) {
    await mutation.mutateAsync(values);
  }

  if (!reservation) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button onClick={() => setOpen(true)}>Edit</Button>}
      ></DialogTrigger>
      <DialogContent className="min-w-xl max-h-3/4 overflow-auto">
        <DialogHeader>
          <DialogTitle>Edit Reservation</DialogTitle>

          <FormBuilder
            config={editReservationFieldConfig}
            schema={editReservationSchema}
            onSubmit={onSubmit}
            submitText={
              mutation.isPending ? "Updating..." : "Update Reservation"
            }
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EditReservation;
