import { cn } from "@/lib/utils";

type StatusProps = {
  title: string;
};

const Status = ({ title }: StatusProps) => {
  return (
    <div
      className={cn(
        `inline-block p-2 rounded-2xl text-white text-xs border-2`,
        {
          "border-pending text-pending": title == "pending_verification",
          "border-success":
            title == "success" || title == "completed" || title == "active",
          "border-danger": title == "cancelled",
          "border-processing": title == "processing",
          "border-draft": title == "draft",
        },
      )}
    >
      <span className="inline-block h-2 w-2 rounded-full bg-white mr-1"></span>
      {title[0].toUpperCase() + title.substring(1).toLowerCase()}
    </div>
  );
};

export default Status;
