"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/env";
import { createPublicSupabase } from "@/lib/supabase/server";

export interface ContactState {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<"name" | "email" | "subject" | "message", string>>;
  values?: { name: string; email: string; subject: string; message: string };
}

const schema = z.object({
  name: z.string().trim().min(2, "Vul je naam in.").max(120, "Je naam is te lang."),
  email: z.string().trim().email("Vul een geldig e-mailadres in.").max(200),
  subject: z.string().trim().max(160, "Het onderwerp is te lang.").optional().default(""),
  message: z.string().trim().min(10, "Je bericht is wat kort — vertel me iets meer.").max(5000, "Je bericht is te lang (max. 5000 tekens)."),
});

// Lightweight in-memory rate limit (per server instance): 5 messages / 10 min per IP.
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > LIMIT;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

async function sendNotification(data: z.infer<typeof schema>) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "Website <onboarding@resend.dev>",
      to: [to],
      reply_to: data.email,
      subject: `Nieuw bericht via carmendegroot.nl${data.subject ? ` — ${data.subject}` : ""}`,
      html: `<p><strong>Van:</strong> ${escapeHtml(data.name)} &lt;${escapeHtml(data.email)}&gt;</p>
             ${data.subject ? `<p><strong>Onderwerp:</strong> ${escapeHtml(data.subject)}</p>` : ""}
             <p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>`,
    }),
  });
  return res.ok;
}

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  // Spam protection: honeypot + minimum fill time
  if (formData.get("company")) return { status: "success" };
  const startedAt = Number(formData.get("startedAt") ?? 0);
  if (startedAt && Date.now() - startedAt < 2500) return { status: "success" };

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "unknown";
  if (rateLimited(ip)) {
    return { status: "error", message: "Je hebt al een aantal berichten verstuurd. Probeer het over een paar minuten opnieuw.", values };
  }

  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    const errors: ContactState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<ContactState["errors"]>;
      if (!errors[key]) errors[key] = issue.message;
    }
    return { status: "error", message: "Controleer de gemarkeerde velden.", errors, values };
  }

  let stored = false;
  if (isSupabaseConfigured) {
    const { error } = await createPublicSupabase().from("messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject || null,
      message: parsed.data.message,
    });
    if (error) console.error("[contact] insert failed:", error.message);
    else stored = true;
  }

  let mailed = false;
  try {
    mailed = await sendNotification(parsed.data);
  } catch (e) {
    console.error("[contact] notification failed:", e);
  }

  if (!stored && !mailed) {
    return {
      status: "error",
      message: "Er ging iets mis bij het versturen. Mail me gerust rechtstreeks — excuses voor het ongemak.",
      values,
    };
  }

  return { status: "success" };
}
