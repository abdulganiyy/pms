"use client";
import { useState } from "react";
import Room from "@/components/reservation/Room";
import { cn } from "@/lib/utils";
import {
  eachDayOfInterval,
  format,
  differenceInCalendarDays,
  addDays,
} from "date-fns";
import { DndContext } from "@dnd-kit/core";
import { rooms as mockRoomsData } from "@/mocks/rooms";
import { DatePickerWithRange } from "@/components/DateRangePicker";
import { DateRange } from "react-day-picker";
import { RoomType } from "@/types";
import CreateReservation from "@/components/reservation/CreateReservation";

export default function ReservationPage() {
  const [selection, setSelection] = useState<{
    roomId: string;
    start: Date;
    end: Date;
  } | null>(null);

  const [isSelecting, setIsSelecting] = useState(false);
  const [openBookingDialog, setOpenBookingDialog] = useState(false);

  const [rooms, setRooms] = useState<RoomType[]>(mockRoomsData);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date("2026-08-01"),
    to: addDays(new Date("2026-08-01"), 30),
  });

  const dates = eachDayOfInterval({
    start: date!.from!,
    end: date!.to!,
  });

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (!over) return;

    const reservation = active.data.current;
    const target = over.data.current;

    const nights = differenceInCalendarDays(reservation.end, reservation.start);

    const reservationId = reservation.id;
    const targetRoomId = target.roomId;
    const newStart = target.date;
    const newEnd = addDays(newStart, nights);

    setRooms((prev) => {
      const reservation = prev
        .flatMap((room) => room.reservations)
        .find((r) => r.id === reservationId);

      if (!reservation) return prev;

      return prev.map((room) => {
        // Remove from every room
        let reservations = room.reservations.filter(
          (r) => r.id !== reservationId,
        );

        // Add to destination room
        if (room.id === targetRoomId) {
          reservations = [
            ...reservations,
            {
              ...reservation,
              start: newStart,
              end: newEnd,
            },
          ];
        }

        return {
          ...room,
          reservations,
        };
      });
    });

    // updateReservation({
    //   reservationId: reservation.id,
    //   roomId: target.roomId,
    //   start: newStart,
    //           end: newEnd,
    // });
  }

  return (
    <div className="space-y-4">
      <h2 className="text-[#1F384C] text-lg leading-5.75">Reservations</h2>
      <div className="ml-30">
        <DatePickerWithRange date={date} setDate={setDate} />
      </div>
      <DndContext id="booking-calendar-dnd" onDragEnd={handleDragEnd}>
        <div className="overflow-auto">
          <div
            //  grid-cols-[120px_repeat(31,minmax(164px,1fr))]
            className="grid"
            style={{
              gridTemplateColumns: `120px repeat(${dates.length}, minmax(164px, 1fr))`,
            }}
          >
            <div className="p-4"></div>

            {dates.map((day, index) => (
              <div
                className={cn(
                  "bg-[#E5E7F4] text-[#5A67BA] border-l border-t border-[#eee] text-center",
                  index == 0 && "rounded-tl-lg",
                  index == dates.length - 1 && "rounded-tr-lg",
                )}
                key={day.toISOString()}
              >
                {format(day, "EEE d")}
              </div>
            ))}
          </div>
          {rooms.map((room, index) => (
            <Room
              key={room.id}
              room={room}
              dates={dates}
              isLast={index === rooms.length - 1}
              calendarStartDate={date!.from!}
              calendarEndDate={date!.to!}
              selection={selection}
              isSelecting={isSelecting}
              setIsSelecting={setIsSelecting}
              setSelection={setSelection}
              setOpenBookingDialog={setOpenBookingDialog}
            />
          ))}
        </div>
      </DndContext>

      <CreateReservation
        selection={selection}
        openBookingDialog={openBookingDialog}
        setOpenBookingDialog={setOpenBookingDialog}
      />
    </div>
  );
}
