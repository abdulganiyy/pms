export function RoomTypeError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <h3 className="font-serif text-2xl">Unable to load our rooms</h3>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        We couldn't load the available room types right now. Please try again.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-6 border border-border px-5 py-3 text-xs uppercase tracking-[0.15em] transition-colors hover:bg-foreground hover:text-background"
      >
        Try again
      </button>
    </div>
  );
}
