import { Loader2, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MARITAL_STATUSES } from "@/lib/firstTimerOptions";
import { FOLLOW_UP_STATUSES } from "@/lib/followUp";

export default function AdminToolbar({
  search,
  onSearch,
  marital,
  onMarital,
  followUp,
  onFollowUp,
  onExport,
  exporting,
  total,
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search by name, phone or occupation"
            aria-label="Search first timers"
            className="h-11 rounded-full border-input bg-card pl-10 pr-9 text-[15px]"
          />
          {search ? (
            <button
              type="button"
              onClick={() => onSearch("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Select value={followUp} onValueChange={onFollowUp}>
            <SelectTrigger aria-label="Filter by follow-up status" className="h-11 w-full rounded-full border-input bg-card px-4 text-sm sm:w-[11.5rem]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="all">All follow-ups</SelectItem>
              {FOLLOW_UP_STATUSES.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={marital} onValueChange={onMarital}>
            <SelectTrigger aria-label="Filter by marital status" className="h-11 w-full rounded-full border-input bg-card px-4 text-sm sm:w-[11.5rem]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="all">All statuses</SelectItem>
              {MARITAL_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="button"
            onClick={onExport}
            disabled={exporting || !total}
            variant="outline"
            className="h-11 shrink-0 rounded-full px-5 text-sm font-semibold"
          >
            {exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Export CSV
          </Button>
        </div>
      </div>
    </div>
  );
}