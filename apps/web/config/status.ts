export type StatusType =
  | "payment"
  | "reservation"
  | "room"
  | "restaurant"
  | "userStatus"
  | "role"
  | "reservationType";

type StatusConfig = {
  label: string;
  className: string;
};

export const statusConfig: Record<StatusType, Record<string, StatusConfig>> = {
  payment: {
    UNPAID: {
      label: "Unpaid",
      className: "bg-yellow-100 text-yellow-800",
    },
    PENDING: {
      label: "Pending",
      className: "bg-yellow-100 text-yellow-800",
    },
    PAID: {
      label: "Paid",
      className: "bg-green-100 text-green-800",
    },
    PARTIALLY_PAID: {
      label: "Partially Paid",
      className: "bg-blue-100 text-blue-800",
    },
    FAILED: {
      label: "Failed",
      className: "bg-red-100 text-red-800",
    },
    REFUNDED: {
      label: "Refunded",
      className: "bg-purple-100 text-purple-800",
    },
    PARTIALLY_REFUNDED: {
      label: "Partially Refunded",
      className: "bg-purple-100 text-purple-800",
    },
    ROOM_CHARGED: {
      label: "Room Charged",
      className: "bg-purple-100 text-purple-800",
    },
  },

  reservation: {
    PENDING: {
      label: "Pending",
      className: "bg-yellow-100 text-yellow-800",
    },
    CONFIRMED: {
      label: "Confirmed",
      className: "bg-blue-100 text-blue-800",
    },
    CHECKED_IN: {
      label: "Checked In",
      className: "bg-green-100 text-green-800",
    },
    CHECKED_OUT: {
      label: "Checked Out",
      className: "bg-gray-100 text-gray-800",
    },
    CANCELLED: {
      label: "Cancelled",
      className: "bg-red-100 text-red-800",
    },
    NO_SHOW: {
      label: "No Show",
      className: "bg-orange-100 text-orange-800",
    },
  },

  room: {
    AVAILABLE: {
      label: "Available",
      className: "bg-green-100 text-green-800",
    },
    OCCUPIED: {
      label: "Occupied",
      className: "bg-blue-100 text-blue-800",
    },
    DIRTY: {
      label: "Dirty",
      className: "bg-orange-100 text-orange-800",
    },
    MAINTENANCE: {
      label: "Maintenance",
      className: "bg-red-100 text-red-800",
    },
  },

  restaurant: {
    PENDING: {
      label: "Pending",
      className: "bg-yellow-100 text-yellow-800",
    },
    PREPARING: {
      label: "Preparing",
      className: "bg-blue-100 text-blue-800",
    },
    READY: {
      label: "Ready",
      className: "bg-green-100 text-green-800",
    },
    SERVED: { label: "Served", className: "bg-green-100 text-green-800" },
    CONFIRMED: {
      label: "Completed",
      className: "bg-gray-100 text-gray-800",
    },
    COMPLETED: {
      label: "Completed",
      className: "bg-gray-100 text-gray-800",
    },
    CANCELLED: {
      label: "Cancelled",
      className: "bg-red-100 text-red-800",
    },
  },
  userStatus: {
    PENDING_VERIFICATION: {
      label: "Pending Verification",
      className: "bg-yellow-100 text-yellow-800",
    },
    ACTIVE: {
      label: "Active",
      className: "bg-green-100 text-green-800",
    },
    SUSPENDED: {
      label: "Suspended",
      className: "bg-orange-100 text-orange-800",
    },
    BLOCKED: {
      label: "Blocked",
      className: "bg-red-100 text-red-800",
    },
    DELETED: {
      label: "Deleted",
      className: "bg-gray-100 text-gray-800",
    },
  },
  role: {
    SUPER_ADMIN: {
      label: "Super Admin",
      className: "bg-purple-100 text-purple-800",
    },
    ADMIN: {
      label: "Admin",
      className: "bg-blue-100 text-blue-800",
    },
    USER: {
      label: "User",
      className: "bg-gray-100 text-gray-800",
    },
  },
  reservationType: {
    WALK_IN: {
      label: "Walk-in",
      className: "bg-purple-100 text-purple-800",
    },
    ONLINE: {
      label: "Online",
      className: "bg-blue-100 text-blue-800",
    },
    PHONE: {
      label: "Phone",
      className: "bg-blue-100 text-blue-800",
    },
    EMAIL: {
      label: "Email",
      className: "bg-blue-100 text-blue-800",
    },
    OTA: {
      label: "OTA",
      className: "bg-gray-100 text-gray-800",
    },
    CORPORATE: {
      label: "Corporate",
      className: "bg-gray-100 text-gray-800",
    },
    GROUP: {
      label: "Group",
      className: "bg-blue-100 text-blue-800",
    },
  },
};

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getStatusConfig(
  type: StatusType,
  status: string,
): StatusConfig {
  return (
    statusConfig[type]?.[status] ?? {
      label: formatStatus(status),
      className: "bg-gray-100 text-gray-800",
    }
  );
}
