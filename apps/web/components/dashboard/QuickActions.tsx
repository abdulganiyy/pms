import {
  CalendarCheck,
  LogIn,
  LogOut,
  Settings,
  Sparkles,
  UserRound,
  Wrench,
} from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      label: "New Reservation",
      icon: CalendarCheck,
    },
    {
      label: "Check In",
      icon: LogIn,
    },
    {
      label: "Check Out",
      icon: LogOut,
    },
    {
      label: "Add Guest",
      icon: UserRound,
    },
    {
      label: "Housekeeping",
      icon: Sparkles,
    },
    {
      label: "Maintenance",
      icon: Wrench,
    },
  ];

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold">Quick Actions</h2>

        <Settings className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.label}
              type="button"
              className="flex items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-medium transition hover:bg-slate-50"
            >
              <Icon className="h-4 w-4 text-primary" />

              {action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
