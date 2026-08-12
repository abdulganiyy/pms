"use client";

import { useState } from "react";
import {
  Check,
  CircleDollarSign,
  CookingPot,
  CreditCard,
  PackageCheck,
  Play,
  Receipt,
  RotateCcw,
  Send,
  XCircle,
} from "lucide-react";

import { RestaurantOrder } from "@/types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import PayRestaurantOrder from "./PayRestaurantOrder";
import RoomChargeRestaurantOrder from "./RoomChargeRestaurantOrder";
import RefundRestaurantOrder from "./RefundRestaurantOrder";
import CancelRestaurantOrder from "./CancelRestaurantOrder";

import { useRestaurantOrderAction } from "./RestaurantOrderStatusAction";

type RestaurantOrderActionsProps = {
  order: RestaurantOrder;
};

type Action = "pay" | "room-charge" | "refund" | "cancel" | null;

export default function RestaurantOrderActions({
  order,
}: RestaurantOrderActionsProps) {
  const mutation = useRestaurantOrderAction();

  function handleAction(action: "prepare" | "ready" | "serve" | "complete") {
    mutation.mutate({
      orderId: order.id,
      action,
    });
  }
  const [openAction, setOpenAction] = useState<Action>(null);

  const canStart = order.status === "PENDING";

  //   const canMarkReady = order.status === "PREPARING";

  const canServe = order.status === "READY" || order.status === "PREPARING";

  const canComplete = order.status === "SERVED";

  const canCancel =
    order.status === "PENDING" ||
    order.status === "PREPARING" ||
    order.status === "READY";

  const canPay =
    order.paymentStatus === "UNPAID" ||
    order.paymentStatus === "PARTIALLY_PAID";

  const canRoomCharge =
    order.paymentStatus === "UNPAID" ||
    order.paymentStatus === "PARTIALLY_PAID";

  const canRefund =
    order.paymentStatus === "PAID" ||
    order.paymentStatus === "ROOM_CHARGED" ||
    order.paymentStatus === "PARTIALLY_PAID" ||
    order.paymentStatus === "PARTIALLY_REFUNDED";

  return (
    <>
      <div className="flex gap-2">
        {/* Operational actions */}

        {canStart && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              // start endpoint
              handleAction("prepare");
            }}
          >
            <Play className="mr-2 h-4 w-4" />
            Start Preparing
          </Button>
        )}

        {/* {canMarkReady && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              // ready endpoint
              handleAction("ready");
            }}
          >
            <PackageCheck className="mr-2 h-4 w-4" />
            Ready
          </Button>
        )} */}

        {canServe && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              // serve endpoint
              handleAction("serve");
            }}
          >
            <Check className="mr-2 h-4 w-4" />
            Serve
          </Button>
        )}

        {canComplete && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              // complete endpoint
              handleAction("complete");
            }}
          >
            <Check className="mr-2 h-4 w-4" />
            Complete
          </Button>
        )}

        {/* Financial actions */}

        {canPay && (
          <Button size="sm" onClick={() => setOpenAction("pay")}>
            <CreditCard className="mr-2 h-4 w-4" />
            Pay
          </Button>
        )}

        {canRoomCharge && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setOpenAction("room-charge")}
          >
            <Receipt className="mr-2 h-4 w-4" />
            Charge Room
          </Button>
        )}

        {canRefund && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setOpenAction("refund")}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Refund
          </Button>
        )}

        {canCancel && (
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setOpenAction("cancel")}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        )}
      </div>

      {/* Pay */}

      <PayRestaurantOrder
        order={order}
        open={openAction === "pay"}
        setOpen={(open) => setOpenAction(open ? "pay" : null)}
      />

      {/* Room charge */}

      <RoomChargeRestaurantOrder
        order={order}
        open={openAction === "room-charge"}
        setOpen={(open) => setOpenAction(open ? "room-charge" : null)}
      />

      {/* Refund */}

      {/* <RefundRestaurantOrder
        order={order}
        open={openAction === "refund"}
        setOpen={(open) => setOpenAction(open ? "refund" : null)}
      /> */}

      {/* Cancel */}

      <CancelRestaurantOrder
        order={order}
        open={openAction === "cancel"}
        setOpen={(open) => setOpenAction(open ? "cancel" : null)}
      />
    </>
  );
}
