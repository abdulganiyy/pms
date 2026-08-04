import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="h-screen flex">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <DashboardNavbar />
        <div className="py-11.25 px-14.75">{children}</div>
      </div>
    </main>
  );
}
