import { assignHousekeepingTaskFieldConfig } from "@/config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import FormBuilder from "../form/FormBuilder";
import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { EditIcon } from "lucide-react";
import { Housekeeping, User } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { assignHousekeepingTaskSchema } from "@/schema";

type AssignHousekeepingTaskProps = {
  housekeeping: Housekeeping;
};

const AssignHousekeepingTask = ({
  housekeeping,
}: AssignHousekeepingTaskProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const defaultValues = {};

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get<any>(`/api/user`);
      return res.data;
    },
  });

  const userOptions = users?.data
    ?.filter((user: User) => user.roles.includes("HOUSEKEEPER```````"))
    .map((user: User) => ({
      label: user.fullname,
      value: user.id,
    }));

  const fieldConfig = useMemo(
    () =>
      assignHousekeepingTaskFieldConfig.map((field) =>
        field.name === "assignedToId"
          ? {
              ...field,
              options: userOptions,
            }
          : field,
      ),
    [userOptions],
  );

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof assignHousekeepingTaskSchema>) => {
      const res = await axios.patch(
        `/api/housekeeping/${housekeeping.id}/assign`,
        data,
      );

      return res.data;
    },
    onSuccess: () => {
      toast.success("housekeeping updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["housekeepings"],
      });

      setOpen(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });

  async function onSubmit(
    values: z.infer<typeof assignHousekeepingTaskSchema>,
  ) {
    mutation.mutateAsync(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" className="bg-[#F9FBFF]">
            <EditIcon className="h-4 w-4" /> Assign User
          </Button>
        }
      />

      <DialogContent className="min-w-xl overflow-auto max-h-3/4">
        <DialogHeader>
          <DialogTitle>Assign housekeeping Information</DialogTitle>
        </DialogHeader>
        <FormBuilder
          config={fieldConfig}
          schema={assignHousekeepingTaskSchema}
          onSubmit={onSubmit}
          submitText="Assign housekeeping task"
          values={defaultValues}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AssignHousekeepingTask;
