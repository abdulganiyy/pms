import { MoreHorizontal } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { EmptyState } from "./EmptyState";
import { DashboardPayment } from "@/types";
import Link from "next/link";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function RecentPayments({ payments }: { payments: DashboardPayment[] }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b p-5">
        <div>
          <h2 className="font-semibold">Recent Payments</h2>

          <p className="text-xs text-muted-foreground">
            Latest financial transactions
          </p>
        </div>

        <Link
          href="/dashboard/billing"
          type="button"
          className="text-sm font-medium text-primary hover:underline"
        >
          View payments
        </Link>
      </div>

      {payments.length === 0 ? (
        <EmptyState message="No recent payments" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="border-b">
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">
                  Guest
                </th>

                <th className="px-5 py-3 text-left font-medium text-muted-foreground">
                  Method
                </th>

                <th className="px-5 py-3 text-right font-medium text-muted-foreground">
                  Amount
                </th>

                <th className="px-5 py-3 text-right font-medium text-muted-foreground">
                  Status
                </th>

                {/* <th className="px-5 py-3" /> */}
              </tr>
            </thead>

            <tbody className="divide-y">
              {payments.slice(0, 5).map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-medium">
                    {payment.folio ? (
                      <>
                        {payment.folio?.reservation?.guest?.firstName}{" "}
                        {payment.folio?.reservation?.guest?.lastName}
                      </>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="px-5 py-4 text-muted-foreground">
                    {payment.method ?? "-"}
                  </td>

                  <td className="px-5 py-4 text-right font-medium">
                    {formatCurrency(payment.amount)}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <StatusBadge status={payment.status} />
                  </td>

                  {/* <td className="px-5 py-4 text-right">
                    <button type="button" aria-label="Payment actions">
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
