"use client";

import {
  BedDouble,
  CalendarCheck,
  CalendarDays,
  CircleDollarSign,
  ClipboardCheck,
  DoorOpen,
  Hotel,
  LogIn,
  LogOut,
  MoreHorizontal,
  Plus,
  Settings,
  Sparkles,
  UserRound,
  Wrench,
} from "lucide-react";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

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

  arrivals?: DashboardArrival[];

  departures?: DashboardDeparture[];

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

export interface DashboardArrival {
  id: string;
  guestName: string;
  roomNumber?: string;
  roomType?: string;
  arrivalTime?: string;
  status: string;
}

export interface DashboardDeparture {
  id: string;
  guestName: string;
  roomNumber?: string;
  departureTime?: string;
  status: string;
}

export interface DashboardPayment {
  id: string;
  guestName: string;
  invoiceNumber?: string;
  paymentMethod?: string;
  amount: number;
  status: string;
}

/* -------------------------------------------------------------------------- */
/* Main Component                                                             */
/* -------------------------------------------------------------------------- */

interface DashboardContentProps {
  data: DashboardSummary;
}

export function DashboardContent({ data }: DashboardContentProps) {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* Header */}
        <DashboardHeader />

        {/* KPI Cards */}
        <DashboardStats data={data} />

        {/* Quick Actions */}
        <QuickActions />

        {/* Arrivals / Departures / Room Status */}
        <div className="grid gap-6 xl:grid-cols-3">
          <ArrivalsCard arrivals={data.arrivals ?? []} />

          <DeparturesCard departures={data.departures ?? []} />

          <RoomStatusCard roomStatus={data.roomStatus} />
        </div>

        {/* Occupancy / Revenue / Alerts */}
        <div className="grid gap-6 xl:grid-cols-3">
          <OccupancyCard
            occupancy={data.occupancy ?? []}
            currentOccupancy={data.stats.occupancy}
          />

          <RevenueCard revenue={data.revenue} />

          <AlertsCard alerts={data.alerts} />
        </div>

        {/* Recent Payments */}
        <RecentPayments payments={data.recentPayments ?? []} />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Header                                                                     */
/* -------------------------------------------------------------------------- */

