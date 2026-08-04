import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createNewUserFieldConfig } from "@/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import FormBuilder from "../form/FormBuilder";
import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { UploadResult } from "@/lib/upload";

const uploadSchema = z.object({
  url: z.string(),
  key: z.string().optional(),
  filename: z.string().optional(),
});

export const createNewUserSchema = z.object({
  fullname: z.string(),
  email: z.string(),
  phone: z.string(),
  photo: z.array(uploadSchema),
});

type CreateNewUserProps = {
  openDialog: boolean;
  setOpenDialog: React.Dispatch<boolean>;
};

const CreateNewUser = ({ openDialog, setOpenDialog }: CreateNewUserProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof createNewUserSchema>) => {
      const { photo, ...rest } = data;

      const res = await axios.post(`/api/user`, {
        ...rest,
        profileImage: (photo[0] as unknown as UploadResult).url,
      });

      return res.data;
    },
    onSuccess: () => {
      toast.success("User created successfully");

      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      setOpenDialog(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });

  async function onSubmit(values: z.infer<typeof createNewUserSchema>) {
    mutation.mutateAsync(values);
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger render={<Button> New User</Button>} />
      <DialogContent className="min-w-xl overflow-auto h-3/4">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <FormBuilder
            config={createNewUserFieldConfig}
            schema={createNewUserSchema}
            onSubmit={onSubmit}
            submitText="Create New User"
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewUser;
