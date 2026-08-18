import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createMaintenanceFieldConfig, createRoomFieldConfig } from "@/config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import FormBuilder from "../form/FormBuilder";
import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { createMaintenanceSchema } from "@/schema";
import { Room } from "@/types";
import { useMemo } from "react";

type CreateMaintenanceTypeProps = {
  openDialog: boolean;
  setOpenDialog: React.Dispatch<boolean>;
};

const CreateMaintenance = ({
  openDialog,
  setOpenDialog,
}: CreateMaintenanceTypeProps) => {
  const queryClient = useQueryClient();

  const { data: rooms } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const res = await axios.get<any>(`/api/room`);
      return res.data;
    },
  });

  const roomOptions = rooms?.data?.map((room: Room) => ({
    label: room.number,
    value: room.id,
  }));

  const fieldConfig = useMemo(
    () =>
      createMaintenanceFieldConfig.map((field) =>
        field.name === "roomId"
          ? {
              ...field,
              options: roomOptions,
            }
          : field,
      ),
    [roomOptions],
  );

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof createMaintenanceSchema>) => {
      const res = await axios.post(`/api/maintenance`, data);

      return res.data;
    },
    onSuccess: () => {
      toast.success("Maintenance task created successfully");

      queryClient.invalidateQueries({
        queryKey: ["maintenances"],
      });

      setOpenDialog(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });

  async function onSubmit(values: z.infer<typeof createMaintenanceSchema>) {
    mutation.mutateAsync(values);
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger render={<Button> New Maintenance Task</Button>} />
      <DialogContent className="min-w-xl overflow-auto max-h-3/4">
        <DialogHeader>
          <DialogTitle>Create New Maintenance Task</DialogTitle>
          <FormBuilder
            config={fieldConfig}
            schema={createMaintenanceSchema}
            onSubmit={onSubmit}
            submitText="Create New Maintenance Task"
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMaintenance;
