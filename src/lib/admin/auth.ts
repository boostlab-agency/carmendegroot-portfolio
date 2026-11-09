import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { createServerSupabase } from "@/lib/supabase/server";

export interface AdminProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: "admin" | "editor" | "viewer";
}

/**
 * Server-side guard for every CMS page and action.
 * The middleware already redirects anonymous visitors; this additionally
 * verifies the JWT and checks the admin/editor role in the database.
 */
export const requireAdmin = cache(async () => {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .maybeSingle<AdminProfile>();

  if (!profile || (profile.role !== "admin" && profile.role !== "editor")) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=geen-toegang");
  }

  return { supabase, user, profile };
});

export type ActionResult<T = undefined> = { ok: true; message?: string; data?: T } | { ok: false; error: string };
