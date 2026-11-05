import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";

const toUser = (u) =>
  u
    ? {
        id: u.id,
        email: u.email,
        full_name: u.user_metadata?.full_name ?? null,
        role: u.app_metadata?.role ?? "user",
      }
    : null;

/**
 * The visitor, resolved once per page load and cached in the router's QueryClient.
 * Resolves to `{ user, error }`: an anonymous visitor is `{ user: null, error: null }`.
 * Anything else (an outage, no network) rejects instead, so it is never cached as "signed out".
 */
export const authQuery = queryOptions({
  queryKey: ["auth", "me"],
  queryFn: async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session) return { user: null, error: null };
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      if (error.name === "AuthSessionMissingError" || error.status === 401 || error.status === 403) {
        return { user: null, error: null };
      }
      throw error;
    }
    return { user: toUser(data?.user), error: null };
  },
  staleTime: Infinity,
  retry: false,
});

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const { data, error, isPending } = useQuery(authQuery);

  // Keep the cached visitor in step with sign-ins and sign-outs (including other tabs).
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        queryClient.setQueryData(authQuery.queryKey, { user: null, error: null });
      } else if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        queryClient.fetchQuery({ ...authQuery, staleTime: 0 }).catch(() => {});
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [queryClient]);

  const value = useMemo(
    () => ({
      user: data?.user ?? null,
      isAuthenticated: !!data?.user,
      isLoadingAuth: isPending,
      authError: data?.error ?? (error ? { type: "unknown", message: error.message ?? "Failed to load session" } : null),
      refresh: () => queryClient.fetchQuery({ ...authQuery, staleTime: 0 }),
      logout: async () => {
        queryClient.setQueryData(authQuery.queryKey, { user: null, error: null });
        await supabase.auth.signOut();
        window.location.assign(window.location.origin);
      },
      // Full-page navigation to the app's own /login route.
      navigateToLogin: () => window.location.assign("/login"),
    }),
    [data, error, isPending, queryClient],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}