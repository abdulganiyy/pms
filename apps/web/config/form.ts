import { FieldConfig } from "@/types";

export const registerFieldConfig: FieldConfig[] = [
  {
    name: "fullname",
    label: "Full Name",
    type: "text",
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "text",
  },
  {
    name: "password",
    label: "Password",
    type: "text",
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "text",
  },
  {
    name: "agreed",
    label: "I agree to the Terms of Service and Privacy Policy.",
    type: "checkbox",
    hideLabel: true,
  },
];

export const loginFieldConfig: FieldConfig[] = [
  {
    name: "email",
    label: "Email Address",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    type: "text",
  },
];

export const createNewGuestFieldConfig: FieldConfig[] = [
  {
    name: "firstName",
    label: "First Name",
    type: "text",
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "text",
  },
  {
    name: "dateOfBirth",
    label: "Date of Birth",
    type: "date",
  },
  {
    name: "nationality",
    label: "Nationality",
    type: "text",
  },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    options: [
      { label: "Female", value: "female" },
      { label: "Male", value: "male" },
    ],
  },
  {
    name: "passport",
    label: "Guest Passport",
    type: "file",
    multiple: false,
    defaultValue: [],
  },
];

export const editGuestFieldConfig: FieldConfig[] = [
  ...createNewGuestFieldConfig,
];

export const createNewUserFieldConfig: FieldConfig[] = [
  {
    name: "fullname",
    label: "Full Name",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "text",
  },

  {
    name: "photo",
    label: "User Image",
    type: "file",
    multiple: false,
    defaultValue: [],
  },
];

export const editUserFieldConfig: FieldConfig[] = [...createNewUserFieldConfig];

export const createRoomTypeFieldConfig: FieldConfig[] = [
  {
    name: "name",
    label: "Room Type Name",
    type: "text",
  },
  {
    name: "code",
    label: "Room Type Code",
    type: "text",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    fullWidth: true,
  },
  {
    name: "maxAdults",
    label: "Maximum Adults",
    type: "text",
  },
  {
    name: "maxChildren",
    label: "Maximum Children",
    type: "number",
  },
  {
    name: "baseOccupancy",
    label: "Base Occupancy",
    type: "number",
  },
  {
    name: "size",
    label: "Room Size",
    type: "number",
  },
];

export const editRoomTypeFieldConfig = [...createRoomTypeFieldConfig];

export const createRatePlanFieldConfig: FieldConfig[] = [
  {
    name: "name",
    label: "Rate Plan Name",
    type: "text",
  },
  {
    name: "cancellationPolicy",
    label: "Cancellation Policy",
    type: "textarea",
    fullWidth: true,
  },
  {
    name: "includesBreakfast",
    label: "Includes Breakfast",
    type: "checkbox",
  },
  {
    name: "refundable",
    label: "Refundable",
    type: "checkbox",
  },
];

export const editRatePlanFieldConfig = [...createRatePlanFieldConfig];

export const createRoomRateFieldConfig: FieldConfig[] = [
  {
    name: "roomTypeId",
    label: "Room Type",
    type: "select",
    placeholder: "Select Room Type",
    options: [],
  },
  {
    name: "ratePlanId",
    label: "Rate Plan",
    type: "select",
    placeholder: "Select Rate Plan",
    options: [],
  },
  {
    name: "startDate",
    label: "Start Date",
    type: "date",
  },
  {
    name: "endDate",
    label: "End Date",
    type: "date",
  },
  {
    name: "price",
    label: "Price",
    type: "number",
  },
  {
    name: "currency",
    label: "Currency",
    type: "select",
    placeholder: "Select Currency",
    options: [
      { label: "Nigerian Naira (NGN)", value: "NGN" },
      { label: "US Dollar (USD)", value: "USD" },
      { label: "British Pound (GBP)", value: "GBP" },
      { label: "Euro (EUR)", value: "EUR" },
    ],
  },
];

export const editRoomRateFieldConfig = [...createRoomRateFieldConfig];

