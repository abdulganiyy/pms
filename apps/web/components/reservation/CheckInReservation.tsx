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

type CheckInReservationProps = {
  reservationId: string | null;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const CheckInReservation = ({
  reservationId,
  open,
  setOpen,
}: CheckInReservationProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!reservationId) {
        throw new Error("Reservation ID is required");
      }

      const res = await axios.post(`/api/reservation/${reservationId}/checkin`);

      return res.data;
    },

    onSuccess: () => {
      toast.success("Reservation checkedin successfully");

      queryClient.invalidateQueries({
        queryKey: ["rooms"],
      });

      setOpen(false);
    },

    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Failed to check in reservation",
      );
    },
  });

  const handleCheckIn = async () => {
    await mutation.mutateAsync();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={<Button onClick={() => setOpen(true)}>check In</Button>}
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Check In Reservation?</AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be undone. This will permanently checkin the
            reservation on the system.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>
            Cancel Check In
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleCheckIn}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Checking In..." : "Check In Reservation"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CheckInReservation;
