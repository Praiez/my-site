import { Check, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SuccessPanel({ firstName, onAgain }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
        <Check className="h-7 w-7" strokeWidth={2.5} />
      </div>
      <h2 className="mt-5 text-2xl font-semibold text-foreground sm:text-3xl">
        Thank you{firstName ? `, ${firstName}` : ""}!
      </h2>
      <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
        We're so glad you worshipped with us. Someone from our team will reach out to say hello — you are
        loved and you are welcome here.
      </p>
      <div className="mt-7 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary/80">
        <Heart className="h-3.5 w-3.5" />
        RCCG DYC
      </div>
      <div className="mt-8">
        <Button variant="outline" onClick={onAgain} className="h-11 rounded-full px-6">
          Fill another form
        </Button>
      </div>
    </div>
  );
}