export const createRoomFieldConfig: FieldConfig[] = [
  {
    name: "number",
    label: "Room Number",
    type: "text",
  },
  {
    name: "status",
    label: "Room Status",
    placeholder: "Select Status",
    type: "select",
    options: [
      { label: "Available", value: "AVAILABLE" },
      { label: "Occupied", value: "OCCUPIED" },
      { label: "Reserved", value: "RESERVED" },
      { label: "Dirty", value: "DIRTY" },
      { label: "Cleaning", value: "CLEANING" },
      { label: "Out of Order", value: "OUT_OF_ORDER" },
      { label: "Out of Service", value: "OUT_OF_SERVICE" },
    ],
  },
  {
    name: "floor",
    label: "Floor",
    type: "number",
  },
  {
    name: "roomTypeId",
    label: "Room Type",
    type: "select",
    options: [],
  },
];

export const editRoomFieldConfig = [...createRoomFieldConfig];

export const createReservationFieldConfig: FieldConfig[] = [
  {
    name: "guestId",
    label: "Guest",
    type: "select",
    fullWidth: true,
    options: [],
  },
  {
    name: "roomId",
    label: "Room",
    type: "select",
  },
  {
    name: "roomRateId",
    label: "Rate",
    type: "select",
    options: [],
  },
  {
    name: "checkIn",
    label: "Check In",
    type: "date",
  },
  {
    name: "checkOut",
    label: "Check Out",
    type: "date",
  },
  {
    name: "adults",
    label: "Adults",
    type: "number",
  },
  {
    name: "children",
    label: "Children",
    type: "number",
  },
  // {
  //   name: "paymentStatus",
  //   label: "Payment Status",
  //   type: "select",
  //   options: [
  //     { label: "Unpaid", value: "UNPAID" },
  //     { label: "Partially Paid", value: "PARTIALLY_PAID" },
  //     { label: "Paid", value: "PAID" },
  //     { label: "Refunded", value: "REFUNDED" },
  //   ],
  // },
  {
    name: "type",
    label: "Reservation Type",
    type: "select",
    options: [
      { label: "Walk In", value: "WALK_IN" },
      { label: "Online", value: "ONLINE" },
      { label: "Phone", value: "PHONE" },
      { label: "Agent", value: "AGENT" },
    ],
  },
  // {
  //   name: "status",
  //   label: "Reservation Status",
  //   type: "select",
  //   options: [
  //     { label: "Pending", value: "PENDING" },
  //     { label: "Confirmed", value: "CONFIRMED" },
  //     { label: "Checked In", value: "CHECKED_IN" },
  //     { label: "Checked Out", value: "CHECKED_OUT" },
  //     { label: "Cancelled", value: "CANCELLED" },
  //     { label: "No Show", value: "NO_SHOW" },
  //   ],
  // },
];

export const editReservationFieldConfig: FieldConfig[] = [
  {
    name: "adults",
    label: "Adults",
    type: "number",
  },
  {
    name: "children",
    label: "Children",
    type: "number",
  },
];

export const cancelReservationFieldConfig: FieldConfig[] = [
  {
    name: "reason",
    label: "Cancellation Reason",
    type: "text",
  },
];

export const changeReservationRoomFieldConfig: FieldConfig[] = [
  {
    name: "roomId",
    label: "Room",
    type: "select",
  },
  {
    name: "roomRateId",
    label: "Rate",
    type: "select",
    options: [],
  },
];

export const createFolioTransactionFieldConfig: FieldConfig[] = [
  {
    name: "type",
    label: "Transaction Type",
    type: "select",
    options: [
      { label: "Room Charge", value: "ROOM_CHARGE" },
      { label: "Restaurant", value: "RESTAURANT" },
      { label: "Laundry", value: "LAUNDRY" },
      { label: "Gym", value: "GYM" },
      { label: "Tax", value: "TAX" },
      { label: "Discount", value: "DISCOUNT" },
      { label: "Adjustment", value: "ADJUSTMENT" },
    ],
  },
  {
    name: "amount",
    label: "Amount",
    type: "number",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    fullWidth: true,
  },
];
