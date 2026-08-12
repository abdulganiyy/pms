"use client";

import {
  Check,
  CreditCard,
  MoreHorizontal,
  PackageCheck,
  Play,
  Receipt,
  RotateCcw,
  XCircle,
} from "lucide-react";

import { useState } from "react";

import { RestaurantOrder } from "@/types";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import PayRestaurantOrder from "./PayRestaurantOrder";
import RoomChargeRestaurantOrder from "./RoomChargeRestaurantOrder";
import RefundRestaurantOrder from "./RefundRestaurantOrder";
import CancelRestaurantOrder from "./CancelRestaurantOrder";

// type Action = "pay" | "room-charge" | "refund" | "cancel" | null;
type Action =
  | "start"
  | "ready"
  | "serve"
  | "complete"
  | "pay"
  | "room-charge"
  | "refund"
  | "cancel"
  | null;

type Props = {
  order: RestaurantOrder;
};

export default function RestaurantOrderActionMenu({ order }: Props) {
  const [action, setAction] = useState<Action>(null);

  const canStart = order.status === "PENDING";

  const canReady = order.status === "PREPARING";

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
    (order.paymentStatus === "UNPAID" ||
      order.paymentStatus === "PARTIALLY_PAID") &&
    !!order.reservation?.id;

  const canRefund =
    order.paymentStatus === "PAID" ||
    order.paymentStatus === "ROOM_CHARGED" ||
    order.paymentStatus === "PARTIALLY_PAID" ||
    order.paymentStatus === "PARTIALLY_REFUNDED";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          }
        ></DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          {/* ========================= */}
          {/* OPERATIONAL ACTIONS */}
          {/* ========================= */}

          {canStart && (
            <DropdownMenuItem onClick={() => setAction("start")}>
              <Play className="mr-2 h-4 w-4" />
              Start Preparing
            </DropdownMenuItem>
          )}

          {canReady && (
            <DropdownMenuItem onClick={() => setAction("ready")}>
              <PackageCheck className="mr-2 h-4 w-4" />
              Mark Ready
            </DropdownMenuItem>
          )}

          {canServe && (
            <DropdownMenuItem onClick={() => setAction("serve")}>
              <Check className="mr-2 h-4 w-4" />
              Mark Served
            </DropdownMenuItem>
          )}

          {canComplete && (
            <DropdownMenuItem onClick={() => setAction("complete")}>
              <Check className="mr-2 h-4 w-4" />
              Complete
            </DropdownMenuItem>
          )}

          {canCancel && (
            <>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setAction("cancel")}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Cancel Order
              </DropdownMenuItem>
            </>
          )}

          {/* ========================= */}
          {/* FINANCIAL ACTIONS */}
          {/* ========================= */}

          {(canPay || canRoomCharge || canRefund) && (
            <>
              <DropdownMenuSeparator />

              {canPay && (
                <DropdownMenuItem onClick={() => setAction("pay")}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Record Payment
                </DropdownMenuItem>
              )}

              {canRoomCharge && (
                <DropdownMenuItem onClick={() => setAction("room-charge")}>
                  <Receipt className="mr-2 h-4 w-4" />
                  Charge to Room
                </DropdownMenuItem>
              )}

              {canRefund && (
                <DropdownMenuItem onClick={() => setAction("refund")}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Refund
                </DropdownMenuItem>
              )}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Action dialogs */}

      <PayRestaurantOrder
        order={order}
        open={action === "pay"}
        setOpen={(open) => setAction(open ? "pay" : null)}
      />

      <RoomChargeRestaurantOrder
        order={order}
        open={action === "room-charge"}
        setOpen={(open) => setAction(open ? "room-charge" : null)}
      />

      <RefundRestaurantOrder
        order={order}
        open={action === "refund"}
        setOpen={(open) => setAction(open ? "refund" : null)}
      />

      <CancelRestaurantOrder
        order={order}
        open={action === "cancel"}
        setOpen={(open) => setAction(open ? "cancel" : null)}
      />
    </>
  );
}
