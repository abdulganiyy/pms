import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createRoomTypeFieldConfig } from "@/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import FormBuilder from "../form/FormBuilder";
import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { createRoomTypeSchema } from "@/schema";

type CreateNewRoomTypeProps = {
  openDialog: boolean;
  setOpenDialog: React.Dispatch<boolean>;
};

const CreateNewRoomType = ({
  openDialog,
  setOpenDialog,
}: CreateNewRoomTypeProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof createRoomTypeSchema>) => {
      const res = await axios.post(`/api/roomtype`, data);

      return res.data;
    },
    onSuccess: () => {
      toast.success("Room Type created successfully");

      queryClient.invalidateQueries({
        queryKey: ["roomtypes"],
      });

      setOpenDialog(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });

  async function onSubmit(values: z.infer<typeof createRoomTypeSchema>) {
    mutation.mutateAsync(values);
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger render={<Button> New Room Type</Button>} />
      <DialogContent className="min-w-xl overflow-auto h-3/4">
        <DialogHeader>
          <DialogTitle>Create New Room Type</DialogTitle>
          <FormBuilder
            config={createRoomTypeFieldConfig}
            schema={createRoomTypeSchema}
            onSubmit={onSubmit}
            submitText="Create New Room Type"
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewRoomType;
