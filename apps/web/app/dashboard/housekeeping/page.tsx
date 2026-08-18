"use client";

import { Housekeepings } from "@/components/housekeeping/Housekeepings";

export default function HousekeepingPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-[#1F384C] text-lg leading-5.75">
        Housekeeping Management
      </h2>
      <Housekeepings />
    </div>
  );
}
