import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createRoomRateFieldConfig, createRoomTypeFieldConfig } from "@/config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import FormBuilder from "../form/FormBuilder";
import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { createRoomRateSchema } from "@/schema";
import { RatePlan, RoomType } from "@/types";
import { useMemo } from "react";

type CreateRoomRateProps = {
  openDialog: boolean;
  setOpenDialog: React.Dispatch<boolean>;
};

const CreateRoomRate = ({ openDialog, setOpenDialog }: CreateRoomRateProps) => {
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
      createRoomRateFieldConfig.map((field) =>
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

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof createRoomRateSchema>) => {
      const res = await axios.post(`/api/roomrate`, data);

      return res.data;
    },
    onSuccess: () => {
      toast.success("Room Rate created successfully");

      queryClient.invalidateQueries({
        queryKey: ["roomrates"],
      });

      setOpenDialog(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });

  async function onSubmit(values: z.infer<typeof createRoomRateSchema>) {
    mutation.mutateAsync(values);
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger render={<Button> New Room Rate</Button>} />
      <DialogContent className="min-w-xl overflow-auto h-3/4">
        <DialogHeader>
          <DialogTitle>Create New Room Rate</DialogTitle>
          <FormBuilder
            config={fieldConfig}
            schema={createRoomRateSchema}
            onSubmit={onSubmit}
            submitText="Create New Room Rate"
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoomRate;
