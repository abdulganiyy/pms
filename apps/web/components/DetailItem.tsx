type DetailItemProps = {
  label: string;
  value?: string | number | null;
};

export function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm">
        {value || <span className="text-muted-foreground">—</span>}
      </p>
    </div>
  );
}
