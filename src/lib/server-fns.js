import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireUser } from "@/lib/auth-middleware";
import { MARITAL_STATUSES } from "@/lib/firstTimerOptions";
import { PRAYER_MAX_CHARS, SEX_OPTIONS } from "@/lib/formRules";
import { createAnonClient } from "@/lib/supabase.server";

export const getServerInfo = createServerFn({ method: "GET" }).handler(async () => ({
  renderedAt: new Date().toISOString(),
}));

// Public: a first-timer submits the welcome form (no account needed).
const SubmissionInput = z.object({
  full_name: z.string().trim().min(2).max(120),
  phone: z.string().trim().regex(/^\+?\d{7,15}$/, "Enter a valid phone number"),
  email: z.string().trim().max(254).email("Enter a valid email address").or(z.literal("")).optional().default(""),
  sex: z.enum(SEX_OPTIONS),
  address: z.string().trim().max(300).optional().default(""),
  occupation: z.string().trim().max(120).optional().default(""),
  marital_status: z.enum(MARITAL_STATUSES).optional().nullable(),
  birth_month: z.number().int().min(1).max(12).optional().nullable(),
  birth_day: z.number().int().min(1).max(31).optional().nullable(),
  prayer_request: z.string().trim().max(PRAYER_MAX_CHARS).optional().default(""),
});

export const submitFirstTimer = createServerFn({ method: "POST" })
  .validator(SubmissionInput)
  .handler(async ({ data }) => {
    // Anonymous visitors may insert but not read, so the id is generated here.
    const id = crypto.randomUUID();
    const hasBirthday = data.birth_month && data.birth_day;
    const { error } = await createAnonClient()
      .from("first_timers")
      .insert({
        id,
        full_name: data.full_name,
        phone: data.phone,
        email: data.email || null,
        sex: data.sex,
        address: data.address || null,
        occupation: data.occupation || null,
        marital_status: data.marital_status || null,
        birth_month: hasBirthday ? data.birth_month : null,
        birth_day: hasBirthday ? data.birth_day : null,
        prayer_request: data.prayer_request || null,
        submitted_at: new Date().toISOString(),
      });
    if (error) throw new Error("Could not save your details.");
    return { id };
  });

// Admin only: reviewing, searching, exporting.
const assertAdmin = (user) => {
  if (!user || user.role !== "admin") {
    throw Object.assign(new Error("This area is for church admins only."), { status: 403 });
  }
};

const applyFilters = (query, { search, marital_status }) => {
  let q = query;
  if (marital_status && marital_status !== "all") q = q.eq("marital_status", marital_status);
  const term = (search || "").replace(/[%_,()*"\\]/g, " ").trim();
  if (term) {
    const pattern = `%${term}%`;
    q = q.or(`full_name.ilike.${pattern},phone.ilike.${pattern},occupation.ilike.${pattern}`);
  }
  return q;
};

const FilterInput = z.object({
  search: z.string().max(80).optional().default(""),
  marital_status: z.string().max(40).optional().default(""),
});

export const listFirstTimers = createServerFn({ method: "GET" })
  .middleware([requireUser])
  .validator(FilterInput.extend({ limit: z.number().int().min(1).max(500).optional().default(200) }))
  .handler(async ({ data, context }) => {
    assertAdmin(context.user);
    const { data: rows, error } = await applyFilters(
      context.supabase.from("first_timers").select("*"),
      data,
    )
      .order("submitted_at", { ascending: false })
      .limit(data.limit + 1);
    if (error) throw new Error("Could not load entries.");
    return { items: rows.slice(0, data.limit), has_more: rows.length > data.limit };
  });

export const exportFirstTimers = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(FilterInput)
  .handler(async ({ data, context }) => {
    assertAdmin(context.user);
    const PAGE = 1000;
    const rows = [];
    for (let page = 0; page < 10; page += 1) {
      const { data: chunk, error } = await applyFilters(
        context.supabase.from("first_timers").select("*"),
        data,
      )
        .order("submitted_at", { ascending: false })
        .range(page * PAGE, page * PAGE + PAGE - 1);
      if (error) throw new Error("Could not export entries.");
      rows.push(...chunk);
      if (chunk.length < PAGE) break;
    }
    return rows;
  });

export const firstTimerStats = createServerFn({ method: "GET" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    assertAdmin(context.user);
    // Church local day (Africa/Lagos, UTC+1) rather than the server's UTC day.
    const OFFSET = 60 * 60 * 1000;
    const shifted = new Date(Date.now() + OFFSET);
    const startOfToday = new Date(
      Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate()) - OFFSET,
    );
    const weekAgo = new Date(startOfToday.getTime() - 6 * 24 * 60 * 60 * 1000);

    const count = async (since) => {
      let q = context.supabase.from("first_timers").select("id", { count: "exact", head: true });
      if (since) q = q.gte("submitted_at", since.toISOString());
      const { count: n, error } = await q;
      if (error) throw new Error("Could not load stats.");
      return n ?? 0;
    };

    const [total, today, week] = await Promise.all([count(null), count(startOfToday), count(weekAgo)]);
    return { total, today, week };
  });