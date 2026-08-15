"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Eye, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Folio = {
  id: string;
  status: string;

  subtotal: number;
  tax: number;
  totalCharges: number;

  paidAmount: number;
  balance: number;

  currency: string;

  transactions: {
    id: string;
    description: string;
    amount: number;
    createdAt: string;
  }[];

  payments: {
    id: string;
    amount: number;
    method: string;
    reference?: string;
    status: string;
    createdAt: string;
  }[];
};

type ViewReservationFolioProps = {
  reservationId: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const fetchReservationFolio = async (reservationId: string): Promise<Folio> => {
  const response = await axios(`/api/reservation/${reservationId}/transaction`);

  return response.data;
};

const ViewReservationFolio = ({
  reservationId,
  open,
  setOpen,
}: ViewReservationFolioProps) => {
  const {
    data: folio,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["reservation-folio", reservationId],

    queryFn: () => fetchReservationFolio(reservationId),

    enabled: open && Boolean(reservationId),

    staleTime: 30 * 1000,

    refetchOnWindowFocus: false,
  });

  const formatMoney = (amount: number, currency = folio?.currency ?? "NGN") =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);

  const handleOpenChange = (value: boolean) => {
    setOpen(value);

    if (value) {
      refetch();
    }
  };

  return (
    <>
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        <Eye className="mr-2 h-4 w-4" />
        View Folio
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[85vh] min-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Guest Folio</DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="flex min-h-40 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="font-medium text-destructive">
                Unable to load folio
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {error instanceof Error
                  ? error.message
                  : "Something went wrong"}
              </p>

              <Button
                className="mt-4"
                variant="outline"
                onClick={() => refetch()}
              >
                Try Again
              </Button>
            </div>
          ) : !folio ? (
            <div className="py-10 text-center text-muted-foreground">
              No folio found for this reservation.
            </div>
          ) : (
            <div className="space-y-6">
              {/* Folio Summary */}
              <section>
                <h3 className="mb-3 text-sm font-semibold uppercase text-muted-foreground">
                  Folio Summary
                </h3>

                <div className="grid gap-4 sm:grid-cols-4">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Total Charges
                    </p>

                    <p className="font-semibold">
                      {formatMoney(folio.totalCharges)}
                    </p>
                  </div>

                  {/* <div>
                    <p className="text-xs text-muted-foreground">Tax</p>

                    <p className="font-semibold">{formatMoney(folio.tax)}</p>
                  </div> */}

                  <div>
                    <p className="text-xs text-muted-foreground">Paid</p>

                    <p className="font-semibold">
                      {formatMoney(folio.paidAmount)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Balance</p>

                    <p
                      className={
                        folio.balance > 0
                          ? "font-semibold text-destructive"
                          : "font-semibold"
                      }
                    >
                      {formatMoney(folio.balance)}
                    </p>
                  </div>
                </div>
              </section>

              <Separator />

              {/* Charges */}
              <section>
                <h3 className="mb-3 text-sm font-semibold uppercase text-muted-foreground">
                  Charges
                </h3>

                {folio.transactions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No charges have been posted.
                  </p>
                ) : (
                  <div className="overflow-hidden rounded-md border">
                    <div className="grid grid-cols-[1fr_80px_120px_120px] border-b bg-muted/50 p-3 text-xs font-medium">
                      <span>Description</span>
                      {/* <span>Qty</span>
                      <span>Unit Price</span> */}
                      <span className="text-right">Total</span>
                    </div>

                    {folio.transactions.map((charge) => (
                      <div
                        key={charge.id}
                        className="grid grid-cols-[1fr_80px_120px_120px] border-b p-3 text-sm last:border-0"
                      >
                        <span>{charge.description}</span>
                        {/* 
                        <span>{charge.quantity}</span>

                        <span>{formatMoney(charge.unitPrice)}</span> */}

                        <span className="text-right font-medium">
                          {formatMoney(charge.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <Separator />

              {/* Payments */}
              <section>
                <h3 className="mb-3 text-sm font-semibold uppercase text-muted-foreground">
                  Payments
                </h3>

                {folio.payments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No payments have been recorded.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {folio.payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between rounded-md border p-3"
                      >
                        <div>
                          <p className="font-medium">{payment.method}</p>

                          <p className="text-xs text-muted-foreground">
                            {new Date(payment.createdAt).toLocaleString()}
                          </p>

                          {payment.reference && (
                            <p className="text-xs text-muted-foreground">
                              Ref: {payment.reference}
                            </p>
                          )}
                        </div>

                        <div className="text-right">
                          <p className="font-semibold">
                            {formatMoney(payment.amount)}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {payment.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewReservationFolio;
