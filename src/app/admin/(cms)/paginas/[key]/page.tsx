import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageEditor } from "@/components/admin/forms/Editors";
import { PageHeader } from "@/components/admin/ui";
import { buttonClasses } from "@/components/ui/Button";
import { defaultPages } from "@/content/defaults";
import { requireAdmin } from "@/lib/admin/auth";
import { PAGE_LABELS } from "@/lib/admin/fields";
import type { PageKey } from "@/lib/types";

export const metadata: Metadata = { title: "Pagina bewerken" };

export default async function EditPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!(key in PAGE_LABELS)) notFound();
  const pageKey = key as PageKey;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("pages").select("content, seo_title, seo_description").eq("key", pageKey).maybeSingle();

  const defaults = defaultPages[pageKey];
  const content = { ...defaults.content, ...((data?.content as object) ?? {}) } as Record<string, unknown>;

  return (
    <>
      <PageHeader
        title={PAGE_LABELS[pageKey].title}
        description={PAGE_LABELS[pageKey].description}
        back={{ href: "/admin/paginas", label: "Pagina's" }}
        actions={
          <Link href={PAGE_LABELS[pageKey].path} target="_blank" className={buttonClasses("secondary", "sm")}>
            Bekijk pagina ↗
          </Link>
        }
      />
      <PageEditor
        pageKey={pageKey}
        content={content}
        seo={{ seoTitle: data?.seo_title ?? defaults.seoTitle, seoDescription: data?.seo_description ?? defaults.seoDescription }}
      />
    </>
  );
}
