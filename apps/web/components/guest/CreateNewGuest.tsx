import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createNewGuestFieldConfig } from "@/config";
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

export const createNewGuestSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  gender: z.string(),
  nationality: z.string(),
  dateOfBirth: z.date(),
  email: z.string(),
  phone: z.string(),
  passport: z.array(uploadSchema),
});

type CreateNewGuestProps = {
  openDialog: boolean;
  setOpenDialog: React.Dispatch<boolean>;
};

const CreateNewGuest = ({ openDialog, setOpenDialog }: CreateNewGuestProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof createNewGuestSchema>) => {
      const { gender, passport, ...rest } = data;

      const res = await axios.post(`/api/guest`, {
        ...rest,
        gender: gender.toUpperCase(),
        passportId: (passport[0] as unknown as UploadResult).url,
      });

      return res.data;
    },
    onSuccess: () => {
      toast.success("Guest created successfully");

      queryClient.invalidateQueries({
        queryKey: ["guests"],
      });

      setOpenDialog(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });

  async function onSubmit(values: z.infer<typeof createNewGuestSchema>) {
    mutation.mutateAsync(values);
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger render={<Button> New Guest</Button>} />
      <DialogContent className="min-w-xl overflow-auto h-3/4">
        <DialogHeader>
          <DialogTitle>Create New Guest</DialogTitle>
          <FormBuilder
            config={createNewGuestFieldConfig}
            schema={createNewGuestSchema}
            onSubmit={onSubmit}
            submitText="Create New Guest"
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewGuest;