function DashboardHeader() {
  const today = new Intl.DateTimeFormat("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date());

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <Hotel className="h-6 w-6 text-primary" />

          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          Here's what's happening at your hotel today.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-slate-50"
        >
          <CalendarDays className="h-4 w-4" />
          {today}
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New Reservation
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Dashboard Stats                                                            */
/* -------------------------------------------------------------------------- */

function DashboardStats({ data }: { data: DashboardSummary }) {
  const stats = [
    {
      title: "Occupancy",
      value: `${data.stats.occupancy}%`,
      description: "Today's occupancy",
      icon: BedDouble,
    },
    {
      title: "Today's Revenue",
      value: formatCurrency(data.revenue?.total ?? data.stats.revenue ?? 0),
      description: "Room + services",
      icon: CircleDollarSign,
    },
    {
      title: "Arrivals",
      value: data.stats.arrivals.toString(),
      description: "Expected today",
      icon: LogIn,
    },
    {
      title: "Departures",
      value: data.stats.departures.toString(),
      description: "Expected today",
      icon: LogOut,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-xl border bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight">
                  {stat.value}
                </p>
              </div>

              <div className="rounded-lg bg-primary/10 p-2.5">
                <Icon className="h-5 w-5 text-primary" />
              </div>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              {stat.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Quick Actions                                                              */
/* -------------------------------------------------------------------------- */

function QuickActions() {
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

/* -------------------------------------------------------------------------- */
/* Arrivals                                                                   */
/* -------------------------------------------------------------------------- */

function ArrivalsCard({ arrivals }: { arrivals: DashboardArrival[] }) {
  return (
    <DashboardCard
      title="Today's Arrivals"
      description="Guests expected to check in"
      icon={LogIn}
      action="View all"
    >
      {arrivals.length === 0 ? (
        <EmptyState message="No arrivals today" />
      ) : (
        <div className="divide-y">
          {arrivals.slice(0, 5).map((arrival) => (
            <div
              key={arrival.id}
              className="flex items-center justify-between p-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
                  <UserRound className="h-4 w-4 text-slate-600" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {arrival.guestName}
                  </p>

                  <p className="truncate text-xs text-muted-foreground">
                    {arrival.roomNumber
                      ? `Room ${arrival.roomNumber}`
                      : "Room not assigned"}

                    {arrival.roomType && ` · ${arrival.roomType}`}
                  </p>
                </div>
              </div>

              <div className="text-right">
                {arrival.arrivalTime && (
                  <p className="text-xs font-medium">{arrival.arrivalTime}</p>
                )}

                <StatusBadge status={arrival.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}

/* -------------------------------------------------------------------------- */
/* Departures                                                                 */
/* -------------------------------------------------------------------------- */

function DeparturesCard({ departures }: { departures: DashboardDeparture[] }) {
  return (
    <DashboardCard
      title="Today's Departures"
      description="Guests expected to check out"
      icon={LogOut}
      action="View all"
    >
      {departures.length === 0 ? (
        <EmptyState message="No departures today" />
      ) : (
        <div className="divide-y">
          {departures.slice(0, 5).map((departure) => (
            <div
              key={departure.id}
              className="flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
                  <UserRound className="h-4 w-4 text-slate-600" />
                </div>

                <div>
                  <p className="text-sm font-medium">{departure.guestName}</p>

                  <p className="text-xs text-muted-foreground">
                    {departure.roomNumber
                      ? `Room ${departure.roomNumber}`
                      : "Room not assigned"}
                  </p>
                </div>
              </div>

              <div className="text-right">
                {departure.departureTime && (
                  <p className="text-xs font-medium">
                    {departure.departureTime}
                  </p>
                )}

                <StatusBadge status={departure.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}

/* -------------------------------------------------------------------------- */
/* Room Status                                                                */
/* -------------------------------------------------------------------------- */

function RoomStatusCard({
  roomStatus,
}: {
  roomStatus: DashboardSummary["roomStatus"];
}) {
  const rooms = [
    {
      label: "Available",
      count: roomStatus.available,
      className: "bg-emerald-500",
    },
    {
      label: "Occupied",
      count: roomStatus.occupied,
      className: "bg-blue-500",
    },
    {
      label: "Dirty",
      count: roomStatus.dirty,
      className: "bg-amber-500",
    },
    {
      label: "Maintenance",
      count: roomStatus.maintenance,
      className: "bg-red-500",
    },
    {
      label: "Out of Order",
      count: roomStatus.outOfOrder,
      className: "bg-gray-500",
    },
  ];

  const total = rooms.reduce((sum, room) => sum + room.count, 0);

  return (
    <DashboardCard
      title="Room Status"
      description="Current room inventory"
      icon={DoorOpen}
      action="Front desk"
    >
      <div className="p-5">
        {/* Status bar */}
        <div className="mb-6 flex h-3 overflow-hidden rounded-full bg-slate-100">
          {rooms.map((room) => {
            if (!room.count || !total) {
              return null;
            }

            return (
              <div
                key={room.label}
                className={room.className}
                style={{
                  width: `${(room.count / total) * 100}%`,
                }}
              />
            );
          })}
        </div>

        <div className="space-y-4">
          {rooms.map((room) => (
            <div key={room.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={cn("h-2.5 w-2.5 rounded-full", room.className)}
                />

                <span className="text-sm text-muted-foreground">
                  {room.label}
                </span>
              </div>

              <span className="text-sm font-semibold">{room.count}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 border-t pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Rooms</span>

            <span className="font-semibold">{total}</span>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}

/* -------------------------------------------------------------------------- */
/* Occupancy                                                                  */
/* -------------------------------------------------------------------------- */

function OccupancyCard({
  occupancy,
  currentOccupancy,
}: {
  occupancy: DashboardSummary["occupancy"];
  currentOccupancy: number;
}) {
  const chartData =
    occupancy && occupancy.length > 0
      ? occupancy
      : [
          {
            date: "Mon",
            percentage: 0,
          },
          {
            date: "Tue",
            percentage: 0,
          },
          {
            date: "Wed",
            percentage: 0,
          },
          {
            date: "Thu",
            percentage: 0,
          },
          {
            date: "Fri",
            percentage: 0,
          },
          {
            date: "Sat",
            percentage: 0,
          },
          {
            date: "Sun",
            percentage: 0,
          },
        ];

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Occupancy</h2>

          <p className="text-xs text-muted-foreground">Last 7 days</p>
        </div>

        <BedDouble className="h-5 w-5 text-primary" />
      </div>

      <div className="mt-6 flex h-36 items-end gap-2">
        {chartData.slice(-7).map((item, index) => (
          <div
            key={`${item.date}-${index}`}
            className="flex flex-1 flex-col items-center gap-2"
          >
            <div className="flex h-32 w-full items-end">
              <div
                className="w-full rounded-t-md bg-primary/80 transition-all"
                style={{
                  height: `${Math.max(Math.min(item.percentage, 100), 0)}%`,
                }}
                title={`${item.percentage}%`}
              />
            </div>

            <span className="text-[10px] text-muted-foreground">
              {formatChartDate(item.date)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between border-t pt-4">
        <span className="text-sm text-muted-foreground">Current occupancy</span>

        <span className="font-semibold">{currentOccupancy}%</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Revenue                                                                    */
/* -------------------------------------------------------------------------- */

function RevenueCard({ revenue }: { revenue?: DashboardSummary["revenue"] }) {
  const room = revenue?.room ?? 0;
  const restaurant = revenue?.restaurant ?? 0;
  const services = revenue?.services ?? 0;

  const total = revenue?.total ?? room + restaurant + services;

  const items = [
    {
      label: "Room Revenue",
      amount: room,
    },
    {
      label: "Restaurant",
      amount: restaurant,
    },
    {
      label: "Other Services",
      amount: services,
    },
  ];

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Revenue</h2>

          <p className="text-xs text-muted-foreground">Today's revenue</p>
        </div>

        <CircleDollarSign className="h-5 w-5 text-primary" />
      </div>

      <div className="mt-6">
        <p className="text-3xl font-bold">{formatCurrency(total)}</p>

        <p className="mt-1 text-xs text-muted-foreground">
          Revenue generated today
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {items.map((item) => {
          const percentage = total > 0 ? (item.amount / total) * 100 : 0;

          return (
            <div key={item.label}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {item.label}
                </span>

                <span className="text-xs font-medium">
                  {formatCurrency(item.amount)}
                </span>
              </div>

              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Alerts                                                                     */
/* -------------------------------------------------------------------------- */

function AlertsCard({ alerts }: { alerts?: DashboardSummary["alerts"] }) {
  const items = [
    {
      icon: Sparkles,
      title: `${alerts?.housekeeping ?? 0} rooms need cleaning`,
      description: "Housekeeping attention required",
      type: "warning",
    },
    {
      icon: Wrench,
      title: `${alerts?.maintenance ?? 0} maintenance requests`,
      description: "Pending maintenance tasks",
      type: "danger",
    },
    {
      icon: ClipboardCheck,
      title: `${alerts?.pendingPayments ?? 0} pending payments`,
      description: "Review outstanding folios",
      type: "warning",
    },
  ];

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Alerts</h2>

          <p className="text-xs text-muted-foreground">
            Items requiring attention
          </p>
        </div>

        <button
          type="button"
          className="text-xs font-medium text-primary hover:underline"
        >
          View all
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {items.map((alert) => {
          const Icon = alert.icon;

          return (
            <div
              key={alert.title}
              className="flex items-center gap-3 rounded-lg border p-3"
            >
              <div
                className={cn(
                  "rounded-lg p-2",
                  alert.type === "danger"
                    ? "bg-red-100 text-red-600"
                    : "bg-amber-100 text-amber-600",
                )}
              >
                <Icon className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium">{alert.title}</p>

                <p className="text-xs text-muted-foreground">
                  {alert.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Recent Payments                                                            */
/* -------------------------------------------------------------------------- */

function RecentPayments({ payments }: { payments: DashboardPayment[] }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b p-5">
        <div>
          <h2 className="font-semibold">Recent Payments</h2>

          <p className="text-xs text-muted-foreground">
            Latest financial transactions
          </p>
        </div>

        <button
          type="button"
          className="text-sm font-medium text-primary hover:underline"
        >
          View payments
        </button>
      </div>

      {payments.length === 0 ? (
        <EmptyState message="No recent payments" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="border-b">
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">
                  Guest
                </th>

                <th className="px-5 py-3 text-left font-medium text-muted-foreground">
                  Invoice
                </th>

                <th className="px-5 py-3 text-left font-medium text-muted-foreground">
                  Method
                </th>

                <th className="px-5 py-3 text-right font-medium text-muted-foreground">
                  Amount
                </th>

                <th className="px-5 py-3 text-right font-medium text-muted-foreground">
                  Status
                </th>

                <th className="px-5 py-3" />
              </tr>
            </thead>

            <tbody className="divide-y">
              {payments.slice(0, 5).map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-medium">{payment.guestName}</td>

                  <td className="px-5 py-4 text-muted-foreground">
                    {payment.invoiceNumber ?? "-"}
                  </td>

                  <td className="px-5 py-4 text-muted-foreground">
                    {payment.paymentMethod ?? "-"}
                  </td>

                  <td className="px-5 py-4 text-right font-medium">
                    {formatCurrency(payment.amount)}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <StatusBadge status={payment.status} />
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button type="button" aria-label="Payment actions">
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Generic Dashboard Card                                                    */
/* -------------------------------------------------------------------------- */

function DashboardCard({
  title,
  description,
  icon: Icon,
  action,
  children,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  action?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="flex items-start justify-between border-b p-5">
        <div className="flex gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Icon className="h-4 w-4 text-primary" />
          </div>

          <div>
            <h2 className="font-semibold">{title}</h2>

            <p className="mt-0.5 text-xs text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        {action && (
          <button
            type="button"
            className="text-xs font-medium text-primary hover:underline"
          >
            {action}
          </button>
        )}
      </div>

      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Status Badge                                                               */
/* -------------------------------------------------------------------------- */

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase().replace(/[_-]/g, " ");

  const isSuccess = [
    "confirmed",
    "paid",
    "ready",
    "completed",
    "checked in",
  ].includes(normalized);

  const isWarning = ["pending", "partially paid", "partial"].includes(
    normalized,
  );

  const isDanger = ["cancelled", "failed", "overdue", "no show"].includes(
    normalized,
  );

  return (
    <span
      className={cn(
        "mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
        isSuccess && "bg-emerald-100 text-emerald-700",
        isWarning && "bg-amber-100 text-amber-700",
        isDanger && "bg-red-100 text-red-700",
        !isSuccess && !isWarning && !isDanger && "bg-slate-100 text-slate-700",
      )}
    >
      {normalized}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty State                                                                */
/* -------------------------------------------------------------------------- */

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-[180px] items-center justify-center p-6">
      <div className="text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
          <ClipboardCheck className="h-5 w-5 text-slate-400" />
        </div>

        <p className="mt-3 text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatChartDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-NG", {
    weekday: "short",
  }).format(date);
}
