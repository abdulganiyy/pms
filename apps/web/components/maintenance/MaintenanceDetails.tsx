import { useState } from "react";
import { Eye } from "lucide-react";
import { Maintenance } from "@/types";
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
import AssignMaintenance from "./AssignMaintenance";
import StartMaintenance from "./StartMaintenance";
import CompleteMaintenance from "./CompleteMaintenance";

type MaintenanceDetailsProps = {
  maintenance: Maintenance;
};

const MaintenanceDetails = ({ maintenance }: MaintenanceDetailsProps) => {
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
          <DialogTitle> Maintenance Task Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <section>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase">
              General Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <DetailItem label="Title" value={maintenance.title} />
              <DetailItem label="Description" value={maintenance.description} />
              <DetailItem label="Status" value={maintenance.status} />
              <DetailItem label="Priority" value={maintenance.priority} />
              <DetailItem
                label="Assigned To"
                value={maintenance?.assignedTo?.fullname}
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
              <AssignMaintenance maintenance={maintenance} />
              <StartMaintenance maintenance={maintenance} />
              <CompleteMaintenance maintenance={maintenance} />
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MaintenanceDetails;
