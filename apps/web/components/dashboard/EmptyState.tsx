import { ClipboardCheck } from "lucide-react";

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-45 items-center justify-center p-6">
      <div className="text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
          <ClipboardCheck className="h-5 w-5 text-slate-400" />
        </div>

        <p className="mt-3 text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
