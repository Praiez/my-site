import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Clock, Loader2, StickyNote } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FOLLOW_UP_STATUSES, NOTES_MAX_CHARS, OVERDUE_DAYS, daysSince } from "@/lib/followUp";
import { updateFollowUpNotes, updateFollowUpStatus } from "@/lib/server-fns";

const formatStamp = (value) =>
  new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Lagos",
  });

export default function FollowUpPanel({ entry }) {
  const queryClient = useQueryClient();
  const saveStatus = useServerFn(updateFollowUpStatus);
  const saveNotes = useServerFn(updateFollowUpNotes);

  const status = entry.follow_up_status || "new";
  const savedNotes = entry.follow_up_notes || "";
  const [notes, setNotes] = useState(savedNotes);
  const [showNotes, setShowNotes] = useState(false);
  const [statusBusy, setStatusBusy] = useState(false);
  const [notesBusy, setNotesBusy] = useState(false);

  useEffect(() => {
    setNotes(savedNotes);
  }, [savedNotes]);

  const waiting = status === "new" ? daysSince(entry.submitted_at) : 0;
  const overdue = waiting >= OVERDUE_DAYS;

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["first-timers"] });
    queryClient.invalidateQueries({ queryKey: ["first-timer-stats"] });
  };

  async function changeStatus(next) {
    if (next === status) return;
    setStatusBusy(true);
    try {
      await saveStatus({ data: { id: entry.id, follow_up_status: next } });
      refresh();
      toast.success("Status updated.");
    } catch {
      toast.error("Could not update the status. Please try again.");
    } finally {
      setStatusBusy(false);
    }
  }

  async function saveNote() {
    setNotesBusy(true);
    try {
      await saveNotes({ data: { id: entry.id, follow_up_notes: notes } });
      refresh();
      toast.success("Note saved.");
    } catch {
      toast.error("Could not save the note. Please try again.");
    } finally {
      setNotesBusy(false);
    }
  }

  return (
    <div className="mt-3 border-t border-border/70 pt-3">
      <div className="flex flex-wrap items-center gap-2">
        <Select value={status} onValueChange={changeStatus} disabled={statusBusy}>
          <SelectTrigger aria-label="Follow-up status" className="h-8 w-[10.5rem] rounded-full border-input bg-card px-3 text-xs font-semibold">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-2xl">
            {FOLLOW_UP_STATUSES.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <button
          type="button"
          onClick={() => setShowNotes((open) => !open)}
          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
        >
          <StickyNote className="h-3.5 w-3.5" />
          Notes
          {savedNotes ? <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-label="Has a note" /> : null}
        </button>

        {overdue ? (
          <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-[11px] font-semibold text-destructive">
            New for {waiting} days
          </span>
        ) : null}

        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
          <Clock className="h-3 w-3" />
          {entry.last_contacted_at ? `Last contacted ${formatStamp(entry.last_contacted_at)}` : "Not contacted yet"}
        </span>
      </div>

      {showNotes ? (
        <div className="mt-2.5 space-y-2">
          <Textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            maxLength={NOTES_MAX_CHARS}
            placeholder="e.g. Called Tuesday, will come on Sunday."
            aria-label="Follow-up notes"
            className="min-h-[5rem] rounded-2xl border-input bg-muted/40 px-3.5 py-2.5 text-sm"
          />
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-muted-foreground">
              {notes.length} / {NOTES_MAX_CHARS}
            </span>
            <Button
              type="button"
              size="sm"
              onClick={saveNote}
              disabled={notesBusy || notes.trim() === savedNotes.trim()}
              className="h-8 rounded-full px-4 text-xs font-semibold"
            >
              {notesBusy ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : null}
              Save note
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}