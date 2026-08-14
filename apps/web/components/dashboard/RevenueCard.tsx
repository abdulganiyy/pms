import { DashboardSummary } from "@/types";
import { CircleDollarSign } from "lucide-react";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function RevenueCard({
  revenue,
}: {
  revenue?: DashboardSummary["revenue"];
}) {
  const room = revenue?.room ?? 0;
  const restaurant = revenue?.restaurant ?? 0;
  const services = revenue?.services ?? 0;

  const total = revenue?.total ?? room + restaurant + services;

  const items = [
    {
      label: "Room Revenue",
      amount: room,
    },
    {
      label: "Restaurant",
      amount: restaurant,
    },
    {
      label: "Other Services",
      amount: services,
    },
  ];

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Revenue</h2>

          <p className="text-xs text-muted-foreground">Today's revenue</p>
        </div>

        <CircleDollarSign className="h-5 w-5 text-primary" />
      </div>

      <div className="mt-6">
        <p className="text-3xl font-bold">{formatCurrency(total)}</p>

        <p className="mt-1 text-xs text-muted-foreground">
          Revenue generated today
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {items.map((item) => {
          const percentage = total > 0 ? (item.amount / total) * 100 : 0;

          return (
            <div key={item.label}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {item.label}
                </span>

                <span className="text-xs font-medium">
                  {formatCurrency(item.amount)}
                </span>
              </div>

              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
