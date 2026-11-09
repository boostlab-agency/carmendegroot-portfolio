"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin, type ActionResult } from "../auth";

const urlish = z
  .string()
  .trim()
  .max(1000)
  .refine((v) => v === "" || v.startsWith("/") || /^https?:\/\//.test(v), "Ongeldige afbeeldings-URL");

const projectSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  title: z.string().trim().min(1, "Titel is verplicht.").max(200),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is verplicht.")
    .max(80)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug mag alleen kleine letters, cijfers en streepjes bevatten."),
  description: z.string().max(400, "Omschrijving: maximaal 400 tekens."),
  intro: z.string().max(3000),
  body: z.string().max(40000),
  challenge: z.string().max(4000),
  approach: z.string().max(4000),
  result: z.string().max(4000),
  coverImageUrl: urlish,
  coverImagePath: z.string().max(500).nullable(),
  coverAlt: z.string().max(300),
  tags: z.array(z.string().trim().min(1).max(40)).max(20),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Kies een geldige datum.").or(z.literal("")),
  categoryId: z.string().uuid().nullable().or(z.literal("")),
  client: z.string().max(160),
  role: z.string().max(160),
  duration: z.string().max(80),
  team: z.string().max(300),
  seoTitle: z.string().max(120, "SEO titel: maximaal 120 tekens."),
  seoDescription: z.string().max(320, "SEO beschrijving: maximaal 320 tekens."),
  status: z.enum(["draft", "published"]),
  featured: z.boolean(),
  sortOrder: z.coerce.number().int().min(0).max(9999),
  images: z
    .array(
      z.object({
        url: urlish.refine((v) => v !== "", "Afbeelding zonder URL"),
        path: z.string().max(500).nullable(),
        alt: z.string().max(300),
        caption: z.string().max(300),
      }),
    )
    .max(40),
});

export type ProjectPayload = z.infer<typeof projectSchema>;

function revalidatePublic() {
  revalidatePath("/", "layout");
}

export async function saveProject(payload: ProjectPayload): Promise<ActionResult<{ id: string; slug: string }>> {
  const { supabase, user } = await requireAdmin();
  const parsed = projectSchema.safeParse(payload);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const p = parsed.data;

  if (p.status === "published" && !p.description.trim()) {
    return { ok: false, error: "Voeg een korte omschrijving toe voordat je publiceert." };
  }

  const row = {
    title: p.title,
    slug: p.slug,
    description: p.description || null,
    intro: p.intro || null,
    body: p.body || null,
    challenge: p.challenge || null,
    approach: p.approach || null,
    result: p.result || null,
    cover_image_url: p.coverImageUrl || null,
    cover_image_path: p.coverImagePath,
    cover_alt: p.coverAlt || null,
    tags: p.tags,
    project_date: p.date || null,
    category_id: p.categoryId || null,
    client: p.client || null,
    role: p.role || null,
    duration: p.duration || null,
    team: p.team || null,
    seo_title: p.seoTitle || null,
    seo_description: p.seoDescription || null,
    status: p.status,
    featured: p.featured,
    sort_order: p.sortOrder,
    updated_by: user.id,
  };

  const query = p.id
    ? supabase.from("projects").update(row).eq("id", p.id).select("id, slug").single()
    : supabase.from("projects").insert({ ...row, created_by: user.id }).select("id, slug").single();

  const { data, error } = await query;
  if (error) {
    if (error.code === "23505") return { ok: false, error: "Deze slug is al in gebruik door een ander project." };
    return { ok: false, error: error.message };
  }

  // Replace gallery in the given order
  const { error: delError } = await supabase.from("project_images").delete().eq("project_id", data.id);
  if (delError) return { ok: false, error: delError.message };
  if (p.images.length) {
    const { error: imgError } = await supabase.from("project_images").insert(
      p.images.map((img, i) => ({
        project_id: data.id,
        url: img.url,
        path: img.path,
        alt: img.alt || null,
        caption: img.caption || null,
        sort_order: i,
      })),
    );
    if (imgError) return { ok: false, error: imgError.message };
  }

  revalidatePublic();
  return {
    ok: true,
    message: p.status === "published" ? "Project gepubliceerd." : "Concept opgeslagen.",
    data: { id: data.id, slug: data.slug },
  };
}

export async function deleteProject(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!z.string().uuid().safeParse(id).success) return { ok: false, error: "Ongeldig project." };
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePublic();
  return { ok: true, message: "Project verwijderd." };
}

export async function setProjectStatus(id: string, status: "draft" | "published"): Promise<ActionResult> {
  const { supabase, user } = await requireAdmin();
  if (!z.string().uuid().safeParse(id).success) return { ok: false, error: "Ongeldig project." };
  const { error } = await supabase.from("projects").update({ status, updated_by: user.id }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePublic();
  return { ok: true, message: status === "published" ? "Project gepubliceerd." : "Project teruggezet naar concept." };
}

export async function reorderProjects(ids: string[]): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!z.array(z.string().uuid()).max(500).safeParse(ids).success) return { ok: false, error: "Ongeldige volgorde." };
  const results = await Promise.all(
    ids.map((id, i) => supabase.from("projects").update({ sort_order: i + 1 }).eq("id", id)),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) return { ok: false, error: failed.error.message };
  revalidatePublic();
  return { ok: true, message: "Volgorde opgeslagen." };
}

/* ── Categories ─────────────────────────────────────────────────── */

const categorySchema = z.object({
  id: z.string().uuid().optional().nullable(),
  name: z.string().trim().min(1, "Naam is verplicht.").max(80),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug mag alleen kleine letters, cijfers en streepjes bevatten."),
  description: z.string().max(300),
  sortOrder: z.coerce.number().int().min(0).max(999),
});

export async function saveCategory(payload: z.infer<typeof categorySchema>): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const parsed = categorySchema.safeParse(payload);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const c = parsed.data;
  const row = { name: c.name, slug: c.slug, description: c.description || null, sort_order: c.sortOrder };
  const { error } = c.id
    ? await supabase.from("categories").update(row).eq("id", c.id)
    : await supabase.from("categories").insert(row);
  if (error) {
    if (error.code === "23505") return { ok: false, error: "Deze slug bestaat al." };
    return { ok: false, error: error.message };
  }
  revalidatePublic();
  revalidatePath("/admin/categorieen");
  return { ok: true, message: "Categorie opgeslagen." };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!z.string().uuid().safeParse(id).success) return { ok: false, error: "Ongeldige categorie." };
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePublic();
  revalidatePath("/admin/categorieen");
  return { ok: true, message: "Categorie verwijderd. Gekoppelde projecten hebben nu geen categorie." };
}
