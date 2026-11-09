"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { deleteProject, reorderProjects, setProjectStatus } from "@/lib/admin/actions/projects";
import { formatDateTime, yearOf } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/ui";
import { useToast } from "@/components/admin/Toast";
import { useSortable } from "@/components/admin/useSortable";
import { buttonClasses } from "@/components/ui/Button";
import { GripVertical, Trash } from "@/components/ui/icons";

export interface ProjectRowLite {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  featured: boolean;
  date: string | null;
  updatedAt: string;
  cover: string | null;
  category: string | null;
}

export function ProjectTable({ rows: initialRows, sortable }: { rows: ProjectRowLite[]; sortable: boolean }) {
  const router = useRouter();
  const toast = useToast();
  const [rows, setRows] = useState(initialRows);
  const [orderChanged, setOrderChanged] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => setRows(initialRows), [initialRows]);

  const { itemProps } = useSortable(rows, (next) => {
    setRows(next);
    setOrderChanged(true);
  });

  const run = (fn: () => Promise<{ ok: boolean; message?: string; error?: string }>) =>
    startTransition(async () => {
      const res = await fn();
      if (res.ok) {
        toast(res.message ?? "Opgeslagen.");
        router.refresh();
      } else toast(res.error ?? "Er ging iets mis.", "error");
    });

  return (
    <div>
      {orderChanged && (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-ink bg-accent px-4 py-3 text-sm">
          <span>De volgorde is gewijzigd.</span>
          <button
            type="button"
            className={buttonClasses("primary", "sm")}
            disabled={pending}
            onClick={() =>
              run(async () => {
                const res = await reorderProjects(rows.map((r) => r.id));
                if (res.ok) setOrderChanged(false);
                return res;
              })
            }
          >
            Volgorde opslaan
          </button>
        </div>
      )}
      <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
        {rows.map((p, i) => (
          <li
            key={p.id}
            {...(sortable ? itemProps(i) : {})}
            className="flex items-center gap-4 px-4 py-3 transition-colors data-[dragging]:opacity-40 data-[over]:bg-accent/30"
          >
            {sortable && (
              <span className="cursor-grab text-stone active:cursor-grabbing" aria-hidden title="Sleep om te ordenen">
                <GripVertical size={18} />
              </span>
            )}
            {p.cover ? (
              <img src={p.cover} alt="" className="h-12 w-16 shrink-0 rounded-lg bg-paper-2 object-cover" />
            ) : (
              <span className="h-12 w-16 shrink-0 rounded-lg bg-paper-2" />
            )}
            <div className="min-w-0 flex-1">
              <Link href={`/admin/projecten/${p.id}`} className="block truncate font-medium hover:underline">
                {p.title}
                {p.featured && <span className="ml-2 rounded bg-accent px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide">Uitgelicht</span>}
              </Link>
              <p className="truncate text-xs text-stone">
                {[p.category, p.date && yearOf(p.date), `gewijzigd ${formatDateTime(p.updatedAt)}`].filter(Boolean).join(" · ")}
              </p>
            </div>
            <StatusBadge status={p.status} />
            <div className="hidden items-center gap-1 sm:flex">
              <button
                type="button"
                disabled={pending}
                onClick={() => run(() => setProjectStatus(p.id, p.status === "published" ? "draft" : "published"))}
                className={buttonClasses("ghost", "sm")}
              >
                {p.status === "published" ? "Depubliceren" : "Publiceren"}
              </button>
              <Link href={`/admin/projecten/${p.id}`} className={buttonClasses("secondary", "sm")}>
                Bewerken
              </Link>
              <button
                type="button"
                disabled={pending}
                aria-label={`${p.title} verwijderen`}
                onClick={() => {
                  if (confirm(`“${p.title}” definitief verwijderen?`)) run(() => deleteProject(p.id));
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full text-stone hover:bg-danger/10 hover:text-danger"
              >
                <Trash size={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>
      {sortable && <p className="mt-3 text-xs text-stone">Tip: sleep projecten om de volgorde op de website te bepalen.</p>}
    </div>
  );
}
