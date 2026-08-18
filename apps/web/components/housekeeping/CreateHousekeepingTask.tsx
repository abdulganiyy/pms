import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createHousekeepingTaskFieldConfig } from "@/config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import FormBuilder from "../form/FormBuilder";
import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { createHousekeepingTaskSchema } from "@/schema";
import { Room } from "@/types";
import { useMemo } from "react";

type CreateHousekeepingTaskTypeProps = {
  openDialog: boolean;
  setOpenDialog: React.Dispatch<boolean>;
};

const CreateHousekeepingTask = ({
  openDialog,
  setOpenDialog,
}: CreateHousekeepingTaskTypeProps) => {
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
      createHousekeepingTaskFieldConfig.map((field) =>
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
    mutationFn: async (data: z.infer<typeof createHousekeepingTaskSchema>) => {
      const res = await axios.post(`/api/housekeeping`, data);

      return res.data;
    },
    onSuccess: () => {
      toast.success("Housekeeping task created successfully");

      queryClient.invalidateQueries({
        queryKey: ["housekeepings"],
      });

      setOpenDialog(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });

  async function onSubmit(
    values: z.infer<typeof createHousekeepingTaskSchema>,
  ) {
    mutation.mutateAsync(values);
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger render={<Button> New Housekeeping Task</Button>} />
      <DialogContent className="min-w-xl overflow-auto max-h-3/4">
        <DialogHeader>
          <DialogTitle>Create New Housekeeping Task</DialogTitle>
          <FormBuilder
            config={fieldConfig}
            schema={createHousekeepingTaskSchema}
            onSubmit={onSubmit}
            submitText="Create New Housekeeping Task"
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateHousekeepingTask;
