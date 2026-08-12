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
import { createRestaurantOrderFieldConfig } from "@/config";
import { createRestaurantOrderSchema } from "@/schema";
import { useMemo } from "react";
import { Guest, ReservationType } from "@/types";

type CreateRestaurantOrderProps = {
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateRestaurantOrder = ({
  openDialog,
  setOpenDialog,
}: CreateRestaurantOrderProps) => {
  const queryClient = useQueryClient();

  const { data: guests } = useQuery({
    queryKey: ["guests"],
    queryFn: async () => {
      const res = await axios.get<any>(`/api/guest`);
      return res.data;
    },
  });

  const guestOptions = guests?.data?.map((guest: Guest) => ({
    label: `${guest.firstName} ${guest.lastName}`,
    value: guest.id,
  }));

  const { data: menuData, isLoading: isLoadingMenus } = useQuery({
    queryKey: ["menus"],
    queryFn: async () => {
      const res = await axios.get("/api/menu");

      return res.data;
    },
  });

  const { data: reservationData, isLoading: isLoadingReservations } = useQuery({
    queryKey: ["reservations"],
    queryFn: async () => {
      const res = await axios.get("/api/reservation");

      return res.data;
    },
  });

  const reservationOptions = reservationData?.data?.map(
    (reservation: ReservationType) => ({
      label: `${reservation.guest?.firstName} ${reservation.guest?.lastName} -  room ${reservation.room?.number}`,
      value: reservation.id,
    }),
  );

  const fieldConfig = createRestaurantOrderFieldConfig({
    menuItems: menuData?.data ?? [],
    guestOptions,
    reservationOptions,
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof createRestaurantOrderSchema>) => {
      const res = await axios.post("/api/restaurantorder", data);

      return res.data;
    },

    onSuccess: () => {
      toast.success("Restaurant order created successfully");

      queryClient.invalidateQueries({
        queryKey: ["restaurantorders"],
      });

      // If the order affects reservation/folio data,
      // invalidate those queries as well.
      queryClient.invalidateQueries({
        queryKey: ["reservations"],
      });

      setOpenDialog(false);
    },

    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ?? "Unable to create restaurant order",
      );
    },
  });

  async function onSubmit(values: z.infer<typeof createRestaurantOrderSchema>) {
    await mutation.mutateAsync(values);
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger render={<Button>New Order</Button>} />

      <DialogContent className="min-w-xl overflow-auto max-h-3/4">
        <DialogHeader>
          <DialogTitle>Create Restaurant Order</DialogTitle>

          <FormBuilder
            config={fieldConfig}
            schema={createRestaurantOrderSchema}
            onSubmit={onSubmit}
            submitText={
              mutation.isPending ? "Creating..." : "Create Restaurant Order"
            }
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRestaurantOrder;
