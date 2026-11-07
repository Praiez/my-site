import { Briefcase, Cake, Heart, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { formatBirthday } from "@/lib/firstTimerOptions";
import { telLink, whatsappLink } from "@/lib/phone";

const initials = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Africa/Lagos",
      })
    : "";

const chipClass = "rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-secondary-foreground";

const actionClass =
  "inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-xs font-semibold text-foreground transition-colors hover:bg-secondary";

export default function EntryRow({ entry }) {
  const birthday = formatBirthday(entry.birth_month, entry.birth_day);
  const call = telLink(entry.phone);
  const whatsapp = whatsappLink(entry.phone);

  return (
    <li className="px-4 py-4 transition-colors hover:bg-muted/40 sm:px-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
          {initials(entry.full_name || "?")}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
            <p className="truncate font-semibold text-foreground">{entry.full_name}</p>
            <p className="text-xs text-muted-foreground">{formatDate(entry.submitted_at)}</p>
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" />
              {entry.phone}
            </span>
            {entry.email ? (
              <a
                href={`mailto:${entry.email}`}
                className="inline-flex max-w-full items-center gap-1 hover:text-primary hover:underline"
              >
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{entry.email}</span>
              </a>
            ) : null}
            {birthday ? (
              <span className="inline-flex items-center gap-1">
                <Cake className="h-3.5 w-3.5" />
                {birthday}
              </span>
            ) : null}
            {entry.occupation ? (
              <span className="inline-flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5" />
                {entry.occupation}
              </span>
            ) : null}
            {entry.sex ? <span className={chipClass}>{entry.sex}</span> : null}
            {entry.marital_status ? <span className={chipClass}>{entry.marital_status}</span> : null}
          </div>

          {entry.address ? (
            <p className="mt-1.5 flex items-start gap-1 text-xs text-muted-foreground/90">
              <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
              <span className="line-clamp-2">{entry.address}</span>
            </p>
          ) : null}

          {entry.prayer_request ? (
            <div className="mt-3 rounded-2xl bg-accent/60 px-3.5 py-3">
              <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-accent-foreground/80">
                <Heart className="h-3 w-3" /> Prayer request
              </p>
              <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground">
                {entry.prayer_request}
              </p>
            </div>
          ) : null}

          {call ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <a href={call} className={actionClass}>
                <Phone className="h-3.5 w-3.5" /> Call
              </a>
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={actionClass}>
                <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </li>
  );
}