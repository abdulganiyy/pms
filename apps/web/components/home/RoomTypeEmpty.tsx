export function RoomTypesEmpty() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <h3 className="font-serif text-2xl">No rooms available</h3>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        We currently don't have any room types available to display. Please
        check back later.
      </p>
    </div>
  );
}
