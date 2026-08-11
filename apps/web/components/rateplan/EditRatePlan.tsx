import { editRatePlanFieldConfig } from "@/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import FormBuilder from "../form/FormBuilder";
import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { EditIcon } from "lucide-react";
import { RatePlan } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { editRatePlanSchema } from "@/schema";

type EditRatePlanProps = {
  rateplan: RatePlan;
};

export const EditRatePlan = ({ rateplan }: EditRatePlanProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const defaultValues = {
    name: rateplan.name,
    cancellationPolicy: rateplan.cancellationPolicy,
    includesBreakfast: rateplan.includesBreakfast,
    refundable: rateplan.refundable,
  };

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof editRatePlanSchema>) => {
      const res = await axios.patch(`/api/rateplan/${rateplan.id}`, data);

      return res.data;
    },
    onSuccess: () => {
      toast.success("Rate Plan updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["rateplans"],
      });

      setOpen(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });

  async function onSubmit(values: z.infer<typeof editRatePlanSchema>) {
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
          <DialogTitle>Edit Rate Plan Information</DialogTitle>
        </DialogHeader>
        <FormBuilder
          config={editRatePlanFieldConfig}
          schema={editRatePlanSchema}
          onSubmit={onSubmit}
          submitText="Edit rate plan"
          values={defaultValues}
        />
      </DialogContent>
    </Dialog>
  );
};
