import { Loader2, UserRoundPlus } from "lucide-react";
import EntryRow from "@/components/admin/EntryRow";

export default function EntryList({ entries, loading, emptyMessage }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading entries…
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center px-6 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <UserRoundPlus className="h-6 w-6" />
        </span>
        <p className="mt-4 font-heading text-lg text-foreground">{emptyMessage.title}</p>
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">{emptyMessage.hint}</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border/70">
      {entries.map((entry) => (
        <EntryRow key={entry.id} entry={entry} />
      ))}
    </ul>
  );
}