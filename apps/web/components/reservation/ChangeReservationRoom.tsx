import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { changeReservationRoomFieldConfig } from "@/config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import FormBuilder from "../form/FormBuilder";
import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { FieldConfig, Guest, ReservationType, RoomRate } from "@/types";
import { changeReservationRoomSchema } from "@/schema";
import { useMemo } from "react";
import { Button } from "../ui/button";

type CreateReservationProps = {
  reservation: ReservationType;
  open: boolean;
  setOpen: React.Dispatch<boolean>;
};

const ChangeReservationRoom = ({
  reservation,
  open,
  setOpen,
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

  const fieldConfig = useMemo(
    () =>
      changeReservationRoomFieldConfig.map((field) =>
        field.name === "roomRateId"
          ? {
              ...field,
              options: roomRateOptions,
            }
          : field,
      ),
    [roomRateOptions],
  );

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof changeReservationRoomSchema>) => {
      const res = await axios.post(
        `/api/reservation/${reservation.id}/changeroom`,
        data,
      );

      return res.data;
    },
    onSuccess: () => {
      toast.success("Reservation Room changed successfully");

      queryClient.invalidateQueries({
        queryKey: ["rooms"],
      });

      setOpen(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });

  async function onSubmit(values: z.infer<typeof changeReservationRoomSchema>) {
    mutation.mutateAsync(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button onClick={() => setOpen(true)}>Change Room</Button>}
      ></DialogTrigger>
      <DialogContent className="min-w-xl max-h-3/4 overflow-auto">
        <DialogHeader>
          <DialogTitle>Change Reservation Room</DialogTitle>
          <FormBuilder
            config={[
              ...fieldConfig.map((field: FieldConfig) => {
                const transformedField =
                  field.name == "roomId"
                    ? {
                        ...field,
                        defaultValue: reservation?.room?.id,
                        options: [
                          {
                            label: reservation?.room?.number,
                            value: reservation?.room?.id,
                          },
                        ],
                      }
                    : field;

                return transformedField;
              }),
            ]}
            schema={changeReservationRoomSchema}
            onSubmit={onSubmit}
            submitText="Change Reservation Room"
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeReservationRoom;
