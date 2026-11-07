import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ShieldAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AdminToolbar from "@/components/admin/AdminToolbar";
import BirthdaysThisMonth from "@/components/admin/BirthdaysThisMonth";
import EntryList from "@/components/admin/EntryList";
import FollowUpCards from "@/components/admin/FollowUpCards";
import StatCards from "@/components/admin/StatCards";
import { buildCsv, downloadCsv } from "@/lib/csv";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { exportFirstTimers, firstTimerStats, listFirstTimers } from "@/lib/server-fns";

export const Route = createFileRoute("/_authed/admin")({
  head: () => ({ meta: [{ title: "First timers · RCCG DYC" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = Route.useRouteContext();
  const isAdmin = user?.role === "admin";
  const [search, setSearch] = useState("");
  const [marital, setMarital] = useState("all");
  const [followUp, setFollowUp] = useState("all");
  const [exporting, setExporting] = useState(false);
  const debouncedSearch = useDebouncedValue(search);

  const list = useServerFn(listFirstTimers);
  const loadStats = useServerFn(firstTimerStats);
  const exportRows = useServerFn(exportFirstTimers);

  const filters = {
    search: debouncedSearch,
    marital_status: marital === "all" ? "" : marital,
    follow_up_status: followUp === "all" ? "" : followUp,
  };
  const entries = useQuery({
    queryKey: ["first-timers", filters.search, filters.marital_status, filters.follow_up_status],
    queryFn: () => list({ data: { ...filters, limit: 200 } }),
    enabled: isAdmin,
    staleTime: 0,
  });
  const stats = useQuery({ queryKey: ["first-timer-stats"], queryFn: () => loadStats(), enabled: isAdmin, staleTime: 0 });

  const isFiltering =
    filters.search.trim().length > 0 || filters.marital_status !== "" || filters.follow_up_status !== "";

  async function handleExport() {
    setExporting(true);
    try {
      const rows = await exportRows({ data: filters });
      if (!rows?.length) {
        toast.info("Nothing to export yet.");
        return;
      }
      downloadCsv(`rccg-dyc-first-timers-${new Date().toISOString().slice(0, 10)}.csv`, buildCsv(rows));
      toast.success(`Exported ${rows.length} ${rows.length === 1 ? "entry" : "entries"}.`);
    } catch {
      toast.error("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  }

  if (!isAdmin) {
    return (
      <div className="card-soft mx-auto max-w-md p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <ShieldAlert className="h-6 w-6" />
        </span>
        <h1 className="mt-4 text-2xl font-semibold text-foreground">Admins only</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          This dashboard is reserved for church admins. Ask an admin to grant your account access.
        </p>
        <Link to="/welcome" className="mt-5 inline-block text-sm font-semibold text-primary hover:underline">
          Open the welcome form
        </Link>
      </div>
    );
  }

  const rows = entries.data?.items ?? [];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl text-foreground sm:text-3xl">First timers</h1>
          <p className="mt-1 text-sm text-muted-foreground">Everyone who filled the welcome form.</p>
        </div>
        <Link to="/qr" className="text-sm font-semibold text-primary hover:underline">
          Share the form link
        </Link>
      </div>

      <StatCards stats={stats.data} loading={stats.isLoading} />

      <FollowUpCards stats={stats.data} loading={stats.isLoading} onShowNew={() => setFollowUp("new")} />

      <BirthdaysThisMonth />

      <div className="card-soft overflow-hidden">
        <div className="border-b border-border/70 p-4">
          <AdminToolbar
            search={search}
            onSearch={setSearch}
            marital={marital}
            onMarital={setMarital}
            followUp={followUp}
            onFollowUp={setFollowUp}
            onExport={handleExport}
            exporting={exporting}
            total={stats.data?.total ?? 0}
          />
        </div>

        {entries.isError ? (
          <p className="px-5 py-12 text-center text-sm text-muted-foreground">
            We couldn&rsquo;t load entries. Please refresh the page.
          </p>
        ) : (
          <EntryList
            entries={rows}
            loading={entries.isLoading}
            emptyMessage={
              isFiltering
                ? { title: "No matches", hint: "Try a different name, phone number or filter." }
                : { title: "No first timers yet", hint: "Share the QR code so visitors can check in." }
            }
          />
        )}

        {entries.data?.has_more ? (
          <p className="border-t border-border/70 px-5 py-3 text-center text-xs text-muted-foreground">
            Showing the 200 most recent entries — narrow your search to see older ones, or export everything.
          </p>
        ) : null}
      </div>
    </div>
  );
}