import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/forms/ProjectForm";
import { PageHeader, StatusBadge } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { mapCategory, type CategoryRow, type ProjectImageRow } from "@/lib/mappers";

export const metadata: Metadata = { title: "Project bewerken" };

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { supabase } = await requireAdmin();

  const [{ data: p }, { data: cats }] = await Promise.all([
    supabase.from("projects").select("*, images:project_images(*)").eq("id", id).maybeSingle(),
    supabase.from("categories").select("*").order("sort_order"),
  ]);
  if (!p) notFound();

  const images = ((p.images ?? []) as ProjectImageRow[]).sort((a, b) => a.sort_order - b.sort_order);

  return (
    <>
      <PageHeader title={p.title} back={{ href: "/admin/projecten", label: "Projecten" }} actions={<StatusBadge status={p.status} />} />
      <ProjectForm
        categories={((cats ?? []) as CategoryRow[]).map(mapCategory)}
        initial={{
          id: p.id,
          title: p.title ?? "",
          slug: p.slug ?? "",
          description: p.description ?? "",
          intro: p.intro ?? "",
          body: p.body ?? "",
          challenge: p.challenge ?? "",
          approach: p.approach ?? "",
          result: p.result ?? "",
          coverImageUrl: p.cover_image_url ?? "",
          coverImagePath: p.cover_image_path ?? null,
          coverAlt: p.cover_alt ?? "",
          tags: p.tags ?? [],
          date: p.project_date ?? "",
          categoryId: p.category_id ?? null,
          client: p.client ?? "",
          role: p.role ?? "",
          duration: p.duration ?? "",
          team: p.team ?? "",
          seoTitle: p.seo_title ?? "",
          seoDescription: p.seo_description ?? "",
          status: p.status,
          featured: p.featured,
          sortOrder: p.sort_order ?? 0,
          images: images.map((img) => ({ url: img.url, path: img.path, alt: img.alt ?? "", caption: img.caption ?? "" })),
        }}
      />
    </>
  );
}
