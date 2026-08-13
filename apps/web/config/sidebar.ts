"use client";

import {
  Bed,
  Box,
  CalendarDays,
  CreditCard,
  FileText,
  Info,
  LayoutGrid,
  MessageCircleMore,
  UserRound,
  UsersRound,
} from "lucide-react";

export type SidebarItem = {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  href?: string;
  permission?: string;
  children?: SidebarItem[];
};

export const sidebarConfig: SidebarItem[] = [
  { label: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
  {
    label: "Management",
    children: [
      {
        icon: UserRound,
        label: "Guests",
        href: "/dashboard/guest",
        permission: "guest.view",
      },
      {
        icon: UsersRound,
        label: "Users",
        href: "/dashboard/user",
        permission: "user.view",
      },
      {
        icon: Bed,
        label: "Rooms",
        href: "/dashboard/room",
        permission: "room.view",
      },
      {
        icon: CalendarDays,
        label: "Reservations",
        href: "/dashboard/reservation",
        permission: "reservation.view",
      },
    ],
  },
  {
    label: "Operations",
    children: [
      {
        icon: Box,
        label: "Inventory",
        href: "/dashboard/inventory",
        permission: "inventory.view",
      },
      {
        icon: CreditCard,
        label: "Billing",
        href: "/dashboard/billing",
        permission: "billing.view",
      },
      {
        icon: FileText,
        label: "Services",
        href: "/dashboard/service",
        permission: "service.view",
      },
    ],
  },
  {
    label: "Other",
    children: [
      // {
      //   icon: MessageCircleMore,
      //   label: "Customer Review",
      //   href: "/dashboard/review",
      //   permission: "review.view",
      // },
      {
        icon: MessageCircleMore,
        label: "Settings",
        href: "/dashboard/setting",
        permission: "setting.view",
      },
      {
        icon: Info,
        label: "Help",
        href: "/dashboard/help",
        permission: "biller.view",
      },
    ],
  },
];

function hasPermission(permissions: string[], required?: string) {
  if (!required) return true;

  return permissions.includes("*") || permissions.includes(required);
}

function filterSidebar(
  items: SidebarItem[],
  permissions: string[],
): SidebarItem[] {
  return items
    .map((item) => {
      // Leaf node
      if (!item.children) {
        return hasPermission(permissions, item.permission) ? item : null;
      }

      // Group
      const visibleChildren = filterSidebar(item.children, permissions);

      if (visibleChildren.length === 0) {
        return null;
      }

      return {
        ...item,
        children: visibleChildren,
      };
    })
    .filter(Boolean) as SidebarItem[];
}

export function getSidebar(permissions: string[]) {
  return filterSidebar(sidebarConfig, permissions);
}
