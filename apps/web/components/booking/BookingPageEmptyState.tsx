import { CalendarX2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function BookingPageEmptyState() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-6 py-6 lg:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="font-serif text-2xl tracking-tight">
            City West Hotel<span className="text-accent">.</span>
          </Link>

          <Link
            href="/#book"
            className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={15} />
            Change dates
          </Link>
        </div>
      </header>

      <div className="mx-auto flex min-h-[65vh] max-w-2xl items-center justify-center px-6 py-20">
        <div className="w-full border border-border bg-card p-8 text-center sm:p-12">
          <div className="mx-auto flex h-12 w-12 items-center justify-center border border-border">
            <CalendarX2 size={20} className="text-accent" />
          </div>

          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-accent">
            No availability
          </p>

          <h1 className="mt-3 font-serif text-4xl tracking-tight">
            No rooms available
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground">
            Unfortunately, we don&apos;t have any rooms available for your
            selected dates. Try changing your dates or adjusting the number of
            guests.
          </p>

          <Link
            href="/#book"
            className="mt-8 inline-flex items-center justify-center gap-2 bg-primary px-6 py-3 text-xs uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-primary"
          >
            <ArrowLeft size={14} />
            Change dates
          </Link>
        </div>
      </div>
    </main>
  );
}
