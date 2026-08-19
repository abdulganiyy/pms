import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createReservationFieldConfig } from "@/config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import FormBuilder from "../form/FormBuilder";
import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { FieldConfig, Guest, ReservationSelection, RoomRate } from "@/types";
import { createReservationSchema } from "@/schema";
import { useMemo, useState } from "react";

type CreateReservationProps = {
  selection?: ReservationSelection;
  openBookingDialog: boolean;
  setOpenBookingDialog: React.Dispatch<boolean>;
};

const CreateReservation = ({
  selection,
  openBookingDialog,
  setOpenBookingDialog,
}: CreateReservationProps) => {
  const queryClient = useQueryClient();

  const [roomId, setRoomId] = useState<string>();

  const { data: rooms } = useQuery({
    queryKey: ["rooms", "reservation-selection"],
    queryFn: async () => {
      const res = await axios.get("/api/room");
      return res.data;
    },
  });

  const selectedRoom = rooms?.data?.find((room: any) => room.id === roomId);

  const selectedRoomTypeId =
    selection?.roomType?.id ?? selectedRoom?.roomType?.id;

  const { data: roomRates } = useQuery({
    queryKey: ["roomrates"],
    queryFn: async () => {
      const res = await axios.get<any>(`/api/roomrate`);
      return res.data;
    },
  });

  const roomOptions = useMemo(() => {
    if (selection?.room) {
      return [
        {
          label: `Room ${selection.room.number}`,
          value: selection.room.id,
        },
      ];
    }

    return (
      rooms?.data?.map((room: any) => ({
        label: `Room ${room.number}`,
        value: room.id,
      })) ?? []
    );
  }, [rooms?.data, selection?.room]);

  const roomRateOptions = useMemo(() => {
    if (!roomRates?.data || !selectedRoomTypeId) {
      return [];
    }

    return roomRates.data
      .filter(
        (roomRate: RoomRate) => roomRate.roomType.id === selectedRoomTypeId,
      )
      .map((roomRate: RoomRate) => ({
        label: `${roomRate.ratePlan.name} rate - ${roomRate.currency}${roomRate.price}`,
        value: roomRate.id,
      }));
  }, [roomRates?.data, selectedRoomTypeId]);

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

  const fieldConfig = useMemo(() => {
    return createReservationFieldConfig.map((field) => {
      if (field.name === "roomRateId") {
        return {
          ...field,
          options: roomRateOptions,
        };
      }

      if (field.name === "guestId") {
        return {
          ...field,
          options: guestOptions,
        };
      }

      if (field.name === "roomId") {
        if (selection?.room) {
          return {
            ...field,
            defaultValue: selection.room.id,
            options: [
              {
                label: `Room ${selection.room.number}`,
                value: selection.room.id,
              },
            ],
            disabled: true,
          };
        }

        return {
          ...field,
          options: roomOptions,
        };
      }

      return field;
    });
  }, [guestOptions, roomRateOptions, roomOptions, selection]);

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof createReservationSchema>) => {
      const res = await axios.post(`/api/reservation`, data);

      return res.data;
    },
    onSuccess: () => {
      toast.success("Reservation created successfully");

      queryClient.invalidateQueries({
        queryKey: ["reservations"],
      });

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
                      : field;

                return transformedField;
              }),
            ]}
            schema={createReservationSchema}
            onSubmit={onSubmit}
            submitText="Create Reservation"
            onValuesChange={(values) => {
              setRoomId(values.roomId);
            }}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateReservation;
