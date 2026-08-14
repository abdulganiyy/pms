import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
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
