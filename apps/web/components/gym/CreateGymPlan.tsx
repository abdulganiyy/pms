"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import FormBuilder from "../form/FormBuilder";
import { Button } from "../ui/button";

import axios from "axios";
import { toast } from "sonner";
import z from "zod";

import { createGymPlanFieldConfig } from "@/config";

import { createGymPlanSchema } from "@/schema";

type Props = {
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateGymPlan = ({ openDialog, setOpenDialog }: Props) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof createGymPlanSchema>) => {
      const res = await axios.post("/api/gym/plan", data);

      return res.data;
    },

    onSuccess: () => {
      toast.success("Gym plan created successfully");

      queryClient.invalidateQueries({
        queryKey: ["gym-plans"],
      });

      setOpenDialog(false);
    },

    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Unable to create gym plan");
    },
  });

  async function onSubmit(values: z.infer<typeof createGymPlanSchema>) {
    mutation.mutateAsync(values);
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger render={<Button>New Plan</Button>} />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Gym Membership Plan</DialogTitle>

          <FormBuilder
            config={createGymPlanFieldConfig}
            schema={createGymPlanSchema}
            onSubmit={onSubmit}
            submitText={mutation.isPending ? "Creating..." : "Create Plan"}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGymPlan;
