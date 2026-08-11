import { useState } from "react";
import { Eye } from "lucide-react";
import { type RoomType } from "@/types";
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

type RoomTypeProps = {
  roomtype: RoomType;
};

const RoomType = ({ roomtype }: RoomTypeProps) => {
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
          <DialogTitle>Room Type Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Personal Information */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase">
              General Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <DetailItem label="Name" value={roomtype.name} />

              <DetailItem label="Code" value={roomtype.code} />

              <DetailItem label="Description" value={roomtype.description} />

              <DetailItem label="Max Adults" value={roomtype.maxAdults} />

              <DetailItem label="Max Children" value={roomtype.maxChildren} />

              <DetailItem
                label="Base Occupancy"
                value={roomtype.baseOccupancy}
              />

              <DetailItem label="Size" value={roomtype.size} />
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

export default RoomType;
