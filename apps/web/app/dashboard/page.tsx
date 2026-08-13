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

const arrivals = [
  {
    guest: "John Smith",
    room: "204",
    type: "Deluxe King",
    time: "10:30 AM",
    status: "Confirmed",
  },
  {
    guest: "Sarah Johnson",
    room: "312",
    type: "Executive Suite",
    time: "11:00 AM",
    status: "Confirmed",
  },
  {
    guest: "Michael Brown",
    room: "105",
    type: "Standard Double",
    time: "12:30 PM",
    status: "Pending",
  },
  {
    guest: "Amina Yusuf",
    room: "401",
    type: "Presidential Suite",
    time: "2:00 PM",
    status: "Confirmed",
  },
];

const departures = [
  {
    guest: "David Williams",
    room: "201",
    time: "11:00 AM",
    status: "Ready",
  },
  {
    guest: "Mary Adams",
    room: "305",
    time: "11:00 AM",
    status: "Pending",
  },
  {
    guest: "James Wilson",
    room: "410",
    time: "12:00 PM",
    status: "Ready",
  },
];

const roomStatus = [
  {
    label: "Available",
    count: 18,
    className: "bg-emerald-500",
  },
  {
    label: "Occupied",
    count: 52,
    className: "bg-blue-500",
  },
  {
    label: "Dirty",
    count: 9,
    className: "bg-amber-500",
  },
  {
    label: "Maintenance",
    count: 3,
    className: "bg-red-500",
  },
  {
    label: "Out of Order",
    count: 2,
    className: "bg-gray-500",
  },
];

const recentPayments = [
  {
    guest: "John Smith",
    invoice: "INV-10245",
    method: "Card",
    amount: "₦450,000",
    status: "Paid",
  },
  {
    guest: "Sarah Johnson",
    invoice: "INV-10244",
    method: "Transfer",
    amount: "₦680,000",
    status: "Paid",
  },
  {
    guest: "Michael Brown",
    invoice: "INV-10243",
    method: "Cash",
    amount: "₦180,000",
    status: "Paid",
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

  // return <DashboardContent data={data} />;

  return <div>{JSON.stringify(data)}</div>;
}
