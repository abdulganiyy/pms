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

const DeleteReservation = ({
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

      const res = await axios.delete(`/api/reservation/${reservationId}`);

      return res.data;
    },

    onSuccess: () => {
      toast.success("Reservation deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["rooms"],
      });

      setOpen(false);
    },

    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Failed to delete reservation",
      );
    },
  });

  const handleDelete = async () => {
    await mutation.mutateAsync();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button variant="destructive" onClick={() => setOpen(true)}>
            Delete Reservation
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Reservation?</AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            reservation from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>
            Keep Reservation
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Deleting..." : "Delete Reservation"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteReservation;
