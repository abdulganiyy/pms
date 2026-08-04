import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createReservationFieldConfig } from "@/config";
import { useMutation } from "@tanstack/react-query";
import FormBuilder from "../form/FormBuilder";
import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { FieldConfig } from "@/types";

export const createReservationSchema = z.object({
  guest: z.string(),
  room: z.string(),
  start: z.date(),
  end: z.date(),
});

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
  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof createReservationSchema>) => {
      const res = await axios.post(`api/reservation`, data);

      return res.data;
    },
    onSuccess: () => {},
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });

  async function onSubmit(values: z.infer<typeof createReservationSchema>) {
    toast.info(JSON.stringify(values));
    // mutation.mutateAsync(values);
  }

  return (
    <Dialog open={openBookingDialog} onOpenChange={setOpenBookingDialog}>
      <DialogContent className="min-w-xl">
        <DialogHeader>
          <DialogTitle>Create New Reservation</DialogTitle>
          <FormBuilder
            config={[
              ...createReservationFieldConfig.map((field: FieldConfig) => {
                const transformedField =
                  field.name == "start"
                    ? { ...field, defaultValue: selection?.start }
                    : field.name == "end"
                      ? { ...field, defaultValue: selection?.end }
                      : field.name == "room"
                        ? { ...field, defaultValue: selection?.roomId }
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
