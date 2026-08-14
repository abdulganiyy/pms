import { cn } from "@/lib/utils";

import { ClipboardCheck, Sparkles, Wrench } from "lucide-react";
import { DashboardSummary } from "@/types";

export function AlertsCard({
  alerts,
}: {
  alerts?: DashboardSummary["alerts"];
}) {
  const items = [
    {
      icon: Sparkles,
      title: `${alerts?.housekeeping ?? 0} rooms need cleaning`,
      description: "Housekeeping attention required",
      type: "warning",
    },
    {
      icon: Wrench,
      title: `${alerts?.maintenance ?? 0} maintenance requests`,
      description: "Pending maintenance tasks",
      type: "danger",
    },
    {
      icon: ClipboardCheck,
      title: `${alerts?.pendingPayments ?? 0} pending payments`,
      description: "Review outstanding folios",
      type: "warning",
    },
  ];

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Alerts</h2>

          <p className="text-xs text-muted-foreground">
            Items requiring attention
          </p>
        </div>

        <button
          type="button"
          className="text-xs font-medium text-primary hover:underline"
        >
          View all
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {items.map((alert) => {
          const Icon = alert.icon;

          return (
            <div
              key={alert.title}
              className="flex items-center gap-3 rounded-lg border p-3"
            >
              <div
                className={cn(
                  "rounded-lg p-2",
                  alert.type === "danger"
                    ? "bg-red-100 text-red-600"
                    : "bg-amber-100 text-amber-600",
                )}
              >
                <Icon className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium">{alert.title}</p>

                <p className="text-xs text-muted-foreground">
                  {alert.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
