import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Play } from "lucide-react";
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

type StartHousekeepingProps = { housekeeping: Housekeeping };

const StartHousekeeping = ({ housekeeping }: StartHousekeepingProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axios.patch(
        `/api/housekeeping/${housekeeping.id}/start`,
      );

      return res.data;
    },
    onSuccess: () => {
      toast.success("housekeeping Task  started successfully");

      queryClient.invalidateQueries({
        queryKey: ["housekeepings"],
      });

      setOpen(false);
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ?? "Failed to start housekeeping task.",
      );
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" className="bg-[#F9FBFF]">
            <Play className="h-4 w-4" /> Start Task
          </Button>
        }
      />

      <DialogContent className="min-w-xl overflow-auto max-h-3/4">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <div>
          Are you sure you want to start <strong>housekeeping task</strong>?
          This action cannot be undone.
        </div>
        <div className="flex justify-end">
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            Start housekeeping
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StartHousekeeping;
