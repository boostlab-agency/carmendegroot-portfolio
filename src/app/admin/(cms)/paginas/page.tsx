import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/admin/ui";
import { ArrowRight } from "@/components/ui/icons";
import { requireAdmin } from "@/lib/admin/auth";
import { PAGE_LABELS } from "@/lib/admin/fields";
import type { PageKey } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Pagina's" };

export default async function PagesOverview() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("pages").select("key, updated_at");

  return (
    <>
      <PageHeader title="Pagina's" description="Pas de teksten van de vaste pagina's aan. Projecten beheer je onder Projecten." />
      <ul className="grid gap-4 md:grid-cols-2">
        {(Object.keys(PAGE_LABELS) as PageKey[]).map((key) => {
          const meta = PAGE_LABELS[key];
          const updated = data?.find((p) => p.key === key)?.updated_at;
          return (
            <li key={key}>
              <Link href={`/admin/paginas/${key}`} className="group flex h-full flex-col justify-between rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-ink">
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-medium tracking-[-0.02em]">{meta.title}</h2>
                    <ArrowRight size={18} className="text-stone transition-transform group-hover:translate-x-1 group-hover:text-ink" />
                  </div>
                  <p className="mt-1 text-sm text-stone">{meta.description}</p>
                </div>
                <p className="mt-6 text-xs text-stone">
                  <span className="font-mono">carmendegroot.nl{meta.path}</span>
                  {" · "}
                  {updated ? `gewijzigd ${formatDateTime(updated)}` : "standaardinhoud"}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
