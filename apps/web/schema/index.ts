import * as z from "zod";

export const createRoomTypeSchema = z.object({
  name: z.string().min(1, "Room type name is required"),
  code: z.string().min(1, "Room type code is required"),
  description: z.string().optional(),
  maxAdults: z.coerce.number().int().min(1),
  maxChildren: z.coerce.number().int().min(0),
  baseOccupancy: z.coerce.number().int().min(1),
  size: z.coerce.number().int().min(1).optional(),
});

export const editRoomTypeSchema = z.object({
  name: z.string().min(1, "Room type name is required"),
  code: z.string().min(1, "Room type code is required"),
  description: z.string().optional(),
  maxAdults: z.coerce.number().int().min(1),
  maxChildren: z.coerce.number().int().min(0),
  baseOccupancy: z.coerce.number().int().min(1),
  size: z.coerce.number().int().min(1).optional(),
});

export const createRatePlanSchema = z.object({
  name: z.string().min(1, "Rate plan name is required"),
  cancellationPolicy: z.string().optional(),
  includesBreakfast: z.boolean(),
  refundable: z.boolean(),
});

export const editRatePlanSchema = z.object({
  name: z.string().min(1, "Rate plan name is required"),
  cancellationPolicy: z.string().optional(),
  includesBreakfast: z.boolean(),
  refundable: z.boolean(),
});

export const createRoomRateSchema = z
  .object({
    roomTypeId: z.string().min(1, "Room type is required"),
    ratePlanId: z.string().min(1, "Rate plan is required"),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    price: z.coerce.number().min(0, "Price cannot be negative"),
    currency: z.string().length(3, "Invalid currency"),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export const editRoomRateSchema = z
  .object({
    roomTypeId: z.string().min(1, "Room type is required"),
    ratePlanId: z.string().min(1, "Rate plan is required"),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    price: z.coerce.number().min(0, "Price cannot be negative"),
    currency: z.string().length(3, "Invalid currency"),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export const createRoomSchema = z.object({
  number: z.string().min(1, "Room number is required"),
  status: z.enum([
    "AVAILABLE",
    "OCCUPIED",
    "RESERVED",
    "DIRTY",
    "CLEANING",
    "OUT_OF_ORDER",
    "OUT_OF_SERVICE",
  ]),
  floor: z.coerce.number().int().min(0).optional(),
  roomTypeId: z.string().min(1, "Room type is required"),
});

export const editRoomSchema = z.object({
  number: z.string().min(1, "Room number is required"),
  status: z.enum([
    "AVAILABLE",
    "OCCUPIED",
    "RESERVED",
    "DIRTY",
    "CLEANING",
    "OUT_OF_ORDER",
    "OUT_OF_SERVICE",
  ]),
  floor: z.coerce.number().int().min(0).optional(),
  roomTypeId: z.string().min(1, "Room type is required"),
});

export const createReservationSchema = z
  .object({
    guestId: z.string().min(1, "Guest is required"),
    roomId: z.string().min(1, "Room is required"),
    roomRateId: z.string().min(1, "Rate is required"),

    checkIn: z.coerce.date(),
    checkOut: z.coerce.date(),

    adults: z.coerce.number().int().min(1),
    children: z.coerce.number().int().min(0),

    type: z.enum(["WALK_IN", "ONLINE", "PHONE", "AGENT"]),
  })
  .refine((data) => data.checkOut > data.checkIn, {
    message: "Check-out must be after check-in",
    path: ["checkOut"],
  });

export const editReservationSchema = z.object({
  adults: z.coerce.number().int().min(1),
  children: z.coerce.number().int().min(0),
});

export const cancelReservationSchema = z.object({
  reason: z.string().optional(),
});

export const changeReservationRoomSchema = z.object({
  roomId: z.string().min(1, "Room is required"),
  roomRateId: z.string().optional(),
});

export const createFolioTransactionSchema = z.object({
  type: z.enum([
    "ROOM_CHARGE",
    "RESTAURANT",
    "LAUNDRY",
    "GYM",
    "TAX",
    "DISCOUNT",
    "ADJUSTMENT",
  ]),
  amount: z.coerce.number().min(0, "Amount cannot be negative"),
  description: z.string().min(1, "Description is required"),
});
