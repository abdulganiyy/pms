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

import { createLaundryItemFieldConfig } from "@/config";

import { createLaundryItemSchema } from "@/schema";

type Props = {
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateLaundryItem = ({ openDialog, setOpenDialog }: Props) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof createLaundryItemSchema>) => {
      const res = await axios.post("/api/laundry/item", data);

      return res.data;
    },

    onSuccess: () => {
      toast.success("Laundry item created successfully");

      queryClient.invalidateQueries({
        queryKey: ["laundry-items"],
      });

      setOpenDialog(false);
    },

    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ?? "Unable to create laundry item",
      );
    },
  });

  async function onSubmit(values: z.infer<typeof createLaundryItemSchema>) {
    await mutation.mutateAsync(values);
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger render={<Button>New Laundry Item</Button>} />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Laundry Item</DialogTitle>

          <FormBuilder
            config={createLaundryItemFieldConfig}
            schema={createLaundryItemSchema}
            onSubmit={onSubmit}
            submitText={mutation.isPending ? "Creating..." : "Create Item"}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLaundryItem;
