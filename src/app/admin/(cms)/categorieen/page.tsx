import type { Metadata } from "next";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Categorieën" };

export default async function CategoriesPage() {
  const { supabase } = await requireAdmin();
  const [{ data: cats }, { data: projects }] = await Promise.all([
    supabase.from("categories").select("id, name, slug, description, sort_order").order("sort_order"),
    supabase.from("projects").select("category_id"),
  ]);
  const counts = new Map<string, number>();
  projects?.forEach((p) => p.category_id && counts.set(p.category_id, (counts.get(p.category_id) ?? 0) + 1));

  return (
    <>
      <PageHeader title="Categorieën" description="Categorieën worden gebruikt als filter op de projectenpagina." />
      <CategoryManager
        categories={(cats ?? []).map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description ?? "",
          sortOrder: c.sort_order,
          count: counts.get(c.id) ?? 0,
        }))}
      />
    </>
  );
}
