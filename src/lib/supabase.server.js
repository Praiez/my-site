import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { getRequest } from "@tanstack/react-start/server";

const URL = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const parseCookies = (header) =>
  (header || "")
    .split(";")
    .map((part) => {
      const i = part.indexOf("=");
      if (i < 0) return null;
      const name = part.slice(0, i).trim();
      const raw = part.slice(i + 1).trim();
      try {
        return { name, value: decodeURIComponent(raw) };
      } catch {
        return { name, value: raw };
      }
    })
    .filter(Boolean);

// Acts as the logged-in visitor (reads the session cookie), so row-level security applies.
export function createSupabaseServerClient() {
  const cookies = parseCookies(getRequest().headers.get("cookie"));
  return createServerClient(URL, KEY, {
    cookies: { getAll: () => cookies, setAll: () => {} },
  });
}

// Acts as an anonymous visitor (used for the public welcome form).
export const createAnonClient = () =>
  createClient(URL, KEY, { auth: { persistSession: false, autoRefreshToken: false } });