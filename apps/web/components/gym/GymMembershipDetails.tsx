"use client";

import { useState } from "react";
import { format } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Separator } from "@/components/ui/separator";
import { Button } from "../ui/button";
import { DetailItem } from "../DetailItem";

import GymMembershipActions from "./GymMembershipActions";
import PayGymMembership from "./PayGymMembership";
import RoomChargeGymMembership from "./RoomChargeGymMembership";

type GymMembership = {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  price: number | string;
  notes?: string;

  guest?: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
  };

  plan?: {
    name: string;
    duration?: string;
    durationValue?: number;
  };
};

type Props = {
  membership: GymMembership;
};

const GymMembershipDetails = ({ membership }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            View
          </Button>
        }
      />

      <DialogContent className="min-w-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gym Membership Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <section>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase">
              Membership Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <DetailItem
                label="Membership"
                value={`#${membership.id.slice(-6)}`}
              />

              <DetailItem
                label="Status"
                value={membership.status}
                statusType="gym"
              />

              <DetailItem label="Plan" value={membership.plan?.name} />

              <DetailItem
                label="Price"
                value={new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                  maximumFractionDigits: 0,
                }).format(Number(membership.price))}
              />

              <DetailItem
                label="Start Date"
                value={format(new Date(membership.startDate), "PPP")}
              />

              <DetailItem
                label="End Date"
                value={format(new Date(membership.endDate), "PPP")}
              />
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase">
              Guest Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <DetailItem
                label="First Name"
                value={membership.guest?.firstName}
              />

              <DetailItem
                label="Last Name"
                value={membership.guest?.lastName}
              />

              <DetailItem label="Email" value={membership.guest?.email} />

              <DetailItem label="Phone" value={membership.guest?.phone} />
            </div>
          </section>

          {membership.notes && (
            <>
              <Separator />

              <section>
                <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase">
                  Notes
                </h3>

                <p className="text-sm text-muted-foreground">
                  {membership.notes}
                </p>
              </section>
            </>
          )}

          <Separator />

          <section>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase">
              Financial Actions
            </h3>

            <div className="flex gap-2">
              <PayGymMembership membership={membership} />

              <RoomChargeGymMembership membership={membership} />
              {/* Add your reusable folio/payment
                  components here when the
                  membership has a folio. */}

              {/* <Button variant="outline" disabled>
                View Folio
              </Button>

              <Button variant="outline" disabled>
                Make Payment
              </Button> */}
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase">
              Membership Actions
            </h3>

            <GymMembershipActions membership={membership} />
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GymMembershipDetails;
