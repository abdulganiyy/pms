import { useState } from "react";
import { Eye } from "lucide-react";
import { RestaurantOrder } from "@/types";
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
import RestaurantOrderActions from "./RestaurantOrderActions";

type RestaurantOrderDetailsProps = {
  restaurantorder: RestaurantOrder;
};

const RestaurantOrderDetails = ({
  restaurantorder,
}: RestaurantOrderDetailsProps) => {
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
          <DialogTitle>Restaurant Order Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <section>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase">
              General Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <DetailItem
                label="Order Number"
                value={`#${restaurantorder.id.slice(-6)}`}
              />

              <DetailItem
                label="Room Number"
                value={`${restaurantorder?.reservation?.room?.number ?? "—"}`}
              />

              <DetailItem
                label="Guest"
                value={`${restaurantorder.guest?.firstName} ${restaurantorder.guest?.lastName}`}
              />

              <DetailItem
                label="Items"
                value={restaurantorder.items.at.length ?? 0}
              />

              <DetailItem
                label="Total Amount"
                value={new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                  maximumFractionDigits: 0,
                }).format(restaurantorder.total ?? 0)}
              />

              <DetailItem
                label="Status"
                value={restaurantorder.status}
                statusType="restaurant"
              />

              <DetailItem
                label="Payment Status"
                value={restaurantorder.paymentStatus}
                statusType="payment"
              />

              <DetailItem
                label="Created"
                value={new Date(restaurantorder.createdAt).toLocaleDateString()}
              />
            </div>
          </section>

          <Separator />

          {/* Additional */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase">
              Additional Information
            </h3>
            <RestaurantOrderActions order={restaurantorder} />
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RestaurantOrderDetails;
