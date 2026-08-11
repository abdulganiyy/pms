"use client";
import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import Reservation from "./Reservation";
import { ReservationType, Room as RoomType } from "@/types";

type RoomProps = {
  room: RoomType;
  dates: Date[];
  isLast: boolean;
  calendarStartDate: Date;
  calendarEndDate: Date;
  selection: any;
  setSelection: React.Dispatch<any>;
  isSelecting: boolean;
  setIsSelecting: React.Dispatch<boolean>;
  setOpenBookingDialog: React.Dispatch<boolean>;
};

const CalendarCell = ({
  room,
  day,
  isLast,
  setSelection,
  setIsSelecting,
  isSelecting,
  selection,
  setOpenBookingDialog,
}: Omit<RoomProps, "dates" | "calendarStartDate" | "calendarEndDate"> & {
  day: Date;
}) => {
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;

    if (target.closest("[data-reservation]")) {
      return;
    }

    setIsSelecting(true);

    setSelection({
      room: {
        id: room.id,
        number: room.number,
      },
      start: day,
      end: day,
    });
  };

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;

    if (target.closest("[data-reservation]")) {
      return;
    }

    if (!isSelecting) return;

    setSelection((prev: any) => {
      if (!prev) return prev;

      if (prev.room.id !== room.id) {
        return prev;
      }

      return {
        ...prev,
        end: day,
      };
    });
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;

    if (target.closest("[data-reservation]")) {
      return;
    }

    if (!isSelecting) return;

    setIsSelecting(false);
    setOpenBookingDialog(true);
  };

  const { setNodeRef, isOver } = useDroppable({
    id: `${room.id}-${day.toISOString()}`,
    data: {
      room: { id: room.id, number: room.number },
      date: day,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "border-l border-t border-[#eee]",
        isLast && "border-b",
        isOver && "bg-blue-100",
      )}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseUp={handleMouseUp}
    />
  );
};

const Room = ({
  room,
  dates,
  isLast,
  calendarStartDate,
  calendarEndDate,
  selection,
  isSelecting,
  setIsSelecting,
  setSelection,
  setOpenBookingDialog,
}: RoomProps) => {
  return (
    <div
      className="relative grid"
      style={{
        gridTemplateColumns: `120px repeat(${dates.length}, minmax(164px, 1fr))`,
        gridTemplateRows: "60px",
      }}
    >
      <div className="p-4 flex justify-end items-center text-[#B5B7C0]">
        Room {room.number}
      </div>
      {dates.map((day: any) => (
        <CalendarCell
          key={day.toISOString()}
          room={room}
          day={day}
          isLast={isLast}
          selection={selection}
          isSelecting={isSelecting}
          setIsSelecting={setIsSelecting}
          setSelection={setSelection}
          setOpenBookingDialog={setOpenBookingDialog}
        />
      ))}
      {room.reservations
        .filter((reservation) => {
          const start = new Date(reservation.checkIn);
          const end = new Date(reservation.checkOut);

          return end >= calendarStartDate && start <= calendarEndDate;
        })
        .map((reservation: ReservationType) => (
          <Reservation
            data-reservation
            key={reservation.id}
            reservation={reservation}
            calendarStartDate={calendarStartDate}
          />
        ))}
    </div>
  );
};

export default Room;
