import { editRoomFieldConfig, editRoomTypeFieldConfig } from "@/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import FormBuilder from "../form/FormBuilder";
import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { EditIcon } from "lucide-react";
import { Room } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { editRoomSchema } from "@/schema";

type EditRoomProps = {
  room: Room;
};

const EditRoom = ({ room }: EditRoomProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const defaultValues = {};

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof editRoomSchema>) => {
      const res = await axios.patch(`/api/room/${room.id}`, data);

      return res.data;
    },
    onSuccess: () => {
      toast.success("Room updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["rooms"],
      });

      setOpen(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });

  async function onSubmit(values: z.infer<typeof editRoomSchema>) {
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
          <DialogTitle>Edit Room Information</DialogTitle>
        </DialogHeader>
        <FormBuilder
          config={editRoomFieldConfig}
          schema={editRoomSchema}
          onSubmit={onSubmit}
          submitText="Edit room"
          values={defaultValues}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditRoom;
