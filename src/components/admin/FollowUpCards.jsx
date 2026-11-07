import { AlertCircle, UserPlus } from "lucide-react";
import { OVERDUE_DAYS } from "@/lib/followUp";

export default function FollowUpCards({ stats, loading, onShowNew }) {
  const cards = [
    { label: "Still new", value: stats?.still_new, hint: "Not contacted yet", Icon: UserPlus, tone: "text-primary" },
    {
      label: "Needs attention",
      value: stats?.overdue,
      hint: `New for ${OVERDUE_DAYS}+ days`,
      Icon: AlertCircle,
      tone: "text-destructive",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map(({ label, value, hint, Icon, tone }) => (
        <button
          key={label}
          type="button"
          onClick={onShowNew}
          className="card-soft flex items-center gap-3 p-4 text-left transition-colors hover:bg-muted/40"
        >
          <span className={"flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted " + tone}>
            <Icon className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-2xl font-semibold leading-none text-foreground">
              {loading ? "…" : (value ?? 0)}
            </span>
            <span className="mt-1 block text-xs font-semibold text-foreground">{label}</span>
            <span className="block text-[11px] text-muted-foreground">{hint}</span>
          </span>
        </button>
      ))}
    </div>
  );
}