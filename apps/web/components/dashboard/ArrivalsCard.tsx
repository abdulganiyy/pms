import { DashboardArrival } from "@/types";
import { DashboardCard } from "./DashboardCard";
import { LogIn, UserRound } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { StatusBadge } from "./StatusBadge";
import { format } from "date-fns";

export function ArrivalsCard({ arrivals }: { arrivals: DashboardArrival[] }) {
  return (
    <DashboardCard
      title="Today's Arrivals"
      description="Guests expected to check in"
      icon={LogIn}
      action="View all"
      url="/dashboard/reservations"
    >
      {arrivals.length === 0 ? (
        <EmptyState message="No arrivals today" />
      ) : (
        <div className="divide-y">
          {arrivals.slice(0, 5).map((arrival) => (
            <div
              key={arrival.id}
              className="flex items-center justify-between p-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
                  <UserRound className="h-4 w-4 text-slate-600" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {arrival.guest.firstName}
                  </p>

                  <p className="truncate text-xs text-muted-foreground">
                    {arrival.room.number
                      ? `Room ${arrival.room.number}`
                      : "Room not assigned"}

                    {arrival.room.roomType.name &&
                      ` · ${arrival.room.roomType.name}`}
                  </p>
                </div>
              </div>

              <div className="text-right">
                {arrival.checkIn && (
                  <p className="text-xs font-medium">
                    {format(new Date(arrival.checkIn), "MMM dd yyyy")}
                  </p>
                )}

                <StatusBadge status={arrival.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}
