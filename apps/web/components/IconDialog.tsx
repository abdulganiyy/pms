import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface IconDialogProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}

export function IconDialog({ icon, title, children }: IconDialogProps) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline" size="icon" className="bg-[#F9FBFF]">
            {icon}
          </Button>
        }
      />

      <DialogContent className="min-w-xl overflow-auto max-h-3/4">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  );
}
