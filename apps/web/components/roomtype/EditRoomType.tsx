import { editRoomTypeFieldConfig } from "@/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import FormBuilder from "../form/FormBuilder";
import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { EditIcon } from "lucide-react";
import { type RoomType } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { editRoomTypeSchema } from "@/schema";

type EditRoomTypeProps = {
  roomtype: RoomType;
};

const EditRoomType = ({ roomtype }: EditRoomTypeProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const defaultValues = {
    name: roomtype.name,
    code: roomtype.code,
    description: roomtype.description,
    maxAdults: roomtype.maxAdults,
    maxChildren: roomtype.maxChildren,
    baseOccupancy: roomtype.baseOccupancy,
    size: roomtype.size,
  };

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof editRoomTypeSchema>) => {
      const res = await axios.patch(`/api/roomtype/${roomtype.id}`, data);

      return res.data;
    },
    onSuccess: () => {
      toast.success("Room Type updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["roomtypes"],
      });

      setOpen(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });

  async function onSubmit(values: z.infer<typeof editRoomTypeSchema>) {
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
          <DialogTitle>Edit Room Type Information</DialogTitle>
        </DialogHeader>
        <FormBuilder
          config={editRoomTypeFieldConfig}
          schema={editRoomTypeSchema}
          onSubmit={onSubmit}
          submitText="Edit roomtype"
          values={defaultValues}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditRoomType;
