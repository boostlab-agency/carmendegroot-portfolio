import type { Metadata } from "next";
import Link from "next/link";
import { Card, PageHeader, StatusBadge } from "@/components/admin/ui";
import { buttonClasses } from "@/components/ui/Button";
import { Plus } from "@/components/ui/icons";
import { requireAdmin } from "@/lib/admin/auth";
import { PAGE_LABELS } from "@/lib/admin/fields";
import type { PageKey } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const { supabase, profile } = await requireAdmin();

  const count = (table: string, filter?: [string, string | boolean]) => {
    let q = supabase.from(table).select("id", { count: "exact", head: true });
    if (filter) q = q.eq(filter[0], filter[1]);
    return q.then((r) => r.count ?? 0);
  };

  const [total, published, drafts, categories, media, unread, recentProjects, recentPages, recentMessages] = await Promise.all([
    count("projects"),
    count("projects", ["status", "published"]),
    count("projects", ["status", "draft"]),
    count("categories"),
    count("media"),
    count("messages", ["is_read", false]),
    supabase.from("projects").select("id, title, status, updated_at").order("updated_at", { ascending: false }).limit(6),
    supabase.from("pages").select("key, title, updated_at").order("updated_at", { ascending: false }).limit(4),
    supabase.from("messages").select("id, name, subject, created_at, is_read").order("created_at", { ascending: false }).limit(4),
  ]);

  const stats = [
    { label: "Projecten", value: total, href: "/admin/projecten" },
    { label: "Gepubliceerd", value: published, href: "/admin/projecten?status=published" },
    { label: "Concepten", value: drafts, href: "/admin/projecten?status=draft" },
    { label: "Categorieën", value: categories, href: "/admin/categorieen" },
    { label: "Mediabestanden", value: media, href: "/admin/media" },
    { label: "Ongelezen berichten", value: unread, href: "/admin/berichten", highlight: unread > 0 },
  ];

  const hour = Number(new Intl.DateTimeFormat("nl-NL", { hour: "numeric", timeZone: "Europe/Amsterdam" }).format(new Date()));
  const greeting = hour < 12 ? "Goedemorgen" : hour < 18 ? "Goedemiddag" : "Goedenavond";
  const firstName = (profile.full_name || "").split(" ")[0];

  return (
    <>
      <PageHeader
        title={`${greeting}${firstName ? `, ${firstName}` : ""}`}
        description="Een overzicht van je website."
        actions={
          <Link href="/admin/projecten/nieuw" className={buttonClasses("primary", "sm")}>
            <Plus size={16} /> Nieuw project
          </Link>
        }
      />

      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <li key={s.label}>
            <Link
              href={s.href}
              className={`block rounded-2xl border p-5 transition-colors hover:border-ink ${s.highlight ? "border-ink bg-accent" : "border-line bg-surface"}`}
            >
              <span className="block text-3xl font-medium tabular-nums tracking-[-0.03em]">{s.value}</span>
              <span className={`mt-1 block text-sm ${s.highlight ? "text-ink" : "text-stone"}`}>{s.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card
          title="Laatst gewijzigde projecten"
          className="lg:col-span-2"
          actions={
            <Link href="/admin/projecten" className="text-sm text-stone hover:text-ink">
              Alles →
            </Link>
          }
        >
          {recentProjects.data?.length ? (
            <ul className="-my-3 divide-y divide-line">
              {recentProjects.data.map((p) => (
                <li key={p.id}>
                  <Link href={`/admin/projecten/${p.id}`} className="flex items-center justify-between gap-4 py-3 hover:text-stone">
                    <span className="truncate font-medium">{p.title}</span>
                    <span className="flex shrink-0 items-center gap-4">
                      <span className="hidden text-sm text-stone sm:inline">{formatDateTime(p.updated_at)}</span>
                      <StatusBadge status={p.status} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-stone">Nog geen projecten.</p>
          )}
        </Card>

        <Card title="Laatste berichten" actions={<Link href="/admin/berichten" className="text-sm text-stone hover:text-ink">Alles →</Link>}>
          {recentMessages.data?.length ? (
            <ul className="-my-3 divide-y divide-line">
              {recentMessages.data.map((m) => (
                <li key={m.id} className="py-3">
                  <Link href="/admin/berichten" className="block hover:text-stone">
                    <span className="flex items-center gap-2 font-medium">
                      {!m.is_read && <span className="h-2 w-2 rounded-full bg-accent ring-1 ring-ink/30" aria-label="Ongelezen" />}
                      {m.name}
                    </span>
                    <span className="block truncate text-sm text-stone">{m.subject || "Geen onderwerp"} · {formatDateTime(m.created_at)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-stone">Nog geen berichten.</p>
          )}
        </Card>

        <Card title="Pagina's" className="lg:col-span-3" actions={<Link href="/admin/paginas" className="text-sm text-stone hover:text-ink">Beheren →</Link>}>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {(Object.keys(PAGE_LABELS) as PageKey[]).map((key) => {
              const record = recentPages.data?.find((p) => p.key === key);
              return (
                <li key={key}>
                  <Link href={`/admin/paginas/${key}`} className="block rounded-xl border border-line p-4 transition-colors hover:border-ink">
                    <span className="font-medium">{PAGE_LABELS[key].title}</span>
                    <span className="mt-1 block text-xs text-stone">
                      {record?.updated_at ? `Gewijzigd ${formatDateTime(record.updated_at)}` : "Standaardinhoud"}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </>
  );
}
