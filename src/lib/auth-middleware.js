import { createMiddleware } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import { createSupabaseServerClient } from "@/lib/supabase.server";

// Reads the session cookie and returns { user, supabase }, or null if signed out.
async function currentUser() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) return null;
  const u = data.user;
  return {
    supabase,
    user: {
      id: u.id,
      email: u.email,
      full_name: u.user_metadata?.full_name ?? null,
      role: u.app_metadata?.role ?? "user",
    },
  };
}

// Add to a server function that needs a signed-in caller. Rejects anonymous
// callers and sets `context.user` and `context.supabase`:
//   createServerFn().middleware([requireUser]).handler(({ context }) => context.user.id)
export const requireUser = createMiddleware({ type: "function" }).server(async ({ next }) => {
  const session = await currentUser();
  if (!session) {
    setResponseStatus(401);
    throw Object.assign(new Error("Unauthorized"), { status: 401, code: "UNAUTHORIZED" });
  }
  return next({ context: session });
});

// The same for a server route under src/routes/api/*:
//   server: { middleware: [requireUserRoute], handlers }
export const requireUserRoute = createMiddleware({ type: "request" }).server(async ({ next }) => {
  const session = await currentUser();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  return next({ context: session });
});