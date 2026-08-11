import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createReservationFieldConfig } from "@/config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import FormBuilder from "../form/FormBuilder";
import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { FieldConfig, Guest, RoomRate } from "@/types";
import { createReservationSchema } from "@/schema";
import { useMemo } from "react";

type CreateReservationProps = {
  selection: any;
  openBookingDialog: boolean;
  setOpenBookingDialog: React.Dispatch<boolean>;
};

const CreateReservation = ({
  selection,
  openBookingDialog,
  setOpenBookingDialog,
}: CreateReservationProps) => {
  const queryClient = useQueryClient();

  const { data: roomRates } = useQuery({
    queryKey: ["roomrates"],
    queryFn: async () => {
      const res = await axios.get<any>(`/api/roomrate`);
      return res.data;
    },
  });

  const roomRateOptions = roomRates?.data?.map((roomRate: RoomRate) => ({
    label: `${roomRate.currency}${roomRate.price}`,
    value: roomRate.id,
  }));

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

  const fieldConfig = useMemo(
    () =>
      createReservationFieldConfig.map((field) =>
        field.name === "roomRateId"
          ? {
              ...field,
              options: roomRateOptions,
            }
          : field.name === "guestId"
            ? {
                ...field,
                options: guestOptions,
              }
            : field,
      ),
    [guestOptions, roomRateOptions],
  );

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof createReservationSchema>) => {
      const res = await axios.post(`/api/reservation`, data);

      return res.data;
    },
    onSuccess: () => {
      toast.success("Reservation created successfully");

      queryClient.invalidateQueries({
        queryKey: ["rooms"],
      });

      setOpenBookingDialog(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });

  async function onSubmit(values: z.infer<typeof createReservationSchema>) {
    mutation.mutateAsync(values);
  }

  return (
    <Dialog open={openBookingDialog} onOpenChange={setOpenBookingDialog}>
      <DialogContent className="min-w-xl max-h-3/4 overflow-auto">
        <DialogHeader>
          <DialogTitle>Create New Reservation</DialogTitle>
          <FormBuilder
            config={[
              ...fieldConfig.map((field: FieldConfig) => {
                const transformedField =
                  field.name == "checkIn"
                    ? { ...field, defaultValue: selection?.start }
                    : field.name == "checkOut"
                      ? { ...field, defaultValue: selection?.end }
                      : field.name == "roomId"
                        ? {
                            ...field,
                            defaultValue: selection?.room?.id,
                            options: [
                              {
                                label: selection?.room?.number,
                                value: selection?.room?.id,
                              },
                            ],
                          }
                        : field;

                return transformedField;
              }),
            ]}
            schema={createReservationSchema}
            onSubmit={onSubmit}
            submitText="Create Reservation"
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateReservation;
