import { Link, createFileRoute } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { ChurchMark } from "@/components/ChurchMark";
import WelcomeForm from "@/components/welcome/WelcomeForm";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Welcome to RCCG DYC" },
      { name: "description", content: "First time with us? Share a few details and let us stay in touch." },
    ],
  }),
  component: WelcomePage,
});

function WelcomePage() {
  return (
    <div className="paper-glow min-h-screen px-4 py-8 sm:py-14">
      <div className="mx-auto w-full max-w-xl animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="mb-6 flex flex-col items-center text-center">
          <ChurchMark className="h-14 w-14" />
          <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.22em] text-primary/80">RCCG DYC</p>
          <p className="text-sm text-muted-foreground">First Timer Connect</p>
        </div>

        <div className="card-soft p-6 sm:p-9">
          <h1 className="text-3xl leading-tight text-foreground sm:text-[2.1rem]">
            We&rsquo;re so glad
            <br className="hidden sm:block" /> you&rsquo;re here.
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Welcome to RCCG DYC! We&rsquo;re glad you&rsquo;re here. Please fill in your details so we can
            reach out and walk with you.
          </p>
          <div className="my-6 h-px w-full bg-border/70" />
          <WelcomeForm />
        </div>

        <p className="mx-auto mt-5 flex items-center justify-center gap-1.5 px-4 text-center text-xs text-muted-foreground">
          <Lock className="h-3.5 w-3.5" />
          Your details are private and only seen by our pastoral team.
        </p>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline">
            Church admin? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}