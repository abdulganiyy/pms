import { LucideIcon } from "lucide-react";

export type FieldOption = {
  label: string;
  value: string;
};

export type FieldConfig = {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio"
    | "file"
    | "date"
    | "number";

  placeholder?: string;

  options?: FieldOption[];

  defaultValue?: unknown;

  required?: boolean;

  fullWidth?: boolean;

  hideLabel?: boolean;

  oneThirdWidth?: boolean;

  multiple?: boolean;
  accept?: string;
  maxFiles?: number;
};

export type FormConfig = {
  icon?: LucideIcon;
  title: string;
  fields: FieldConfig[];
};
