import { useState } from "react";
import { Eye } from "lucide-react";
import { type RoomRate } from "@/types";
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
import { format } from "date-fns";

type RoomRateProps = {
  roomrate: RoomRate;
};

const RoomRateDetails = ({ roomrate }: RoomRateProps) => {
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
          <DialogTitle>Room Rate Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <section>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase">
              General Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <DetailItem label="Room Type" value={roomrate.roomType.name} />

              <DetailItem label="Rate Plan" value={roomrate.ratePlan.name} />

              <DetailItem
                label="Start Date"
                value={format(roomrate.startDate, "MMMM do, yyyy")}
              />

              <DetailItem
                label="End Date"
                value={format(roomrate.endDate, "MMMM do, yyyy")}
              />

              <DetailItem label="Price" value={roomrate.price} />

              <DetailItem label="Currency" value={roomrate.currency} />
            </div>
          </section>

          <Separator />

          {/* Additional */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase">
              Additional Information
            </h3>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoomRateDetails;
