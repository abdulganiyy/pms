import { editRoomRateFieldConfig } from "@/config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import FormBuilder from "../form/FormBuilder";
import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { EditIcon } from "lucide-react";
import { RatePlan, RoomType, type RoomRate } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { editRoomRateSchema } from "@/schema";

type EditRoomRateProps = {
  roomrate: RoomRate;
};

const EditRoomRate = ({ roomrate }: EditRoomRateProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: roomTypes } = useQuery({
    queryKey: ["roomtypes"],
    queryFn: async () => {
      const res = await axios.get<any>(`/api/roomtype`);
      return res.data;
    },
  });

  const roomTypeOptions = roomTypes?.data?.map((roomType: RoomType) => ({
    label: roomType.name,
    value: roomType.id,
  }));

  const { data: ratePlans } = useQuery({
    queryKey: ["rateplans"],
    queryFn: async () => {
      const res = await axios.get<any>(`/api/rateplan`);
      return res.data;
    },
  });

  const ratePlanOptions = ratePlans?.data?.map((ratePlan: RatePlan) => ({
    label: ratePlan.name,
    value: ratePlan.id,
  }));

  const fieldConfig = useMemo(
    () =>
      editRoomRateFieldConfig.map((field) =>
        field.name === "roomTypeId"
          ? {
              ...field,
              options: roomTypeOptions,
            }
          : field.name === "ratePlanId"
            ? {
                ...field,
                options: ratePlanOptions,
              }
            : field,
      ),
    [roomTypeOptions, ratePlanOptions],
  );

  const defaultValues = {};

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof editRoomRateSchema>) => {
      const res = await axios.patch(`/api/roomrate/${roomrate.id}`, data);

      return res.data;
    },
    onSuccess: () => {
      toast.success("Room Rate updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["roomrates"],
      });

      setOpen(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });

  async function onSubmit(values: z.infer<typeof editRoomRateSchema>) {
    mutation.mutateAsync(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="icon" className="bg-[#F9FBFF]">
            <EditIcon className="h-4 w-4" />
          </Button>
        }
      />

      <DialogContent className="min-w-xl overflow-auto max-h-3/4">
        <DialogHeader>
          <DialogTitle>Edit Room Rate Information</DialogTitle>
        </DialogHeader>
        <FormBuilder
          config={fieldConfig}
          schema={editRoomRateSchema}
          onSubmit={onSubmit}
          submitText="Edit room rate"
          values={defaultValues}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditRoomRate;
