export function formatPermissionAction(permission: string) {
  const action = permission.split(".").slice(1).join(".");

  return action
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getModule(permission: string) {
  return permission.split(".")[0];
}

export function formatRoleName(role: string) {
  return role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export const moduleLabels: Record<string, string> = {
  dashboard: "Dashboard",
  reservations: "Reservations",
  guests: "Guests",
  rooms: "Rooms",
  room_types: "Room Types",
  rates: "Rates",
  availability: "Availability",
  housekeeping: "Housekeeping",
  maintenance: "Maintenance",
  front_desk: "Front Desk",
  checkin: "Check-in",
  checkout: "Check-out",
  folios: "Folios",
  room_charges: "Room Charges",
  payments: "Payments",
  invoices: "Invoices",
  refunds: "Refunds",
  cashier: "Cashier",
  night_audit: "Night Audit",
  reports: "Reports",
  restaurant: "Restaurant",
  services: "Services",
  guest_requests: "Guest Requests",
  reviews: "Reviews",
  promotions: "Promotions",
  booking_engine: "Booking Engine",
  channels: "Channels / OTA",
  door_access: "Door Access",
  users: "Users",
  roles: "Roles",
  permissions: "Permissions",
  departments: "Departments",
  settings: "Settings",
  taxes: "Taxes",
  audit_logs: "Audit Logs",
  communications: "Communications",
  inventory: "Inventory",
  suppliers: "Suppliers",
  purchase_orders: "Purchase Orders",
  exports: "Exports",
  integrations: "Integrations",
  api_keys: "API Keys",
  webhooks: "Webhooks",
};
