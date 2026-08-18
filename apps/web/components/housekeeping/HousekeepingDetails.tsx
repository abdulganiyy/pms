import { useState } from "react";
import { Eye } from "lucide-react";
import { Housekeeping } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { DetailItem } from "../DetailItem";
import AssignHousekeepingTask from "./AssignHousekeeping";
import StartHousekeeping from "./StartHousekeeping";
import CompleteHousekeeping from "./CompleteHousekeeping";

type HousekeepingDetailsProps = {
  housekeeping: Housekeeping;
};

const HousekeepingDetails = ({ housekeeping }: HousekeepingDetailsProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="icon">
            <Eye className="size-4" />
          </Button>
        }
      ></DialogTrigger>

      <DialogContent className="min-w-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle> Housekeeping Task Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <section>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase">
              General Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <DetailItem label="Room" value={housekeeping.room.number} />
              <DetailItem label="Notes" value={housekeeping.notes} />
              <DetailItem label="Status" value={housekeeping.status} />
              <DetailItem
                label="Assigned To"
                value={housekeeping?.assignedTo?.fullname}
              />
            </div>
          </section>

          <Separator />

          {/* Additional */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase">
              Actions
            </h3>
            <div className="space-x-2">
              <AssignHousekeepingTask housekeeping={housekeeping} />
              <StartHousekeeping housekeeping={housekeeping} />
              <CompleteHousekeeping housekeeping={housekeeping} />
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HousekeepingDetails;
