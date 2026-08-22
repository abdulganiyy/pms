"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import FormBuilder from "../form/FormBuilder";
import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useMemo } from "react";

import { Guest, ReservationType } from "@/types";
import { createLaundryOrderFieldConfig } from "@/config";
import { createLaundryOrderSchema } from "@/schema";

type CreateLaundryOrderProps = {
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateLaundryOrder = ({
  openDialog,
  setOpenDialog,
}: CreateLaundryOrderProps) => {
  const queryClient = useQueryClient();

  const { data: guests } = useQuery({
    queryKey: ["guests"],
    queryFn: async () => {
      const res = await axios.get("/api/guest");
      return res.data;
    },
  });

  const guestOptions = useMemo(
    () =>
      guests?.data?.map((guest: Guest) => ({
        label: `${guest.firstName} ${guest.lastName}`,
        value: guest.id,
      })) ?? [],
    [guests],
  );

  const { data: laundryData, isLoading: isLoadingLaundry } = useQuery({
    queryKey: ["laundry-items"],
    queryFn: async () => {
      const res = await axios.get("/api/laundry/item");
      return res.data;
    },
  });

  console.log(laundryData);

  const { data: reservationData, isLoading: isLoadingReservations } = useQuery({
    queryKey: ["reservations"],
    queryFn: async () => {
      const res = await axios.get("/api/reservation");
      return res.data;
    },
  });

  const reservationOptions = useMemo(
    () =>
      reservationData?.data?.map((reservation: ReservationType) => ({
        label: `${reservation.guest?.firstName ?? ""} ${
          reservation.guest?.lastName ?? ""
        } - Room ${reservation.room?.number ?? "—"} (${new Date(
          reservation.checkIn,
        ).toLocaleDateString()} - ${new Date(
          reservation.checkOut,
        ).toLocaleDateString()})`,
        value: reservation.id,
      })) ?? [],
    [reservationData],
  );

  const fieldConfig = useMemo(
    () =>
      createLaundryOrderFieldConfig({
        laundryItems: laundryData ?? [],
        guestOptions,
        reservationOptions,
      }),
    [laundryData, guestOptions, reservationOptions],
  );

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof createLaundryOrderSchema>) => {
      const res = await axios.post("/api/laundry/order", data);

      return res.data;
    },

    onSuccess: () => {
      toast.success("Laundry order created successfully");

      queryClient.invalidateQueries({
        queryKey: ["laundryorders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["reservations"],
      });

      setOpenDialog(false);
    },

    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ?? "Unable to create laundry order",
      );
    },
  });

  async function onSubmit(values: z.infer<typeof createLaundryOrderSchema>) {
    await mutation.mutateAsync(values);
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger render={<Button>New Order</Button>} />

      <DialogContent className="min-w-xl max-h-3/4 overflow-auto">
        <DialogHeader>
          <DialogTitle>Create Laundry Order</DialogTitle>

          <FormBuilder
            config={fieldConfig}
            schema={createLaundryOrderSchema}
            onSubmit={onSubmit}
            submitText={
              mutation.isPending ? "Creating..." : "Create Laundry Order"
            }
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLaundryOrder;
