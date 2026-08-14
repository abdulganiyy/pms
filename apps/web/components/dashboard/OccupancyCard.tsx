import { DashboardSummary } from "@/types";
import { BedDouble } from "lucide-react";

function formatChartDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-NG", {
    weekday: "short",
  }).format(date);
}

export function OccupancyCard({
  occupancy,
  currentOccupancy,
}: {
  occupancy: DashboardSummary["occupancy"];
  currentOccupancy: number;
}) {
  const chartData =
    occupancy && occupancy.length > 0
      ? occupancy
      : [
          {
            date: "Mon",
            percentage: 0,
          },
          {
            date: "Tue",
            percentage: 0,
          },
          {
            date: "Wed",
            percentage: 0,
          },
          {
            date: "Thu",
            percentage: 0,
          },
          {
            date: "Fri",
            percentage: 0,
          },
          {
            date: "Sat",
            percentage: 0,
          },
          {
            date: "Sun",
            percentage: 0,
          },
        ];

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Occupancy</h2>

          <p className="text-xs text-muted-foreground">Last 7 days</p>
        </div>

        <BedDouble className="h-5 w-5 text-primary" />
      </div>

      <div className="mt-6 flex h-36 items-end gap-2">
        {chartData.slice(-7).map((item, index) => (
          <div
            key={`${item.date}-${index}`}
            className="flex flex-1 flex-col items-center gap-2"
          >
            <div className="flex h-32 w-full items-end">
              <div
                className="w-full rounded-t-md bg-primary/80 transition-all"
                style={{
                  height: `${Math.max(Math.min(item.percentage, 100), 0)}%`,
                }}
                title={`${item.percentage}%`}
              />
            </div>

            <span className="text-[10px] text-muted-foreground">
              {formatChartDate(item.date)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between border-t pt-4">
        <span className="text-sm text-muted-foreground">Current occupancy</span>

        <span className="font-semibold">{currentOccupancy}%</span>
      </div>
    </div>
  );
}
