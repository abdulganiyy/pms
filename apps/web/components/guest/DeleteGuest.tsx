import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Trash2Icon } from "lucide-react";
import { Guest } from "@/types";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type DeleteGuestProps = { guest: Guest };

const DeleteGuest = ({ guest }: DeleteGuestProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axios.delete(`/api/guest/${guest.id}`);

      return res.data;
    },
    onSuccess: () => {
      toast.success("Guest deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["guests"],
      });

      setOpen(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to delete guest");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="icon" className="bg-[#F9FBFF]">
            <Trash2Icon className="h-4 w-4" />
          </Button>
        }
      />

      <DialogContent className="min-w-xl overflow-auto max-h-3/4">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <div>
          Are you sure you want to delete{" "}
          <strong>
            {guest.firstName} {guest.lastName}
          </strong>
          ? This action cannot be undone.
        </div>
        <div className="flex justify-end">
          <Button
            variant="destructive"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            Delete Guest
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteGuest;
