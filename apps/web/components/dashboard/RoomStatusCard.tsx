import { DoorOpen } from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import { cn } from "@/lib/utils";
import { DashboardSummary } from "@/types";

export function RoomStatusCard({
  roomStatus,
}: {
  roomStatus: DashboardSummary["roomStatus"];
}) {
  const rooms = [
    {
      label: "Available",
      count: roomStatus.available,
      className: "bg-emerald-500",
    },
    {
      label: "Occupied",
      count: roomStatus.occupied,
      className: "bg-blue-500",
    },
    {
      label: "Dirty",
      count: roomStatus.dirty,
      className: "bg-amber-500",
    },
    {
      label: "Maintenance",
      count: roomStatus.maintenance,
      className: "bg-red-500",
    },
    {
      label: "Out of Order",
      count: roomStatus.outOfOrder,
      className: "bg-gray-500",
    },
  ];

  const total = rooms.reduce((sum, room) => sum + room.count, 0);

  return (
    <DashboardCard
      title="Room Status"
      description="Current room inventory"
      icon={DoorOpen}
      action="Front desk"
      url="/dashboard/reservations"
    >
      <div className="p-5">
        {/* Status bar */}
        <div className="mb-6 flex h-3 overflow-hidden rounded-full bg-slate-100">
          {rooms.map((room) => {
            if (!room.count || !total) {
              return null;
            }

            return (
              <div
                key={room.label}
                className={room.className}
                style={{
                  width: `${(room.count / total) * 100}%`,
                }}
              />
            );
          })}
        </div>

        <div className="space-y-4">
          {rooms.map((room) => (
            <div key={room.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={cn("h-2.5 w-2.5 rounded-full", room.className)}
                />

                <span className="text-sm text-muted-foreground">
                  {room.label}
                </span>
              </div>

              <span className="text-sm font-semibold">{room.count}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 border-t pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Rooms</span>

            <span className="font-semibold">{total}</span>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}
