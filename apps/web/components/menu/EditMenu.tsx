import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createMenuFieldConfig } from "@/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import FormBuilder from "../form/FormBuilder";
import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { createMenuSchema } from "@/schema";
import { useState } from "react";
import { Edit2 } from "lucide-react";
import { Menu } from "@/types";

type EditNewMenuProps = {
  menu: Menu;
};

const EditMenu = ({ menu }: EditNewMenuProps) => {
  const [open, setOpen] = useState(false);

  const defaultValues = {
    name: menu.name,
    description: menu.description,
    price: menu.price,
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof createMenuSchema>) => {
      const res = await axios.patch(`/api/menu/${menu.id}`, data);

      return res.data;
    },
    onSuccess: () => {
      toast.success("Menu updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["menus"],
      });

      setOpen(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });

  async function onSubmit(values: z.infer<typeof createMenuSchema>) {
    mutation.mutateAsync(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="icon" className="bg-[#F9FBFF]">
            <Edit2 className="h-4 w-4" />
          </Button>
        }
      />
      <DialogContent className="min-w-xl overflow-auto max-h-3/4">
        <DialogHeader>
          <DialogTitle>Update Menu</DialogTitle>
          <FormBuilder
            config={createMenuFieldConfig}
            schema={createMenuSchema}
            onSubmit={onSubmit}
            submitText="Update Menu"
            values={defaultValues}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EditMenu;
