import { AlertCircle, RefreshCw } from "lucide-react";

interface BookingPageErrorProps {
  onRetry: () => void;
}

export function BookingPageError({ onRetry }: BookingPageErrorProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-6 py-20">
        <div className="w-full border border-border bg-card p-8 text-center sm:p-12">
          <div className="mx-auto flex h-12 w-12 items-center justify-center border border-border">
            <AlertCircle size={20} className="text-accent" />
          </div>

          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-accent">
            Something went wrong
          </p>

          <h1 className="mt-3 font-serif text-4xl tracking-tight">
            We couldn&apos;t find your rooms.
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground">
            We&apos;re having trouble loading availability right now. Please try
            again. Your selected dates have not been changed.
          </p>

          <button
            type="button"
            onClick={onRetry}
            className="mt-8 inline-flex items-center justify-center gap-2 bg-primary px-6 py-3 text-xs uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-accent"
          >
            <RefreshCw size={14} />
            Try again
          </button>
        </div>
      </div>
    </main>
  );
}
