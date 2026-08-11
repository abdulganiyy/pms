import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createRoomFieldConfig } from "@/config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import FormBuilder from "../form/FormBuilder";
import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { createRoomSchema } from "@/schema";
import { RoomType } from "@/types";
import { useMemo } from "react";

type CreateNewRoomTypeProps = {
  openDialog: boolean;
  setOpenDialog: React.Dispatch<boolean>;
};

const CreateRoom = ({ openDialog, setOpenDialog }: CreateNewRoomTypeProps) => {
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

  const fieldConfig = useMemo(
    () =>
      createRoomFieldConfig.map((field) =>
        field.name === "roomTypeId"
          ? {
              ...field,
              options: roomTypeOptions,
            }
          : field,
      ),
    [roomTypeOptions],
  );

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof createRoomSchema>) => {
      const res = await axios.post(`/api/room`, data);

      return res.data;
    },
    onSuccess: () => {
      toast.success("Room created successfully");

      queryClient.invalidateQueries({
        queryKey: ["rooms"],
      });

      setOpenDialog(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });

  async function onSubmit(values: z.infer<typeof createRoomSchema>) {
    mutation.mutateAsync(values);
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger render={<Button> New Room</Button>} />
      <DialogContent className="min-w-xl overflow-auto max-h-3/4">
        <DialogHeader>
          <DialogTitle>Create New Room</DialogTitle>
          <FormBuilder
            config={fieldConfig}
            schema={createRoomSchema}
            onSubmit={onSubmit}
            submitText="Create New Room"
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoom;
