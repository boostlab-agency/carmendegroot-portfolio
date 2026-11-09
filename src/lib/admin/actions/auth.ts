"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { SITE_URL } from "@/lib/env";
import { createServerSupabase } from "@/lib/supabase/server";
import { requireAdmin, type ActionResult } from "../auth";

export interface LoginState {
  error?: string;
  email?: string;
}

function safeNext(next: FormDataEntryValue | null) {
  const n = typeof next === "string" ? next : "";
  return n.startsWith("/admin") && !n.startsWith("//") ? n : "/admin";
}

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Vul je e-mailadres en wachtwoord in.", email };

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    // Generic message — never reveal whether the account exists
    return { error: "Deze combinatie van e-mailadres en wachtwoord is onjuist.", email };
  }
  redirect(safeNext(formData.get("next")));
}

export async function signOut() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

const passwordSchema = z
  .object({
    current: z.string().min(1, "Vul je huidige wachtwoord in."),
    password: z
      .string()
      .min(10, "Gebruik minimaal 10 tekens.")
      .regex(/[A-Za-z]/, "Gebruik minimaal één letter.")
      .regex(/[0-9]/, "Gebruik minimaal één cijfer."),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { message: "De wachtwoorden komen niet overeen.", path: ["confirm"] });

export async function changePassword(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const { supabase, user } = await requireAdmin();
  const parsed = passwordSchema.safeParse({
    current: formData.get("current"),
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  // Re-authenticate before changing the password
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: parsed.data.current,
  });
  if (authError) return { ok: false, error: "Je huidige wachtwoord is onjuist." };

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { ok: false, error: error.message };
  return { ok: true, message: "Je wachtwoord is gewijzigd." };
}

/** Sets a new password after following the reset link (session comes from /admin/auth/confirm). */
export async function setNewPassword(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const parsed = passwordSchema.safeParse({ current: "x", password, confirm });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { ok: false, error: error.message };
  return { ok: true, message: "Je nieuwe wachtwoord is opgeslagen." };
}

export async function requestPasswordReset(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  if (!z.string().email().safeParse(email).success) return { ok: false, error: "Vul een geldig e-mailadres in." };
  const h = await headers();
  const origin = h.get("origin") || SITE_URL;
  const supabase = await createServerSupabase();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/admin/auth/confirm?flow=recovery`,
  });
  // Always the same response — never reveal whether the account exists
  return { ok: true, message: "Als dit e-mailadres bekend is, ontvang je binnen enkele minuten een link." };
}
