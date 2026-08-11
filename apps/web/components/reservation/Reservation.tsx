"use client";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { differenceInCalendarDays, format } from "date-fns";
import { ReservationType } from "@/types";
import ReservationDetails from "./ReservationDetails";
import { useState } from "react";
import { cn } from "@/lib/utils";

const reservationStatusClasses = {
  CONFIRMED: "bg-[#E5F3FF] text-[#0085FF]",
  PENDING: "bg-[#FFF7E5] text-[#F59E0B]",
  CHECKED_IN: "bg-[#E5F9ED] text-[#16A34A]",
  CHECKED_OUT: "bg-[#F3F4F6] text-[#6B7280]",
  CANCELLED: "bg-[#FEECEC] text-[#DC2626]",
} as const;

type ReservationProps = {
  reservation: ReservationType;
  calendarStartDate: Date;
};

const Reservation = ({ reservation, calendarStartDate }: ReservationProps) => {
  const [open, setOpen] = useState(false);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: reservation.id,
    data: reservation,
  });

  const startIndex = differenceInCalendarDays(
    reservation.checkIn,
    calendarStartDate,
  );

  const length = differenceInCalendarDays(
    reservation.checkOut,
    reservation.checkIn,
  );

  const style = {
    transform: CSS.Translate.toString(transform),
    gridRow: 1,
    gridColumnStart: startIndex + 2,
    gridColumnEnd: startIndex + length + 2,
    zIndex: 10,
  };

  return (
    <>
      <div
        data-reservation
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={cn(
          "relative z-10 flex min-w-0 flex-1 items-center overflow-hidden p-1",
          reservationStatusClasses[reservation.status] ??
            "bg-[#E5F3FF] text-[#0085FF]",
        )}
        onClick={() => {
          setOpen(true);
        }}
      >
        {/* Reservation content */}
        <div className="min-w-0 flex-1 truncate cursor-pointer">
          {reservation.guest?.firstName} {reservation.guest?.lastName}
          <span className="ml-2 shrink-0 whitespace-nowrap rounded-xl bg-white px-2 py-1 text-xs text-[#B3B3B3]">
            {format(new Date(reservation.checkIn), "MM/dd")} –{" "}
            {format(new Date(reservation.checkOut), "MM/dd")}
          </span>
        </div>

        {/* Drag handle */}
        {/* <button
          type="button"
          {...listeners}
          onClick={(event) => {
            event.stopPropagation();
          }}
          className="ml-2 shrink-0 cursor-grab px-1 text-gray-400 active:cursor-grabbing"
          aria-label="Drag reservation"
        >
          ⋮⋮
        </button> */}
      </div>

      <ReservationDetails
        reservation={reservation}
        openDialog={open}
        setOpenDialog={setOpen}
      />
    </>
  );
};

export default Reservation;
