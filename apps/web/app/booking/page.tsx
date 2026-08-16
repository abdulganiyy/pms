"use client";

import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  Mail,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AvailableRoomType } from "@/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { BookingPageSkeleton } from "@/components/booking/BookingPageSkeleton";
import { BookingPageError } from "@/components/booking/BookingPageError";
import { BookingPageEmptyState } from "@/components/booking/BookingPageEmptyState";

const bookingSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),

  email: z.string().email("Please enter a valid email address"),

  note: z.string().max(1000, "Note is too long").optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

function formatDate(value: string | null) {
  if (!value) return "Select date";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

export type AvailabilityParams = {
  checkIn: string | null;
  checkOut: string | null;
  totalGuests: number | null;
};

export const getAvailability = async ({
  checkIn,
  checkOut,
  totalGuests,
}: AvailabilityParams) => {
  if (!checkIn || !checkOut || !totalGuests) return;

  const response = await axios.get<AvailableRoomType[]>("/api/booking", {
    params: {
      checkIn,
      checkOut,
      totalGuests,
    },
  });

  return response.data;
};

export default function BookingPage() {
  const searchParams = useSearchParams();
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guests = searchParams.get("totalGuests") || "2";
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedRate, setSelectedRate] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["availability", checkIn, checkOut, guests],

    queryFn: () =>
      getAvailability({
        checkIn,
        checkOut,
        totalGuests: Number(guests),
      }),

    enabled: Boolean(checkIn) && Boolean(checkOut) && Number(guests) > 0,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      fullName: "",
      email: "",
      note: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post("/api/booking", data);

      return response.data;
    },
    onSuccess: () => {
      setConfirmed(true);
      reset();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });

  if (isLoading) {
    return <BookingPageSkeleton />;
  }

  if (isError) {
    return <BookingPageError onRetry={() => refetch()} />;
  }

  if (!data?.length) {
    return <BookingPageEmptyState />;
  }

  const onSubmit = async (values: BookingFormValues) => {
    if (!selectedRoom || !selectedRate) {
      return;
    }

    const selectedRoomData = data.find((room) => room.id === selectedRoom);

    const selectedRateData = selectedRoomData?.rates.find(
      (rate) => rate.id === selectedRate,
    );

    if (!selectedRoomData || !selectedRateData) {
      return;
    }

    const payload = {
      guestName: values.fullName,
      guestEmail: values.email,
      note: values.note,
      roomTypeId: selectedRoomData.id,
      rateId: selectedRateData.id,

      checkIn,
      checkOut,

      totalGuests: Number(guests),
    };

    mutation.mutateAsync(payload);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-6 py-6 lg:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="font-serif text-2xl tracking-tight">
            City West Hotel<span className="text-accent">.</span>
          </Link>
          <Link
            href="/#book"
            className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={15} /> Change dates
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-20">
        <div className="mb-14 max-w-2xl">
          <p className="mb-5 text-xs uppercase tracking-[0.25em] text-accent">
            Your island stay
          </p>
          <h1 className="font-serif text-6xl leading-[0.92] tracking-[-0.04em] sm:text-8xl">
            Make it <em>yours.</em>
          </h1>
          <p className="mt-7 max-w-lg text-sm leading-7 text-muted-foreground">
            We found a little room for you. Choose your room, then leave us a
            few details so we can prepare your stay.
          </p>
        </div>

        <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div>
            <div className="mb-10 grid gap-px border border-border bg-border sm:grid-cols-3">
              <div className="bg-card p-5">
                <CalendarDays size={16} className="mb-5 text-accent" />
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Check in
                </p>
                <p className="mt-2 text-sm">{formatDate(checkIn)}</p>
              </div>
              <div className="bg-card p-5">
                <CalendarDays size={16} className="mb-5 text-accent" />
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Check out
                </p>
                <p className="mt-2 text-sm">{formatDate(checkOut)}</p>
              </div>
              <div className="bg-card p-5">
                <UserRound size={16} className="mb-5 text-accent" />
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Guests
                </p>
                <p className="mt-2 text-sm">
                  {guests} {guests === "1" ? "guest" : "guests"}
                </p>
              </div>
            </div>

            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.2em] text-accent">
                  01 · Choose your room
                </p>
                <h2 className="font-serif text-4xl tracking-tight">
                  Available rooms
                </h2>
              </div>
              <span className="text-xs text-muted-foreground">
                Best available rate
              </span>
            </div>
            <div className="grid gap-3">
              {data.map((room: any) => {
                const isSelected = selectedRoom === room.id;

                const lowestRate = room.rates.reduce(
                  (lowest: any, rate: any) =>
                    rate.pricePerNight < lowest.pricePerNight ? rate : lowest,
                );

                return (
                  <div
                    key={room.id}
                    className={`border transition-colors ${
                      isSelected
                        ? "border-accent bg-secondary"
                        : "border-border bg-card"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRoom(room.id);
                        setSelectedRate(lowestRate.id);
                      }}
                      className="flex w-full items-center justify-between p-5 text-left"
                    >
                      <div>
                        <h3 className="font-serif text-2xl">{room.name}</h3>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {room.detail}
                        </p>

                        <p className="mt-4 max-w-xs text-xs leading-5 text-muted-foreground">
                          {room.note}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
                            From
                          </span>

                          <span className="block font-medium">
                            ₦{lowestRate.pricePerNight.toLocaleString()}
                          </span>

                          <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
                            per night
                          </span>
                        </div>

                        <span
                          className={`flex h-6 w-6 items-center justify-center border ${
                            isSelected
                              ? "border-accent bg-accent text-accent-foreground"
                              : "border-border"
                          }`}
                        >
                          {isSelected && <Check size={14} />}
                        </span>
                      </div>
                    </button>

                    {isSelected && (
                      <div className="border-t border-border p-5">
                        <div className="mb-4">
                          <p className="text-sm font-medium">
                            Choose your rate
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            Select the rate that best suits your stay.
                          </p>
                        </div>

                        <div className="grid gap-2">
                          {room.rates.map((rate: any) => {
                            const isRateSelected = selectedRate === rate.id;

                            return (
                              <button
                                key={rate.id}
                                type="button"
                                onClick={() => setSelectedRate(rate.id)}
                                className={`flex items-center justify-between gap-4 border p-4 text-left transition-colors ${
                                  isRateSelected
                                    ? "border-accent bg-card"
                                    : "border-border bg-background hover:border-accent"
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <span
                                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border ${
                                      isRateSelected
                                        ? "border-accent bg-accent text-accent-foreground"
                                        : "border-border"
                                    }`}
                                  >
                                    {isRateSelected && <Check size={12} />}
                                  </span>

                                  <div>
                                    <p className="text-sm font-medium">
                                      {rate.name}
                                    </p>

                                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                                      {rate.refundable && (
                                        <span>Free cancellation</span>
                                      )}

                                      {rate.breakfastIncluded && (
                                        <span>Breakfast included</span>
                                      )}

                                      {!rate.refundable && (
                                        <span>Non-refundable</span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="shrink-0 text-right">
                                  <p className="text-sm font-medium">
                                    ₦{rate.pricePerNight.toLocaleString()}
                                  </p>

                                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                    per night
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="border border-border bg-secondary p-6 sm:p-8 lg:sticky lg:top-8"
          >
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-accent">
              02 · Your details
            </p>
            <h2 className="font-serif text-4xl tracking-tight">
              Almost there.
            </h2>
            <div className="mt-8 grid gap-5">
              <label className="text-xs uppercase tracking-[0.16em]">
                Full name
                <input
                  {...register("fullName")}
                  required
                  className="mt-2 w-full border-b border-border bg-transparent px-0 py-3 text-sm normal-case tracking-normal outline-none placeholder:text-muted-foreground focus:border-accent"
                  placeholder="Your name"
                />
                {errors.fullName && (
                  <p className="mt-2 text-xs text-destructive">
                    {errors.fullName.message}
                  </p>
                )}
              </label>
              <label className="text-xs uppercase tracking-[0.16em]">
                Email address
                <span className="relative mt-2 block">
                  <Mail
                    size={15}
                    className="absolute left-0 top-3 text-primary"
                  />

                  <input
                    {...register("email")}
                    type="email"
                    required
                    className="w-full border-b border-border bg-transparent py-3 pl-7 text-sm normal-case tracking-normal outline-none placeholder:text-muted-foreground focus:border-accent"
                    placeholder="you@example.com"
                  />
                </span>
                {errors.email && (
                  <p className="mt-2 text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </label>
              <label className="text-xs uppercase tracking-[0.16em]">
                A note for us
                <textarea
                  {...register("note")}
                  rows={3}
                  className="mt-2 w-full resize-none border-b border-border bg-transparent px-0 py-3 text-sm normal-case tracking-normal outline-none placeholder:text-muted-foreground focus:border-accent"
                  placeholder="Dietary notes, arrival time, or anything else..."
                />
                {errors.note && (
                  <p className="mt-2 text-xs text-destructive">
                    {errors.note.message}
                  </p>
                )}
              </label>
            </div>
            {(() => {
              const selectedRoomData = data.find(
                (room: any) => room.id === selectedRoom,
              );

              const selectedRateData = selectedRoomData?.rates.find(
                (rate: any) => rate.id === selectedRate,
              );

              return (
                <div className="mt-8 border-t border-border pt-5">
                  {selectedRoomData && selectedRateData ? (
                    <div className="space-y-4">
                      <div className="flex justify-between gap-4 text-sm">
                        <div>
                          <p className="font-medium">{selectedRoomData.name}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {selectedRateData.name}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-medium">
                            ₦{selectedRateData.pricePerNight.toLocaleString()}
                          </p>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            per night
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between border-t border-border pt-4 text-sm">
                        <span className="text-muted-foreground">
                          Estimated total
                        </span>

                        <span className="font-medium">
                          ₦{selectedRateData.totalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Select a room and rate to continue.
                    </p>
                  )}

                  <p className="mt-4 text-xs leading-5 text-muted-foreground">
                    No payment is required today. We&apos;ll confirm your stay
                    by email.
                  </p>
                </div>
              );
            })()}
            <button
              className="mt-7 w-full bg-primary px-5 py-4 text-xs uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-accent"
              type="submit"
            >
              {confirmed ? "Request received" : "Request to book"}{" "}
              <ArrowUpRight size={16} className="ml-2 inline" />
            </button>
            {confirmed && (
              <p
                role="status"
                className="mt-4 text-center text-xs leading-5 text-accent"
              >
                Thank you. We&apos;ll be in touch shortly to confirm your stay.
              </p>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
