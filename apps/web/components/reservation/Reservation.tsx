"use client";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { differenceInCalendarDays, format } from "date-fns";
import { ReservationType } from "@/types";

type ReservationProps = {
  reservation: ReservationType;
  calendarStartDate: Date;
};

const Reservation = ({ reservation, calendarStartDate }: ReservationProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: reservation.id,
    data: reservation,
  });

  const startIndex = differenceInCalendarDays(
    reservation.start,
    calendarStartDate,
  );

  const length = differenceInCalendarDays(reservation.end, reservation.start);

  const style = {
    transform: CSS.Translate.toString(transform),
    gridRow: 1,
    gridColumnStart: startIndex + 2,
    gridColumnEnd: startIndex + length + 2,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-[#E5F3FF] text-[#0085FF] flex items-center pl-2.5 cursor-grab"
      //   style={{
      //     gridRow: 1,
      //     gridColumnStart: startIndex + 2,
      //     gridColumnEnd: startIndex + length + 2,
      //   }}
    >
      {reservation.guest}
      <span className="bg-white inline-flex gap-1 p-1 rounded-xl ml-2 text-[#B3B3B3]">
        {format(reservation.start, "MM/dd")} To{" "}
        {format(reservation.end, "MM/dd")}
      </span>
    </div>
  );
};

export default Reservation;
