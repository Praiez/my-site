import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Cake, MessageCircle, Phone } from "lucide-react";
import { MONTHS } from "@/lib/firstTimerOptions";
import { telLink, whatsappLink } from "@/lib/phone";
import { birthdaysThisMonth } from "@/lib/server-fns";

const actionClass =
  "inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-xs font-semibold text-foreground transition-colors hover:bg-secondary";

export default function BirthdaysThisMonth() {
  const load = useServerFn(birthdaysThisMonth);
  const query = useQuery({ queryKey: ["birthdays-this-month"], queryFn: () => load(), staleTime: 0 });

  const items = query.data?.items ?? [];
  const monthName = query.data ? MONTHS[query.data.month - 1] : "this month";

  return (
    <div className="card-soft overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border/70 px-4 py-3">
        <Cake className="h-4 w-4 text-primary" />
        <h2 className="text-base font-semibold text-foreground">Birthdays in {monthName}</h2>
        {query.data ? (
          <span className="ml-auto rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-secondary-foreground">
            {items.length}
          </span>
        ) : null}
      </div>

      {query.isLoading ? (
        <p className="px-4 py-6 text-center text-sm text-muted-foreground">Loading…</p>
      ) : query.isError ? (
        <p className="px-4 py-6 text-center text-sm text-muted-foreground">Could not load birthdays.</p>
      ) : items.length === 0 ? (
        <p className="px-4 py-6 text-center text-sm text-muted-foreground">No birthdays this month.</p>
      ) : (
        <ul className="divide-y divide-border/70">
          {items.map((person) => {
            const isToday = person.birth_day === query.data.today;
            const call = telLink(person.phone);
            const whatsapp = whatsappLink(person.phone);
            return (
              <li key={person.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <span
                  className={
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold " +
                    (isToday ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary")
                  }
                >
                  {person.birth_day}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{person.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {person.birth_day} {monthName}
                    {isToday ? " · Today" : ""}
                  </p>
                </div>
                {call ? (
                  <div className="flex gap-2">
                    <a href={call} className={actionClass}>
                      <Phone className="h-3.5 w-3.5" /> Call
                    </a>
                    <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={actionClass}>
                      <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                    </a>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}