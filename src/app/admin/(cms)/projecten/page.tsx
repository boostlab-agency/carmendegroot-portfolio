import type { Metadata } from "next";
import Link from "next/link";
import { ProjectTable } from "@/components/admin/ProjectTable";
import { EmptyState, PageHeader } from "@/components/admin/ui";
import { buttonClasses } from "@/components/ui/Button";
import { Plus } from "@/components/ui/icons";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Projecten" };

export default async function AdminProjectsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const { supabase } = await requireAdmin();

  let query = supabase
    .from("projects")
    .select("id, title, slug, status, featured, project_date, updated_at, cover_image_url, sort_order, category:categories(name)")
    .order("sort_order")
    .order("project_date", { ascending: false });
  if (status === "published" || status === "draft") query = query.eq("status", status);
  const { data, error } = await query;

  const rows = (data ?? []).map((p) => ({
    id: p.id as string,
    title: p.title as string,
    slug: p.slug as string,
    status: p.status as "draft" | "published",
    featured: p.featured as boolean,
    date: p.project_date as string | null,
    updatedAt: p.updated_at as string,
    cover: p.cover_image_url as string | null,
    category: (p.category as unknown as { name: string } | null)?.name ?? null,
  }));

  const tabs = [
    { label: "Alle", value: undefined },
    { label: "Gepubliceerd", value: "published" },
    { label: "Concepten", value: "draft" },
  ];

  return (
    <>
      <PageHeader
        title="Projecten"
        description="Maak, bewerk, publiceer en orden je projecten."
        actions={
          <Link href="/admin/projecten/nieuw" className={buttonClasses("primary", "sm")}>
            <Plus size={16} /> Nieuw project
          </Link>
        }
      />

      <nav aria-label="Filter op status" className="mb-6 flex gap-1.5">
        {tabs.map((t) => {
          const active = status === t.value || (!status && !t.value);
          return (
            <Link
              key={t.label}
              href={t.value ? `/admin/projecten?status=${t.value}` : "/admin/projecten"}
              aria-current={active ? "page" : undefined}
              className={`rounded-full px-4 py-1.5 text-sm transition-colors ${active ? "bg-ink text-paper" : "text-stone hover:bg-ink/5 hover:text-ink"}`}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>

      {error && <p className="mb-4 rounded-xl bg-danger/5 p-4 text-sm text-danger">Fout bij laden: {error.message}</p>}

      {rows.length ? (
        <ProjectTable rows={rows} sortable={!status} />
      ) : (
        <EmptyState
          title="Nog geen projecten"
          text="Voeg je eerste project toe en publiceer het wanneer je er klaar voor bent."
          action={
            <Link href="/admin/projecten/nieuw" className={buttonClasses("primary", "sm")}>
              <Plus size={16} /> Nieuw project
            </Link>
          }
        />
      )}
    </>
  );
}
