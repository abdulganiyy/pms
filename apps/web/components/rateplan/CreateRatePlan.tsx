import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createRatePlanFieldConfig } from "@/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import FormBuilder from "../form/FormBuilder";
import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { createRatePlanSchema, createRoomTypeSchema } from "@/schema";

type CreateRatePlaneProps = {
  openDialog: boolean;
  setOpenDialog: React.Dispatch<boolean>;
};

export const CreateRatePlan = ({
  openDialog,
  setOpenDialog,
}: CreateRatePlaneProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof createRatePlanSchema>) => {
      const res = await axios.post(`/api/rateplan`, data);

      return res.data;
    },
    onSuccess: () => {
      toast.success("Rate Plan created successfully");

      queryClient.invalidateQueries({
        queryKey: ["rateplans"],
      });

      setOpenDialog(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });

  async function onSubmit(values: z.infer<typeof createRatePlanSchema>) {
    mutation.mutateAsync(values);
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger render={<Button> New Rate Plan</Button>} />
      <DialogContent className="min-w-xl overflow-auto max-h-3/4">
        <DialogHeader>
          <DialogTitle>Create New Rate Plan</DialogTitle>
          <FormBuilder
            config={createRatePlanFieldConfig}
            schema={createRatePlanSchema}
            onSubmit={onSubmit}
            submitText="Create New Rate Plan"
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
