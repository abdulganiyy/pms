import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createMenuFieldConfig } from "@/config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import FormBuilder from "../form/FormBuilder";
import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { createMenuSchema } from "@/schema";

type CreateNewMenuProps = {
  openDialog: boolean;
  setOpenDialog: React.Dispatch<boolean>;
};

const CreateMenu = ({ openDialog, setOpenDialog }: CreateNewMenuProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof createMenuSchema>) => {
      const res = await axios.post(`/api/menu`, data);

      return res.data;
    },
    onSuccess: () => {
      toast.success("Menu created successfully");

      queryClient.invalidateQueries({
        queryKey: ["menus"],
      });

      setOpenDialog(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });

  async function onSubmit(values: z.infer<typeof createMenuSchema>) {
    mutation.mutateAsync(values);
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger render={<Button> New Menu</Button>} />
      <DialogContent className="min-w-xl overflow-auto max-h-3/4">
        <DialogHeader>
          <DialogTitle>Create New Menu</DialogTitle>
          <FormBuilder
            config={createMenuFieldConfig}
            schema={createMenuSchema}
            onSubmit={onSubmit}
            submitText="Create New Menu"
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMenu;
