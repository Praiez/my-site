import { createFileRoute } from "@tanstack/react-router";
import { Check, Copy, Printer } from "lucide-react";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authed/qr")({
  head: () => ({ meta: [{ title: "Form QR code · RCCG DYC" }] }),
  component: QrPage,
});

function QrPage() {
  const [formUrl, setFormUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setFormUrl(`${window.location.origin}/welcome`);
  }, []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(formUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="no-print">
        <h1 className="text-2xl text-foreground sm:text-3xl">Welcome form QR code</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Print it or show it on a screen — first timers scan it and fill the form on their phones.
        </p>
      </div>

      <div className="card-soft mx-auto max-w-md p-7 text-center sm:p-9">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary/80">RCCG DYC</p>
        <h2 className="mt-1 text-xl font-semibold text-foreground">Welcome home</h2>
        <p className="mt-1 text-sm text-muted-foreground">Scan to share your details with us</p>

        <div className="mx-auto mt-6 flex w-fit items-center justify-center rounded-3xl border border-border/70 bg-white p-4">
          {formUrl ? (
            <QRCodeSVG value={formUrl} size={208} level="M" fgColor="#4a2c34" bgColor="#ffffff" />
          ) : (
            <div className="h-52 w-52 animate-pulse rounded-2xl bg-muted" />
          )}
        </div>

        <p className="mt-5 break-all text-xs text-muted-foreground">{formUrl || "Preparing link…"}</p>

        <div className="no-print mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button type="button" onClick={copyLink} variant="outline" className="h-11 rounded-full px-5 text-sm font-semibold">
            {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            {copied ? "Link copied" : "Copy link"}
          </Button>
          <Button type="button" onClick={() => window.print()} className="h-11 rounded-full px-5 text-sm font-semibold">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <p className="no-print mx-auto max-w-md text-center text-xs text-muted-foreground">
        Tip: this link works on any phone — no app or account needed.
      </p>
    </div>
  );
}