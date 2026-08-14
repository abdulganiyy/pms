"use client";

import { BedDouble, CircleDollarSign, LogIn, LogOut } from "lucide-react";

import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { DashboardError } from "@/components/dashboard/DashboardError";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { useDashboard } from "@/hooks/useDashboard";

type Stat = {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  trend?: string;
  trendType?: "up" | "down";
};

const stats: Stat[] = [
  {
    title: "Occupancy",
    value: "78.4%",
    description: "Today's occupancy",
    icon: BedDouble,
    trend: "+6.2%",
    trendType: "up",
  },
  {
    title: "Today's Revenue",
    value: "₦2,845,000",
    description: "Room + services",
    icon: CircleDollarSign,
    trend: "+12.5%",
    trendType: "up",
  },
  {
    title: "Arrivals",
    value: "24",
    description: "Expected today",
    icon: LogIn,
    trend: "+4",
    trendType: "up",
  },
  {
    title: "Departures",
    value: "18",
    description: "Expected today",
    icon: LogOut,
    trend: "-2",
    trendType: "down",
  },
];

export default function DashboardPage() {
  const { data, isLoading, isError, error, refetch } = useDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError && !data) {
    return <DashboardError error={error} onRetry={() => refetch()} />;
  }

  return <DashboardContent data={data} />;
}
