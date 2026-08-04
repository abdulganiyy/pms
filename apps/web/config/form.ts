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

export const createReservationFieldConfig: FieldConfig[] = [
  {
    name: "guest",
    label: "Guest Name",
    type: "text",
  },
  {
    name: "room",
    label: "Selected Room",
    type: "select",
    fullWidth: true,
    options: [
      { label: "Deluxe", value: "deluxe" },
      { label: "Executive", value: "executive" },
    ],
  },
  { name: "start", label: "Check In", type: "date" },
  { name: "end", label: "Check Out", type: "date" },
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
