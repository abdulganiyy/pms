"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { CreditCard } from "lucide-react";

import { ReservationType } from "@/types";
import axios from "axios";
import FormBuilder from "../form/FormBuilder";
import { makePaymentFieldConfig } from "@/config";
import { makePaymentSchema } from "@/schema";
import z from "zod";

type PaymentMethod = "CASH" | "CARD" | "BANK_TRANSFER" | "POS" | "ONLINE";

type MakeReservationPaymentProps = {
  reservation: ReservationType;

  open: boolean;

  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type CreatePaymentPayload = {
  amount: number;
  method: PaymentMethod;
  reference?: string;
};

const createReservationPayment = async (
  reservationId: string,
  payload: CreatePaymentPayload,
) => {
  const response = await axios.post(
    `/api/reservation/${reservationId}/transaction/payment`,

    payload,
  );

  return response.data;
};

const MakeReservationPayment = ({
  reservation,
  open,
  setOpen,
}: MakeReservationPaymentProps) => {
  const queryClient = useQueryClient();

  const paymentMutation = useMutation({
    mutationFn: async (payload: z.infer<typeof makePaymentSchema>) => {
      const response = await axios.post(
        `/api/reservation/${reservation.id}/payment`,

        payload,
      );

      response.data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["reservation", reservation.id],
      });

      await queryClient.invalidateQueries({
        queryKey: ["reservation-folio", reservation.id],
      });

      await queryClient.invalidateQueries({
        queryKey: ["reservation"],
      });

      setOpen(false);
    },
  });

  const formatMoney = (value: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",

      currency: reservation.roomRate?.currency ?? "NGN",

      maximumFractionDigits: 0,
    }).format(value);
  };

  const isSubmitting = paymentMutation.isPending;

  async function onSubmit(values: z.infer<typeof makePaymentSchema>) {
    paymentMutation.mutateAsync(values);
  }

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        <CreditCard className="mr-2 h-4 w-4" />
        Make Payment
      </Button>

      <Dialog
        open={open}
        onOpenChange={(value) => {
          if (isSubmitting) {
            return;
          }

          setOpen(value);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Make Reservation Payment</DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            {/* Error */}
            {paymentMutation.isError && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3">
                <p className="text-sm font-medium text-destructive">
                  Payment failed
                </p>

                <p className="mt-1 text-sm text-destructive/80">
                  {paymentMutation.error instanceof Error
                    ? paymentMutation.error.message
                    : "Unable to record payment"}
                </p>
              </div>
            )}

            {/* Reservation */}
            <div className="rounded-md bg-muted p-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Reservation
                </span>

                <span className="font-medium">#{reservation.id}</span>
              </div>

              <div className="mt-2 flex justify-between">
                <span className="text-sm text-muted-foreground">Guest</span>

                <span className="font-medium">
                  {reservation.guest.firstName} {reservation.guest.lastName}
                </span>
              </div>

              <div className="mt-2 flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Reservation Total
                </span>

                <span className="font-semibold">
                  {formatMoney(reservation.totalAmount ?? 0)}
                </span>
              </div>

              <FormBuilder
                config={makePaymentFieldConfig}
                schema={makePaymentSchema}
                onSubmit={onSubmit}
                submitText="Make Payment"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MakeReservationPayment;
