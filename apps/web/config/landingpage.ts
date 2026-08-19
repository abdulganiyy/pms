const landingPagePreferences = [
  {
    href: "/dashboard/frontdesk",
    permission: "front_desk.view",
  },
  {
    href: "/dashboard/reservation",
    permission: "reservations.view",
  },
  {
    href: "/dashboard/guest",
    permission: "guests.view",
  },
  {
    href: "/dashboard/room",
    permission: "rooms.view",
  },
  {
    href: "/dashboard/housekeeping",
    permission: "housekeeping.view",
  },
  {
    href: "/dashboard/maintenance",
    permission: "maintenance.view",
  },
  {
    href: "/dashboard/billing",
    permission: "reports.folio.view",
  },
  {
    href: "/dashboard/inventory",
    permission: "inventory.view",
  },
  {
    href: "/dashboard/service",
    permission: "services.view",
  },
  {
    href: "/dashboard/setting",
    permission: "setting.view",
  },
  {
    href: "/dashboard/help",
    permission: undefined,
  },
];

function canAccessDashboard(permissions: string[]) {
  return permissions.includes("*") || permissions.includes("dashboard.view");
}

function hasPermission(permissions: string[], required?: string) {
  if (!required) return true;

  return permissions.includes("*") || permissions.includes(required);
}

export function getLandingPage(permissions: string[]) {
  if (canAccessDashboard(permissions)) {
    return "/dashboard";
  }

  const page = landingPagePreferences.find((item) =>
    hasPermission(permissions, item.permission),
  );

  return page?.href ?? null;
}
