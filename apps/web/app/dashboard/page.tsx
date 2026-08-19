"use client";

import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { DashboardError } from "@/components/dashboard/DashboardError";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { useDashboard } from "@/hooks/useDashboard";
import { useUser } from "@/hooks/useUser";
import { getLandingPage } from "@/config/landingpage";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const { data: user, isLoading: isUserLoading } = useUser();

  if (isUserLoading) {
    return <DashboardSkeleton />;
  }

  const permissions = user?.permissions ?? [];

  const canViewDashboard =
    permissions.includes("*") || permissions.includes("dashboard.view");

  if (!canViewDashboard) {
    const landingPage = getLandingPage(permissions);

    if (!landingPage) {
      return (
        <div>
          <h1>No Access</h1>
          <p>You don't have permission to access any dashboard module.</p>
        </div>
      );
    }

    redirect(landingPage);
  }

  return <DashboardData />;
}

function DashboardData() {
  const { data, isLoading, isError, error, refetch } = useDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return <DashboardError error={error} onRetry={() => refetch()} />;
  }

  return <DashboardContent data={data} />;
}
