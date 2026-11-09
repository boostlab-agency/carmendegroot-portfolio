import "server-only";
import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { cache } from "react";
import { createServerSupabase } from "@/lib/supabase/server";

export type AdminRole = "admin" | "editor" | "viewer";

export interface AdminProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: AdminRole;
}

const CMS_ROLES: ReadonlySet<string> = new Set(["admin", "editor"]);

export function hasCmsAccess(role: unknown): boolean {
  return typeof role === "string" && CMS_ROLES.has(role.trim().toLowerCase());
}

type ProfileLookup = { ok: true; profile: AdminProfile | null } | { ok: false; error: PostgrestError };

/** PostgREST/Postgres codes for "function does not exist" (fix-migration not applied yet). */
const MISSING_FUNCTION = new Set(["PGRST202", "42883"]);

/**
 * Reads the signed-in user's own profile.
 *
 * Primary path: the `get_my_profile()` RPC (SECURITY DEFINER, filtered on
 * auth.uid()). It works independently of table GRANTs and RLS on `profiles`.
 * Fallback: a direct table read, for databases where the fix migration
 * (20261110000000_fix_admin_access.sql) has not been applied yet.
 *
 * Errors are returned, never swallowed — a failing query must not be
 * mistaken for "this user is not an admin".
 */
export async function lookupOwnProfile(supabase: SupabaseClient, userId: string): Promise<ProfileLookup> {
  const rpc = await supabase.rpc("get_my_profile").maybeSingle<AdminProfile>();
  if (!rpc.error) return { ok: true, profile: rpc.data };
  if (!MISSING_FUNCTION.has(rpc.error.code)) return { ok: false, error: rpc.error };

  const table = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", userId)
    .maybeSingle<AdminProfile>();
  if (table.error) return { ok: false, error: table.error };
  return { ok: true, profile: table.data };
}

/**
 * Server-side guard for every CMS page and server action.
 * The middleware already redirects anonymous visitors; this additionally
 * verifies the JWT and checks the admin/editor role in the database.
 *
 * Note: no signOut() here — Server Components cannot write cookies, and a
 * transient database error must not revoke a valid session. The login page
 * offers an explicit "log out" button instead.
 */
export const requireAdmin = cache(async () => {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const lookup = await lookupOwnProfile(supabase, user.id);

  if (!lookup.ok) {
    console.error("[admin/auth] Rol-controle mislukt", {
      userId: user.id,
      code: lookup.error.code,
      message: lookup.error.message,
      hint: lookup.error.hint,
    });
    redirect("/admin/login?error=rechten-onbekend");
  }

  const profile = lookup.profile;
  if (!profile || !hasCmsAccess(profile.role)) {
    console.warn("[admin/auth] Geen CMS-toegang", { userId: user.id, role: profile?.role ?? "(geen profiel)" });
    redirect("/admin/login?error=geen-toegang");
  }

  return { supabase, user, profile };
});

export type ActionResult<T = undefined> = { ok: true; message?: string; data?: T } | { ok: false; error: string };
