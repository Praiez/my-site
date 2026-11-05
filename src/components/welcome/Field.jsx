import { Label } from "@/components/ui/label";

export default function Field({ label, htmlFor, hint, error, children }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </Label>
      {children}
      {error ? (
        <p className="text-xs font-medium text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}