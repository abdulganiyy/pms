import { LogOut, UserRound } from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import { EmptyState } from "./EmptyState";
import { StatusBadge } from "./StatusBadge";
import { DashboardDeparture } from "@/types";

export function DeparturesCard({
  departures,
}: {
  departures: DashboardDeparture[];
}) {
  return (
    <DashboardCard
      title="Today's Departures"
      description="Guests expected to check out"
      icon={LogOut}
      action="View all"
      url="/dashboard/reservations"
    >
      {departures.length === 0 ? (
        <EmptyState message="No departures today" />
      ) : (
        <div className="divide-y">
          {departures.slice(0, 5).map((departure) => (
            <div
              key={departure.id}
              className="flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
                  <UserRound className="h-4 w-4 text-slate-600" />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    {departure.guest.firstName}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {departure.room.number
                      ? `Room ${departure.room.number}`
                      : "Room not assigned"}
                  </p>
                </div>
              </div>

              <div className="text-right">
                {departure.checkOut && (
                  <p className="text-xs font-medium">{departure.checkOut}</p>
                )}

                <StatusBadge status={departure.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}
