import { Link, createFileRoute } from "@tanstack/react-router";
import { Loader2, LogIn } from "lucide-react";
import { useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/login")({
  validateSearch: (search) => ({
    returnTo: typeof search.returnTo === "string" ? search.returnTo : undefined,
  }),
  head: () => ({ meta: [{ title: "Admin sign in · RCCG DYC" }] }),
  component: LoginPage,
});

// Only go back to a page on this same site, never to /login itself.
function safeDestination(returnTo) {
  try {
    const url = new URL(returnTo ?? "/", window.location.origin);
    if (url.origin !== window.location.origin || url.pathname.startsWith("/login")) return "/";
    return url.pathname + url.search + url.hash;
  } catch {
    return "/";
  }
}

function LoginPage() {
  const { returnTo } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (signInError) {
      setError("Incorrect email or password.");
      setBusy(false);
      return;
    }
    // Full page load so the session is read fresh everywhere.
    window.location.assign(safeDestination(returnTo));
  }

  return (
    <AuthLayout
      icon={LogIn}
      title="Admin sign in"
      subtitle="RCCG DYC first timers"
      footer={
        <Link to="/welcome" className="underline-offset-4 hover:text-primary hover:underline">
          Back to the welcome form
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 rounded-2xl"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 rounded-2xl"
          />
        </div>
        {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}
        <Button type="submit" disabled={busy} className="h-12 w-full rounded-full font-semibold">
          {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Sign in
        </Button>
      </form>
    </AuthLayout>
  );
}