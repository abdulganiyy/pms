import { useState } from "react";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import { Guest } from "@/types";
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

type GuestDetailsProps = {
  guest: Guest;
};

const GuestDetails = ({ guest }: GuestDetailsProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon">
            <Eye className="size-4" />
          </Button>
        }
      ></DialogTrigger>

      <DialogContent className="min-w-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Guest Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Personal Information */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase">
              Personal Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <DetailItem label="First Name" value={guest.firstName} />

              <DetailItem label="Last Name" value={guest.lastName} />

              <DetailItem label="Email" value={guest.email} />

              <DetailItem label="Phone" value={guest.phone} />

              <DetailItem label="Gender" value={guest.gender} />

              <DetailItem
                label="Date of Birth"
                value={
                  guest.dateOfBirth
                    ? format(new Date(guest.dateOfBirth), "PPP")
                    : undefined
                }
              />
            </div>
          </section>

          <Separator />

          {/* Address */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase">
              Address
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <DetailItem label="Country" value={guest.nationality} />

              {/* <DetailItem
                label="State"
                value={guest.state}
              />

              <DetailItem
                label="City"
                value={guest.city}
              />

              <DetailItem
                label="Address"
                value={guest.address}
              />

              <DetailItem
                label="Postal Code"
                value={guest.postalCode}
              /> */}
            </div>
          </section>

          <Separator />

          {/* Identification */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase">
              Identification
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* <DetailItem label="ID Type" value={guest.idType} />

              <DetailItem label="ID Number" value={guest.idNumber} /> */}

              <DetailItem label="Nationality" value={guest.nationality} />
            </div>
          </section>

          <Separator />

          {/* Additional */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase">
              Additional Information
            </h3>

            {/* <DetailItem label="Notes" value={guest.notes} /> */}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuestDetails;
