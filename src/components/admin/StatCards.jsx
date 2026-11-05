import { CalendarDays, Sparkles, Users } from "lucide-react";

const cards = [
  { key: "total", label: "Total first timers", icon: Users, tone: "bg-primary/10 text-primary" },
  { key: "week", label: "This week", icon: Sparkles, tone: "bg-secondary text-secondary-foreground" },
  { key: "today", label: "Today", icon: CalendarDays, tone: "bg-accent text-accent-foreground" },
];

export default function StatCards({ stats, loading }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {cards.map(({ key, label, icon: Icon, tone }) => (
        <div key={key} className="card-soft flex items-center gap-3 p-4 sm:p-5">
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${tone}`}>
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="font-heading text-2xl font-semibold leading-none text-foreground">
              {loading ? "—" : (stats?.[key] ?? 0)}
            </p>
            <p className="mt-1 truncate text-xs uppercase tracking-[0.1em] text-muted-foreground">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}