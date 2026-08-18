"use client";

import { Maintenances } from "@/components/maintenance/Maintenances";

export default function MaintenancePage() {
  return (
    <div className="space-y-4">
      <h2 className="text-[#1F384C] text-lg leading-5.75">
        Maintenance Management
      </h2>
      <Maintenances />
    </div>
  );
}
