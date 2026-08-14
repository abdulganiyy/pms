"use client";

import { DashboardSummary } from "@/types";
import { AlertsCard } from "./AlertsCard";
import { ArrivalsCard } from "./ArrivalsCard";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardStats } from "./DashboardStats";
import { DeparturesCard } from "./DeparturesCard";
import { OccupancyCard } from "./OccupancyCard";
import { QuickActions } from "./QuickActions";
import { RecentPayments } from "./RecentPayments";
import { RevenueCard } from "./RevenueCard";
import { RoomStatusCard } from "./RoomStatusCard";

interface DashboardContentProps {
  data: DashboardSummary;
}

export function DashboardContent({ data }: DashboardContentProps) {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* Header */}
        <DashboardHeader />

        {/* KPI Cards */}
        <DashboardStats data={data} />

        {/* Quick Actions */}
        <QuickActions />

        {/* Arrivals / Departures / Room Status */}
        <div className="grid gap-6 xl:grid-cols-3">
          <ArrivalsCard arrivals={data.recentArrivals ?? []} />

          <DeparturesCard departures={data.recentDepartures ?? []} />

          <RoomStatusCard roomStatus={data.roomStatus} />
        </div>

        {/* Occupancy / Revenue / Alerts */}
        <div className="grid gap-6 xl:grid-cols-3">
          <OccupancyCard
            occupancy={data?.occupancy ?? []}
            currentOccupancy={data?.stats?.occupancy}
          />

          <RevenueCard revenue={data?.revenue} />

          <AlertsCard alerts={data?.alerts} />
        </div>

        {/* Recent Payments */}
        <RecentPayments payments={data?.recentPayments ?? []} />
      </div>
    </div>
  );
}
