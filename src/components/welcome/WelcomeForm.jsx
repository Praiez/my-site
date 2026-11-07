import { Loader2, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import DayMonthPicker from "@/components/welcome/DayMonthPicker";
import Field from "@/components/welcome/Field";
import SuccessPanel from "@/components/welcome/SuccessPanel";
import { MARITAL_STATUSES } from "@/lib/firstTimerOptions";
import { EMAIL_PATTERN, PRAYER_MAX_CHARS, SEX_OPTIONS } from "@/lib/formRules";
import { submitFirstTimer } from "@/lib/server-fns";

const inputClass =
  "h-12 rounded-2xl border-input bg-muted/40 px-4 text-[15px] placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-0";

const textareaClass =
  "rounded-2xl border-input bg-muted/40 px-4 py-3 text-[15px] placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-0";

const emptyForm = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  occupation: "",
  marital: "",
  sex: "",
  birthday: null,
  prayer: "",
};

export default function WelcomeForm() {
  const submit = useServerFn(submitFirstTimer);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [firstName, setFirstName] = useState(null);
  const [today, setToday] = useState("");

  // The date is filled in automatically, after the page loads.
  useEffect(() => {
    setToday(
      new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    );
  }, []);

  const clearError = (key) => setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));

  const set = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
    clearError(key);
  };

  const prayerChars = form.prayer.length;
  const prayerNearLimit = prayerChars >= PRAYER_MAX_CHARS - 30;

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (form.fullName.trim().length < 2) nextErrors.fullName = "Please tell us your name.";
    if (form.phone.replace(/\D/g, "").length < 7) nextErrors.phone = "Enter a valid phone number.";
    if (form.email.trim() && !EMAIL_PATTERN.test(form.email.trim())) nextErrors.email = "Enter a valid email address.";
    if (!form.sex) nextErrors.sex = "Please choose one.";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setBusy(true);
    try {
      await submit({
        data: {
          full_name: form.fullName.trim(),
          phone: form.phone,
          email: form.email.trim(),
          sex: form.sex,
          address: form.address.trim(),
          occupation: form.occupation.trim(),
          marital_status: form.marital || null,
          birth_month: form.birthday?.month ?? null,
          birth_day: form.birthday?.day ?? null,
          prayer_request: form.prayer.trim(),
        },
      });
      setFirstName(form.fullName.trim().split(" ")[0]);
      setForm(emptyForm);
    } catch {
      toast.error("Something went wrong saving your details. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (firstName) return <SuccessPanel firstName={firstName} onAgain={() => setFirstName(null)} />;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-xs font-medium text-muted-foreground">Date: {today || "\u00A0"}</p>

      <Field label="Full name" htmlFor="full_name" error={errors.fullName}>
        <Input
          id="full_name"
          autoComplete="name"
          placeholder="e.g. Grace Adeyemi"
          value={form.fullName}
          onChange={set("fullName")}
          className={inputClass}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Phone number"
          htmlFor="phone"
          hint="Outside Nigeria? Start with + and your country code"
          error={errors.phone}
        >
          <Input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="08012345678"
            value={form.phone}
            onChange={(event) => {
              const raw = event.target.value;
              const plus = raw.trim().startsWith("+") ? "+" : "";
              const digits = raw.replace(/\D/g, "").slice(0, 15);
              setForm((prev) => ({ ...prev, phone: plus + digits }));
              clearError("phone");
            }}
            className={inputClass}
          />
        </Field>

        <Field label="Email address" htmlFor="email" hint="Optional" error={errors.email}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={set("email")}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Birthday" htmlFor="birthday" hint="Day and month">
          <DayMonthPicker
            id="birthday"
            value={form.birthday}
            onChange={(birthday) => setForm((prev) => ({ ...prev, birthday }))}
          />
        </Field>

        <Field label="Sex" htmlFor="sex" error={errors.sex}>
          <div id="sex" role="radiogroup" aria-label="Sex" className="grid grid-cols-2 gap-2">
            {SEX_OPTIONS.map((option) => {
              const selected = form.sex === option;
              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => {
                    setForm((prev) => ({ ...prev, sex: option }));
                    clearError("sex");
                  }}
                  className={
                    "h-12 rounded-2xl border px-4 text-[15px] font-medium transition-colors " +
                    (selected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-input bg-muted/40 text-foreground hover:bg-muted")
                  }
                >
                  {option}
                </button>
              );
            })}
          </div>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Marital status" htmlFor="marital_status">
          <Select value={form.marital} onValueChange={(marital) => setForm((prev) => ({ ...prev, marital }))}>
            <SelectTrigger id="marital_status" className="h-12 rounded-2xl border-input bg-muted/40 px-4 text-[15px]">
              <SelectValue placeholder="Select one" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              {MARITAL_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Occupation" htmlFor="occupation">
          <Input
            id="occupation"
            placeholder="e.g. Teacher"
            value={form.occupation}
            onChange={set("occupation")}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Address" htmlFor="address">
        <Textarea
          id="address"
          rows={2}
          placeholder="Where do you live?"
          value={form.address}
          onChange={set("address")}
          className={textareaClass + " min-h-[5rem]"}
        />
      </Field>

      <Field label={`Prayer request (maximum ${PRAYER_MAX_CHARS} characters)`} htmlFor="prayer_request">
        <Textarea
          id="prayer_request"
          rows={4}
          maxLength={PRAYER_MAX_CHARS}
          placeholder="Share what you would like us to pray about with you."
          value={form.prayer}
          onChange={set("prayer")}
          className={textareaClass + " min-h-[6.5rem]"}
        />
        <p
          className={
            "mt-1.5 text-right text-xs font-medium " + (prayerNearLimit ? "text-destructive" : "text-muted-foreground")
          }
        >
          {prayerChars} / {PRAYER_MAX_CHARS} characters
        </p>
      </Field>

      <Button
        type="submit"
        disabled={busy}
        className="mt-2 h-14 w-full rounded-full text-[15px] font-semibold shadow-lg shadow-primary/20 transition-transform active:scale-[0.99]"
      >
        {busy ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" /> Submit my details
          </>
        )}
      </Button>
    </form>
  );
}