import { DashboardSummary } from "@/types";
import { BedDouble, CircleDollarSign, LogIn, LogOut } from "lucide-react";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function DashboardStats({ data }: { data: DashboardSummary }) {
  const stats = [
    {
      title: "Occupancy",
      value: `${data?.stats?.occupancy}%`,
      description: "Today's occupancy",
      icon: BedDouble,
    },
    {
      title: "Today's Revenue",
      value: formatCurrency(data.revenue?.total ?? data.stats?.revenue ?? 0),
      description: "Room + services",
      icon: CircleDollarSign,
    },
    {
      title: "Arrivals",
      value: data?.stats?.arrivals.toString(),
      description: "Expected today",
      icon: LogIn,
    },
    {
      title: "Departures",
      value: data?.stats?.departures?.toString(),
      description: "Expected today",
      icon: LogOut,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat?.icon;

        return (
          <div
            key={stat?.title}
            className="rounded-xl border bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat?.title}
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight">
                  {stat?.value}
                </p>
              </div>

              <div className="rounded-lg bg-primary/10 p-2.5">
                <Icon className="h-5 w-5 text-primary" />
              </div>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              {stat?.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
