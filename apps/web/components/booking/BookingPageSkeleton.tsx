import { Skeleton } from "@/components/ui/skeleton";

export function BookingPageSkeleton() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border px-6 py-6 lg:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-28" />
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-20">
        {/* Heading */}
        <div className="mb-14 max-w-2xl">
          <Skeleton className="mb-5 h-3 w-28" />
          <Skeleton className="h-16 w-72 sm:h-24 sm:w-[28rem]" />
          <Skeleton className="mt-7 h-4 w-full max-w-lg" />
          <Skeleton className="mt-2 h-4 w-4/5 max-w-lg" />
        </div>

        <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          {/* Left */}
          <div>
            {/* Search summary */}
            <div className="mb-10 grid gap-px border border-border bg-border sm:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-card p-5">
                  <Skeleton className="mb-5 h-4 w-4" />
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="mt-3 h-4 w-28" />
                </div>
              ))}
            </div>

            {/* Section heading */}
            <div className="mb-5 flex items-end justify-between">
              <div>
                <Skeleton className="mb-3 h-3 w-36" />
                <Skeleton className="h-10 w-64" />
              </div>

              <Skeleton className="h-3 w-28" />
            </div>

            {/* Room cards */}
            <div className="grid gap-3">
              {[1, 2, 3].map((room) => (
                <div key={room} className="border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-6">
                    <div className="min-w-0 flex-1">
                      <Skeleton className="h-7 w-48" />

                      <Skeleton className="mt-2 h-3 w-40" />

                      <Skeleton className="mt-5 h-3 w-full max-w-xs" />
                      <Skeleton className="mt-2 h-3 w-4/5 max-w-xs" />
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Skeleton className="ml-auto h-3 w-8" />
                        <Skeleton className="mt-2 h-5 w-24" />
                        <Skeleton className="mt-1 h-2 w-16" />
                      </div>

                      <Skeleton className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right / Form */}
          <div className="border border-border bg-secondary p-6 sm:p-8">
            <Skeleton className="h-3 w-28" />

            <Skeleton className="mt-3 h-10 w-48" />

            <div className="mt-8 grid gap-6">
              <div>
                <Skeleton className="h-3 w-20" />
                <Skeleton className="mt-3 h-9 w-full" />
              </div>

              <div>
                <Skeleton className="h-3 w-28" />
                <Skeleton className="mt-3 h-9 w-full" />
              </div>

              <div>
                <Skeleton className="h-3 w-24" />
                <Skeleton className="mt-3 h-20 w-full" />
              </div>
            </div>

            <div className="mt-8 border-t border-border pt-5">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>

              <Skeleton className="mt-4 h-3 w-40" />
            </div>

            <Skeleton className="mt-7 h-12 w-full" />
          </div>
        </div>
      </div>
    </main>
  );
}
