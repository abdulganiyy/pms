"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  addDays,
  differenceInCalendarDays,
  eachDayOfInterval,
  format,
} from "date-fns";
import { DateRange } from "react-day-picker";

import Room from "@/components/reservation/Room";
import CreateReservation from "@/components/reservation/CreateReservation";
import { DatePickerWithRange } from "@/components/DateRangePicker";
import { cn } from "@/lib/utils";
import { type Room as RoomType } from "@/types";
import { toast } from "sonner";

export default function ReservationPage() {
  const queryClient = useQueryClient();

  const [selection, setSelection] = useState<{
    roomId: string;
    start: Date;
    end: Date;
  } | null>(null);

  const [isSelecting, setIsSelecting] = useState(false);
  const [openBookingDialog, setOpenBookingDialog] = useState(false);

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date("2026-08-01"),
    to: addDays(new Date("2026-08-01"), 30),
  });

  const [rooms, setRooms] = useState<RoomType[]>([]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const res = await axios.get("/api/room");
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: {
      reservationId: string;
      roomId: string;
      checkIn: Date;
      checkOut: Date;
    }) => axios.patch(`/api/reservation/${data.reservationId}`, data),
    onSuccess: () => {
      toast.success("Reservation updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["rooms"],
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });

  /**
   * Convert API dates to Date objects and
   * initialize local state.
   */
  useEffect(() => {
    if (!data?.data) return;

    const normalizedRooms: RoomType[] = data.data.map((room: RoomType) => ({
      ...room,
      reservations: room.reservations.map((reservation) => ({
        ...reservation,
        checkIn: new Date(reservation.checkIn),
        checkOut: new Date(reservation.checkOut),
      })),
    }));

    setRooms(normalizedRooms);
  }, [data]);

  const dates =
    date?.from && date?.to
      ? eachDayOfInterval({
          start: date.from,
          end: date.to,
        })
      : [];

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    console.log("DRAG END");
    console.log("ACTIVE:", active);
    console.log("OVER:", over);

    if (!over) {
      console.log("No drop target");
      return;
    }

    const reservation = active.data.current;
    const target = over.data.current;

    console.log("RESERVATION:", reservation);
    console.log("TARGET:", target);

    if (!reservation || !target) {
      console.log("Missing reservation or target");
      return;
    }

    const nights = differenceInCalendarDays(
      new Date(reservation.checkOut),
      new Date(reservation.checkIn),
    );

    const reservationId = reservation.id;

    const targetRoomId = target.room.id;

    const newStart = new Date(target.date);

    const newEnd = addDays(newStart, nights);

    console.log({
      reservationId,
      targetRoomId,
      newStart,
      newEnd,
      nights,
    });

    setRooms((prevRooms) => {
      const existingReservation = prevRooms
        .flatMap((room) => room.reservations)
        .find((r) => r.id === reservationId);

      if (!existingReservation) {
        console.log("Reservation not found in rooms");
        return prevRooms;
      }

      return prevRooms.map((room) => {
        // Remove reservation from its old room
        let reservations = room.reservations.filter(
          (r) => r.id !== reservationId,
        );

        // Add reservation to new room
        if (room.id === targetRoomId) {
          reservations = [
            ...reservations,
            {
              ...existingReservation,
              checkIn: newStart,
              checkOut: newEnd,
            },
          ];
        }

        return {
          ...room,
          reservations,
        };
      });
    });

    // mutation.mutate({
    //   reservationId: reservationId,
    //   roomId: targetRoomId,
    //   checkIn: newStart,
    //   checkOut: newEnd,
    // });
  }

  if (isLoading) {
    return <div>Loading rooms...</div>;
  }

  if (isError) {
    return (
      <div>
        Failed to load rooms:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
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
          {rooms?.map((room: RoomType, index: number) => (
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
