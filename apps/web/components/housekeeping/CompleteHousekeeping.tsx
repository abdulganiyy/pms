import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { CheckCheck } from "lucide-react";
import { Housekeeping } from "@/types";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type CompleteHousekeepingProps = { housekeeping: Housekeeping };

const CompleteHousekeeping = ({ housekeeping }: CompleteHousekeepingProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axios.patch(
        `/api/housekeeping/${housekeeping.id}/complete`,
      );

      return res.data;
    },
    onSuccess: () => {
      toast.success("housekeeping Task  completeed successfully");

      queryClient.invalidateQueries({
        queryKey: ["housekeepings"],
      });

      setOpen(false);
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ?? "Failed to complete housekeeping task.",
      );
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" className="bg-[#F9FBFF]">
            <CheckCheck className="h-4 w-4" /> Complete Task
          </Button>
        }
      />

      <DialogContent className="min-w-xl overflow-auto max-h-3/4">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <div>
          Are you sure you want to mark this<strong>housekeeping task</strong>{" "}
          as completed? This action cannot be undone.
        </div>
        <div className="flex justify-end">
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            Complete housekeeping
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompleteHousekeeping;
