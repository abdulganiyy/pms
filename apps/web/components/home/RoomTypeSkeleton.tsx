export function RoomTypeSkeleton() {
  return (
    <div className="group animate-pulse">
      <div className="aspect-4/5 w-full bg-muted" />

      <div className="flex items-start justify-between border-b border-border py-5">
        <div className="space-y-2">
          <div className="h-7 w-40 bg-muted" />
          <div className="h-3 w-28 bg-muted" />
        </div>

        <div className="h-3 w-20 bg-muted" />
      </div>

      <div className="mt-4 h-3 w-24 bg-muted" />
    </div>
  );
}
