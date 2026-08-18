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
  nightlyRate: number;
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

export type Menu = {
  id: string;
  name: string;
  price: number;
  description?: string;
};

export type RestaurantOrderItem = {
  id: string;

  orderId: string;

  menuItemId: string;
  menuItem?: Menu;

  quantity: number;

  price: number | string;
  total: number | string;
};

export type RestaurantOrderStatus =
  "PENDING" | "PREPARING" | "READY" | "SERVED" | "COMPLETED" | "CANCELLED";

export type RestaurantPaymentStatus =
  | "UNPAID"
  | "PARTIALLY_PAID"
  | "PAID"
  | "ROOM_CHARGED"
  | "PARTIALLY_REFUNDED"
  | "REFUNDED";

export type RestaurantSettlementMethod = "DIRECT_PAYMENT" | "ROOM_CHARGE";

export type RestaurantOrder = {
  id: string;

  reservation?: ReservationType | null;

  guest?: Guest | null;

  roomNumber?: string | null;

  waiterId: string;

  waiter: any;
  // status: string;
  status: RestaurantOrderStatus;

  paymentStatus: RestaurantPaymentStatus;

  settlementMethod?: RestaurantSettlementMethod | null;

  items: RestaurantOrderItem[];

  subtotal: number | string;
  tax: number | string;
  total: number;

  createdAt: string;
};

export interface DashboardArrival {
  id: string;
  guest: any;
  room?: any;
  roomType?: string;
  checkIn?: string;
  status: string;
}

export interface DashboardDeparture {
  id: string;
  guest: any;
  room?: any;
  checkOut?: string;
  status: string;
}

export interface DashboardPayment {
  id: string;
  guest: any;
  folio: any;
  invoiceNumber?: string;
  method?: string;
  amount: number;
  status: string;
}

export interface DashboardSummary {
  stats: {
    occupancy: number;
    arrivals: number;
    departures: number;
    occupiedRooms: number;
    totalRooms: number;
    revenue?: number;
  };

  roomStatus: {
    available: number;
    occupied: number;
    dirty: number;
    maintenance: number;
    outOfOrder: number;
  };

  recentArrivals?: DashboardArrival[];

  recentDepartures?: DashboardDeparture[];

  revenue?: {
    total: number;
    room: number;
    restaurant: number;
    services: number;
  };

  occupancy?: {
    date: string;
    percentage: number;
  }[];

  alerts?: {
    housekeeping: number;
    maintenance: number;
    pendingPayments: number;
  };

  recentPayments?: DashboardPayment[];
}

export type AvailableRate = {
  id: string;
  name: string;
  pricePerNight: number;
  totalPrice: number;
  refundable: boolean;
  breakfastIncluded: boolean;
};

export type AvailableRoomType = {
  id: string;
  name: string;
  description: string | null;
  maxGuests: number;
  availableRooms: number;
  images: string[];
  rates: AvailableRate[];
  note?: string;
};

export type Maintenance = {
  id: string;
  title: string;
  description?: number;
  status: string;
  priority: string;
  assignedTo: User;
  room: Room;
};

export type Housekeeping = {
  id: string;
  notes?: number;
  status: string;
  assignedTo: User;
  room: Room;
};
