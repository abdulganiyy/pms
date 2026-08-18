"use client";

import { Reservations } from "@/components/reservation/Reservations";

export default function ReservationPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-[#1F384C] text-lg leading-5.75">Reservations</h2>
      <Reservations />
    </div>
  );
}
