import { editGuestFieldConfig } from "@/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import FormBuilder from "../form/FormBuilder";
import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { UploadResult } from "@/lib/upload";
import { EditIcon } from "lucide-react";
import { Guest } from "@/types";
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

export const EditGuestSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  gender: z.string(),
  nationality: z.string(),
  dateOfBirth: z.date(),
  email: z.string(),
  phone: z.string(),
  passport: z.array(uploadSchema),
});

type EditGuestProps = {
  guest: Guest;
};

const EditGuest = ({ guest }: EditGuestProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const defaultValues = {
    firstName: guest.firstName,
    lastName: guest.lastName,
    gender: guest.gender?.toLowerCase(),
    nationality: guest.nationality,
    dateOfBirth: new Date(guest?.dateOfBirth),
    email: guest.email,
    phone: guest.phone,
    passport: guest.passportId ? [{ url: guest.passportId }] : [],
  };

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof EditGuestSchema>) => {
      const { gender, passport, ...rest } = data;

      const res = await axios.patch(`/api/guest/${guest.id}`, {
        ...rest,
        gender: gender.toUpperCase(),
        passportId: (passport[0] as unknown as UploadResult)?.url,
      });

      return res.data;
    },
    onSuccess: () => {
      toast.success("Guest updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["guests"],
      });

      setOpen(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });

  async function onSubmit(values: z.infer<typeof EditGuestSchema>) {
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
          <DialogTitle>Edit Guest Information</DialogTitle>
        </DialogHeader>
        <FormBuilder
          config={editGuestFieldConfig}
          schema={EditGuestSchema}
          onSubmit={onSubmit}
          submitText="Edit Guest"
          values={defaultValues}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditGuest;
