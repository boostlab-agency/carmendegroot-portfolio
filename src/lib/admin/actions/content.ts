"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { defaultPages } from "@/content/defaults";
import { MEDIA_BUCKET } from "@/lib/env";
import type { PageKey } from "@/lib/types";
import { requireAdmin, type ActionResult } from "../auth";
import { pageSchemas, settingsSchema } from "../fields";
import { zodFromGroups } from "../validation";

const PAGE_KEYS = ["home", "about", "cv", "contact"] as const;

/* ── Pages ──────────────────────────────────────────────────────── */

export async function savePage(
  key: PageKey,
  content: Record<string, unknown>,
  seo: { seoTitle: string; seoDescription: string },
): Promise<ActionResult> {
  const { supabase, user } = await requireAdmin();
  if (!PAGE_KEYS.includes(key)) return { ok: false, error: "Onbekende pagina." };

  const parsed = zodFromGroups(pageSchemas[key]).safeParse(content);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, error: `${issue.path.join(" › ")}: ${issue.message}` };
  }
  const seoParsed = z
    .object({ seoTitle: z.string().max(120), seoDescription: z.string().max(320) })
    .safeParse(seo);
  if (!seoParsed.success) return { ok: false, error: "SEO velden zijn te lang." };

  const { error } = await supabase.from("pages").upsert({
    key,
    title: defaultPages[key].title,
    content: parsed.data,
    seo_title: seoParsed.data.seoTitle || null,
    seo_description: seoParsed.data.seoDescription || null,
    updated_by: user.id,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/", "layout");
  return { ok: true, message: "Pagina opgeslagen en live gezet." };
}

/* ── Settings ───────────────────────────────────────────────────── */

export async function saveSettings(data: Record<string, unknown>): Promise<ActionResult> {
  const { supabase, user } = await requireAdmin();
  const parsed = zodFromGroups(settingsSchema).safeParse(data);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, error: `${issue.path.join(" › ")}: ${issue.message}` };
  }
  const { error } = await supabase.from("site_settings").upsert({ id: 1, data: parsed.data, updated_by: user.id });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/", "layout");
  return { ok: true, message: "Instellingen opgeslagen." };
}

/* ── Media ──────────────────────────────────────────────────────── */

const mediaSchema = z.object({
  path: z.string().min(1).max(500),
  url: z.string().url().max(1000),
  name: z.string().max(255),
  mimeType: z.string().max(100),
  size: z.number().int().nonnegative(),
  width: z.number().int().nonnegative().nullable(),
  height: z.number().int().nonnegative().nullable(),
});

export async function registerMedia(payload: z.infer<typeof mediaSchema>): Promise<ActionResult<{ id: string }>> {
  const { supabase, user } = await requireAdmin();
  const parsed = mediaSchema.safeParse(payload);
  if (!parsed.success) return { ok: false, error: "Ongeldige mediagegevens." };
  const m = parsed.data;
  const { data, error } = await supabase
    .from("media")
    .insert({
      path: m.path,
      url: m.url,
      name: m.name,
      mime_type: m.mimeType,
      size_bytes: m.size,
      width: m.width,
      height: m.height,
      created_by: user.id,
      sort_order: 0,
    })
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/media");
  return { ok: true, data: { id: data.id } };
}

export async function updateMediaAlt(id: string, alt: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!z.string().uuid().safeParse(id).success || alt.length > 300) return { ok: false, error: "Ongeldige invoer." };
  const { error } = await supabase.from("media").update({ alt }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true, message: "Alt-tekst opgeslagen." };
}

export async function reorderMedia(ids: string[]): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!z.array(z.string().uuid()).max(2000).safeParse(ids).success) return { ok: false, error: "Ongeldige volgorde." };
  const results = await Promise.all(ids.map((id, i) => supabase.from("media").update({ sort_order: i + 1 }).eq("id", id)));
  const failed = results.find((r) => r.error);
  if (failed?.error) return { ok: false, error: failed.error.message };
  revalidatePath("/admin/media");
  return { ok: true, message: "Volgorde opgeslagen." };
}

export async function deleteMedia(id: string, force = false): Promise<ActionResult<{ usedBy?: string[] }>> {
  const { supabase } = await requireAdmin();
  if (!z.string().uuid().safeParse(id).success) return { ok: false, error: "Ongeldig bestand." };

  const { data: media, error } = await supabase.from("media").select("id, path, url").eq("id", id).single();
  if (error || !media) return { ok: false, error: "Bestand niet gevonden." };

  if (!force) {
    const [{ data: covers }, { data: gallery }, { data: settings }] = await Promise.all([
      supabase.from("projects").select("title").eq("cover_image_url", media.url),
      supabase.from("project_images").select("project:projects(title)").eq("url", media.url),
      supabase.from("site_settings").select("data").eq("id", 1).maybeSingle(),
    ]);
    const usedBy = new Set<string>();
    covers?.forEach((c) => usedBy.add(`Cover: ${c.title}`));
    (gallery as unknown as { project: { title: string } | null }[] | null)?.forEach(
      (g) => g.project && usedBy.add(`Galerij: ${g.project.title}`),
    );
    if (settings && JSON.stringify(settings.data).includes(media.url)) usedBy.add("Instellingen");
    if (usedBy.size) {
      return {
        ok: false,
        error: `Dit bestand is nog in gebruik (${[...usedBy].join(", ")}).`,
      };
    }
  }

  const { error: storageError } = await supabase.storage.from(MEDIA_BUCKET).remove([media.path]);
  if (storageError) return { ok: false, error: storageError.message };
  const { error: dbError } = await supabase.from("media").delete().eq("id", id);
  if (dbError) return { ok: false, error: dbError.message };
  revalidatePath("/admin/media");
  return { ok: true, message: "Bestand verwijderd." };
}

/* ── Messages ───────────────────────────────────────────────────── */

export async function setMessageRead(id: string, isRead: boolean): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!z.string().uuid().safeParse(id).success) return { ok: false, error: "Ongeldig bericht." };
  const { error } = await supabase.from("messages").update({ is_read: isRead }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!z.string().uuid().safeParse(id).success) return { ok: false, error: "Ongeldig bericht." };
  const { error } = await supabase.from("messages").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin", "layout");
  return { ok: true, message: "Bericht verwijderd." };
}
