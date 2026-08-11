export * from "./form";

export type Session = {
  user: User;
  accessToken: string;
};

export type User = {
  id: string;
  image?: string;
  email: string;
  fullname: string;
  phone?: string;
  emailVerified: boolean;
  status: string;
  roles: string[];
  permissions?: string[];
  profileImage?: string;
};

export type Guest = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  nationality: string;
  dateOfBirth: Date;
  passportId: string;
};

export type ResetPasswordFormData = {
  email: string;
  reset_token: string;
  new_password: string;
  new_password_confirm: string;
};

export type ForgotPasswordFormValues = {
  email: string;
};

export type LoginFormValues = {
  email: string;
  password: string;
};

export type RegisterFormValues = {
  phone: string;
  fullname: string;
  email: string;
  password: string;
};

export type TaskType = {
  id: string;
  type: string;
  start: string;
  end: string;
};

export type ReservationType = {
  id: string;
  type: string;
  checkIn: Date;
  checkOut: Date;
  guest: any;
  roomRate: any;
  room: any;
  status: "PENDING" | "CONFIRMED" | "CHECKED_IN" | "CHECKED_OUT" | "CANCELLED";
  paymentStatus: string;
  totalAmount: number;
  adults: number;
  children: number;
};

export type Room = {
  id: string;
  number: string;
  floor?: number;
  status: string;
  roomType: { id: string; name: string };
  reservations: ReservationType[];
  tasks?: TaskType[];
};

export type RoomType = {
  id: string;
  name: string;
  code: string;
  description: string;
  maxAdults: number;
  maxChildren: number;
  baseOccupancy: number;
  size: number;
};

export type RatePlan = {
  id: string;
  name: string;
  includesBreakfast: boolean;
  cancellationPolicy: string;
  refundable: boolean;
};

export type RoomRate = {
  id: string;
  roomType: { id: string; name: string };
  ratePlan: { id: string; name: string };
  price: number;
  currency: string;
  startDate: string;
  endDate: string;
};
