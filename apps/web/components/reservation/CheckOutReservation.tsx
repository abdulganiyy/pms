"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "../ui/button";

type DeleteReservationProps = {
  reservationId: string | null;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const CheckOutReservation = ({
  reservationId,
  open,
  setOpen,
}: DeleteReservationProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!reservationId) {
        throw new Error("Reservation ID is required");
      }

      const res = await axios.post(
        `/api/reservation/${reservationId}/checkout`,
      );

      return res.data;
    },

    onSuccess: () => {
      toast.success("Reservation checked out successfully");

      queryClient.invalidateQueries({
        queryKey: ["rooms"],
      });

      setOpen(false);
    },

    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Failed to check out reservation",
      );
    },
  });

  const handleChecIn = async () => {
    await mutation.mutateAsync();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={<Button onClick={() => setOpen(true)}>check Out</Button>}
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Check Out Reservation?</AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be undone. This will permanently checkout the
            reservation on the system.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>
            Cancel Check Out
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleChecIn}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Checking Out..." : "Check Out Reservation"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CheckOutReservation;
