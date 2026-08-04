import { editUserFieldConfig } from "@/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import FormBuilder from "../form/FormBuilder";
import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { UploadResult } from "@/lib/upload";
import { EditIcon } from "lucide-react";
import { User } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const uploadSchema = z.object({
  url: z.string(),
  key: z.string().optional(),
  filename: z.string().optional(),
});

export const EditUserSchema = z.object({
  fullname: z.string(),
  email: z.string(),
  phone: z.string(),
  photo: z.array(uploadSchema),
});

type EditUserProps = {
  user: User;
};

const EditUser = ({ user }: EditUserProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const defaultValues = {
    fullname: user.fullname,
    email: user.email,
    phone: user.phone,
    photo: user.profileImage ? [{ url: user.profileImage }] : [],
  };

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof EditUserSchema>) => {
      const { photo, ...rest } = data;

      const res = await axios.patch(`/api/user/${user.id}`, {
        ...rest,
        profileImage: (photo[0] as unknown as UploadResult).url,
      });

      return res.data;
    },
    onSuccess: () => {
      toast.success("User updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      setOpen(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });

  async function onSubmit(values: z.infer<typeof EditUserSchema>) {
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
          <DialogTitle>Edit User Information</DialogTitle>
        </DialogHeader>
        <FormBuilder
          config={editUserFieldConfig}
          schema={EditUserSchema}
          onSubmit={onSubmit}
          submitText="Edit User"
          values={defaultValues}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditUser;
