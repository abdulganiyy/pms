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
import { StatusBadge } from "../StatusBadge";

import { LaundryOrder } from "@/types";

import UpdateLaundryOrderStatus from "./UpdateLaundryOrderStatus";
import PayLaundryOrder from "./PayLaundryOrder";
import RoomChargeLaundryOrder from "./RoomChargeLaundryOrder";

type Props = {
  laundryOrder: LaundryOrder;
};

const LaundryOrderDetails = ({ laundryOrder }: Props) => {
  const [open, setOpen] = useState(false);

  const [openStatusDialog, setOpenStatusDialog] = useState(false);

  const canUpdate =
    laundryOrder.status !== "DELIVERED" && laundryOrder.status !== "CANCELLED";

  return (
    <>
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
            <DialogTitle>Laundry Order Details</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <section>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase">
                Order Information
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <DetailItem
                  label="Order"
                  value={`#${laundryOrder.id.slice(-6)}`}
                />

                <DetailItem
                  label="Status"
                  value={laundryOrder.status}
                  statusType="laundry"
                />

                <DetailItem
                  label="Created"
                  value={format(new Date(laundryOrder.createdAt), "PPP p")}
                />

                <DetailItem
                  label="Guest"
                  value={
                    laundryOrder.guest
                      ? `${laundryOrder.guest.firstName} ${laundryOrder.guest.lastName}`
                      : undefined
                  }
                />

                <DetailItem
                  label="Room"
                  value={laundryOrder.reservation?.room?.number}
                />
              </div>
            </section>

            <Separator />

            <section>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase">
                Laundry Items
              </h3>

              <div className="space-y-3">
                {laundryOrder.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b pb-3"
                  >
                    <div>
                      <div className="font-medium">{item.name}</div>

                      <div className="text-sm text-muted-foreground">
                        {item.quantity} ×{" "}
                        {new Intl.NumberFormat("en-NG", {
                          style: "currency",
                          currency: "NGN",
                          maximumFractionDigits: 0,
                        }).format(Number(item.unitPrice))}
                      </div>
                    </div>

                    <div className="font-medium">
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                        maximumFractionDigits: 0,
                      }).format(Number(item.total))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            <section>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase">
                Financial Information
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <DetailItem
                  label="Subtotal"
                  value={new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                    maximumFractionDigits: 0,
                  }).format(Number(laundryOrder.subtotal))}
                />

                <DetailItem
                  label="Tax"
                  value={new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                    maximumFractionDigits: 0,
                  }).format(Number(laundryOrder.tax))}
                />

                <DetailItem
                  label="Total"
                  value={new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                    maximumFractionDigits: 0,
                  }).format(Number(laundryOrder.total))}
                />
              </div>
            </section>

            {laundryOrder.notes && (
              <>
                <Separator />

                <section>
                  <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase">
                    Notes
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {laundryOrder.notes}
                  </p>
                </section>
              </>
            )}

            <Separator />

            <section>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase">
                Financial Actions
              </h3>
              <PayLaundryOrder order={laundryOrder} />

              <RoomChargeLaundryOrder order={laundryOrder} />
            </section>

            {canUpdate && (
              <>
                <Separator />

                <section>
                  <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase">
                    Actions
                  </h3>

                  <UpdateLaundryOrderStatus
                    order={laundryOrder}
                    open={openStatusDialog}
                    setOpen={setOpenStatusDialog}
                  />
                </section>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LaundryOrderDetails;
