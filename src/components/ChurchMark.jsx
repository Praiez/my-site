import { Church } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChurchMark({ className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_10px_24px_-12px_rgba(140,60,80,0.8)]",
        className,
      )}
      aria-hidden="true"
    >
      <Church className="h-1/2 w-1/2" strokeWidth={1.6} />
    </span>
  );
}