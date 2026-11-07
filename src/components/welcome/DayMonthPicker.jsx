import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MONTHS, formatBirthday } from "@/lib/firstTimerOptions";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

// The grid follows the real calendar for the current year, so weekdays always line up.
// Only the day and month are saved. The year is never stored.
export default function DayMonthPicker({ value, onChange, id }) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(value?.month ?? new Date().getMonth() + 1);

  useEffect(() => {
    if (value?.month) setMonth(value.month);
  }, [value?.month]);

  const now = new Date();
  const year = now.getFullYear();
  const isLeapYear = new Date(year, 1, 29).getMonth() === 1;
  const total = new Date(year, month, 0).getDate();
  const offset = new Date(year, month - 1, 1).getDay(); // 0 = Sunday
  const cells = [...Array(offset).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)];
  const isToday = (day) => now.getMonth() + 1 === month && now.getDate() === day;
  const showLeapDay = month === 2 && !isLeapYear;

  const label = formatBirthday(value?.month, value?.day);
  const shiftMonth = (dir) => setMonth((m) => ((m - 1 + dir + 12) % 12) + 1);
  const pick = (m, d) => {
    onChange({ month: m, day: d });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          className="flex h-12 w-full items-center gap-2.5 rounded-2xl border border-input bg-muted/40 px-4 text-left text-[15px] transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          <CalendarDays className="h-4 w-4 shrink-0 text-primary/70" />
          <span className={cn("truncate", label ? "text-foreground" : "text-muted-foreground")}>
            {label ?? "Select day & month"}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[19rem] rounded-3xl border-border/70 p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            aria-label="Previous month"
            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-heading text-base font-semibold text-foreground">{MONTHS[month - 1]}</span>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            aria-label="Next month"
            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase text-muted-foreground">
          {WEEKDAYS.map((day, i) => (
            <span key={`${day}-${i}`}>{day}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) =>
            day ? (
              <button
                key={day}
                type="button"
                onClick={() => pick(month, day)}
                className={cn(
                  "flex h-9 items-center justify-center rounded-full text-sm transition-colors",
                  value?.month === month && value?.day === day
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-secondary",
                  isToday(day) && !(value?.month === month && value?.day === day)
                    ? "font-semibold ring-1 ring-primary/50"
                    : "",
                )}
              >
                {day}
              </button>
            ) : (
              <span key={`empty-${i}`} />
            ),
          )}
        </div>

        {showLeapDay ? (
          <button
            type="button"
            onClick={() => pick(2, 29)}
            className={cn(
              "mt-2 w-full rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              value?.month === 2 && value?.day === 29
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent",
            )}
          >
            Born on 29 February? Tap here
          </button>
        ) : null}

        <div className="mt-3 flex items-center justify-between border-t border-border/70 pt-2">
          <span className="text-xs text-muted-foreground">Day and month only</span>
          <button
            type="button"
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Clear
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}