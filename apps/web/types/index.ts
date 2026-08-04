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
  start: string;
  end: string;
  guest: string;
  status: string;
};

export type RoomType = {
  id: string;
  roomNumber: string;
  reservations: ReservationType[];
  tasks?: TaskType[];
};
