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
import { Button } from "../ui/button";

import axios from "axios";
import { toast } from "sonner";
import z from "zod";
import { useMemo } from "react";

import { Guest, ReservationType } from "@/types";

import { createGymMembershipFieldConfig } from "@/config";

import { createGymMembershipSchema } from "@/schema";

type Props = {
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateGymMembership = ({ openDialog, setOpenDialog }: Props) => {
  const queryClient = useQueryClient();

  const { data: guests } = useQuery({
    queryKey: ["guests"],
    queryFn: async () => {
      const res = await axios.get("/api/guest");

      return res.data;
    },
  });

  const { data: plans } = useQuery({
    queryKey: ["gym-plans"],
    queryFn: async () => {
      const res = await axios.get("/api/gym/plan");

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

  const planOptions = useMemo(
    () =>
      plans?.map((plan: any) => ({
        label: `${plan.name} - ${new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
          maximumFractionDigits: 0,
        }).format(Number(plan.price))}`,
        value: plan.id,
      })) ?? [],
    [plans],
  );

  const { data: reservationData, isLoading: isLoadingReservations } = useQuery({
    queryKey: ["reservations"],
    queryFn: async () => {
      const res = await axios.get("/api/reservation");
      return res.data;
    },
  });

  const reservationOptions = useMemo(
    () =>
      reservationData?.data
        ?.filter(
          (reservation: ReservationType) => reservation.status === "CHECKED_IN",
        )
        .map((reservation: ReservationType) => ({
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
      createGymMembershipFieldConfig({
        guestOptions,
        planOptions,
        reservationOptions,
      }),
    [guestOptions, planOptions],
  );

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof createGymMembershipSchema>) => {
      const res = await axios.post("/api/gym/membership", data);

      return res.data;
    },

    onSuccess: () => {
      toast.success("Gym membership created successfully");

      queryClient.invalidateQueries({
        queryKey: ["gym-memberships"],
      });

      setOpenDialog(false);
    },

    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ?? "Unable to create gym membership",
      );
    },
  });

  async function onSubmit(values: z.infer<typeof createGymMembershipSchema>) {
    mutation.mutateAsync(values);
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger render={<Button>New Membership</Button>} />

      <DialogContent className="min-w-xl">
        <DialogHeader>
          <DialogTitle>Create Gym Membership</DialogTitle>

          <FormBuilder
            config={fieldConfig}
            schema={createGymMembershipSchema}
            onSubmit={onSubmit}
            submitText={
              mutation.isPending ? "Creating..." : "Create Membership"
            }
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGymMembership;
