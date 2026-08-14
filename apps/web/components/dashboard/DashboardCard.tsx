import Link from "next/link";

export function DashboardCard({
  title,
  description,
  icon: Icon,
  action,
  children,
  url,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  action?: string;
  children: React.ReactNode;
  url?: string;
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
          <Link
            href={url ?? ""}
            type="button"
            className="text-xs font-medium text-primary hover:underline"
          >
            {action}
          </Link>
        )}
      </div>

      {children}
    </div>
  );
}
