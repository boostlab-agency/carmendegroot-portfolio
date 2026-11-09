import type { Metadata } from "next";
import { ProjectForm } from "@/components/admin/forms/ProjectForm";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { mapCategory, type CategoryRow } from "@/lib/mappers";

export const metadata: Metadata = { title: "Nieuw project" };

export default async function NewProjectPage() {
  const { supabase } = await requireAdmin();
  const [{ data: cats }, { data: last }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("projects").select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle(),
  ]);

  return (
    <>
      <PageHeader title="Nieuw project" back={{ href: "/admin/projecten", label: "Projecten" }} />
      <ProjectForm
        categories={((cats ?? []) as CategoryRow[]).map(mapCategory)}
        initial={{
          id: null,
          title: "",
          slug: "",
          description: "",
          intro: "",
          body: "",
          challenge: "",
          approach: "",
          result: "",
          coverImageUrl: "",
          coverImagePath: null,
          coverAlt: "",
          tags: [],
          date: new Date().toISOString().slice(0, 10),
          categoryId: null,
          client: "",
          role: "",
          duration: "",
          team: "",
          seoTitle: "",
          seoDescription: "",
          status: "draft",
          featured: false,
          sortOrder: ((last?.sort_order as number | undefined) ?? 0) + 1,
          images: [],
        }}
      />
    </>
  );
}
