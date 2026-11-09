"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteCategory, saveCategory } from "@/lib/admin/actions/projects";
import { slugify } from "@/lib/utils";
import { useToast } from "@/components/admin/Toast";
import { buttonClasses } from "@/components/ui/Button";
import { Plus, Trash } from "@/components/ui/icons";

interface Cat {
  id: string | null;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  count?: number;
}

export function CategoryManager({ categories }: { categories: Cat[] }) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<Cat | null>(null);

  const save = (c: Cat) =>
    startTransition(async () => {
      const res = await saveCategory({ id: c.id, name: c.name, slug: c.slug, description: c.description, sortOrder: c.sortOrder });
      if (!res.ok) return toast(res.error, "error");
      toast(res.message ?? "Opgeslagen.");
      setEditing(null);
      router.refresh();
    });

  const remove = (c: Cat) => {
    if (!c.id) return;
    const warn = c.count ? ` ${c.count} project(en) verliezen hun categorie.` : "";
    if (!confirm(`Categorie “${c.name}” verwijderen?${warn}`)) return;
    startTransition(async () => {
      const res = await deleteCategory(c.id!);
      if (!res.ok) return toast(res.error, "error");
      toast(res.message ?? "Verwijderd.");
      router.refresh();
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <ul className="h-fit divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
        {categories.length === 0 && <li className="p-6 text-sm text-stone">Nog geen categorieën.</li>}
        {categories.map((c) => (
          <li key={c.id} className="flex items-center gap-4 px-5 py-4">
            <span className="w-8 text-sm tabular-nums text-stone">{c.sortOrder}</span>
            <div className="min-w-0 flex-1">
              <p className="font-medium">{c.name}</p>
              <p className="truncate text-xs text-stone">
                /{c.slug} · {c.count ?? 0} project{c.count === 1 ? "" : "en"}
              </p>
            </div>
            <button type="button" onClick={() => setEditing(c)} className={buttonClasses("secondary", "sm")}>
              Bewerken
            </button>
            <button
              type="button"
              onClick={() => remove(c)}
              disabled={pending}
              aria-label={`${c.name} verwijderen`}
              className="flex h-9 w-9 items-center justify-center rounded-full text-stone hover:bg-danger/10 hover:text-danger"
            >
              <Trash size={16} />
            </button>
          </li>
        ))}
      </ul>

      <div className="h-fit rounded-2xl border border-line bg-surface p-5">
        {editing ? (
          <CategoryEditor key={editing.id ?? "new"} initial={editing} pending={pending} onCancel={() => setEditing(null)} onSave={save} />
        ) : (
          <div className="text-center">
            <p className="text-sm text-stone">Selecteer een categorie om te bewerken, of maak een nieuwe aan.</p>
            <button
              type="button"
              onClick={() => setEditing({ id: null, name: "", slug: "", description: "", sortOrder: categories.length + 1 })}
              className={buttonClasses("primary", "sm", "mt-4")}
            >
              <Plus size={16} /> Nieuwe categorie
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryEditor({ initial, pending, onCancel, onSave }: { initial: Cat; pending: boolean; onCancel: () => void; onSave: (c: Cat) => void }) {
  const [c, setC] = useState(initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.id));
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(c);
      }}
      className="space-y-4"
    >
      <h2 className="font-medium">{initial.id ? "Categorie bewerken" : "Nieuwe categorie"}</h2>
      <div>
        <label htmlFor="cat-name" className="field-label">Naam</label>
        <input
          id="cat-name"
          required
          className="input"
          value={c.name}
          onChange={(e) => setC({ ...c, name: e.target.value, slug: slugTouched ? c.slug : slugify(e.target.value) })}
        />
      </div>
      <div>
        <label htmlFor="cat-slug" className="field-label">Slug</label>
        <input
          id="cat-slug"
          required
          className="input font-mono text-sm"
          value={c.slug}
          onChange={(e) => {
            setSlugTouched(true);
            setC({ ...c, slug: slugify(e.target.value) });
          }}
        />
      </div>
      <div>
        <label htmlFor="cat-desc" className="field-label">Omschrijving</label>
        <textarea id="cat-desc" rows={2} className="input !min-h-0" value={c.description} onChange={(e) => setC({ ...c, description: e.target.value })} />
      </div>
      <div>
        <label htmlFor="cat-order" className="field-label">Volgorde</label>
        <input id="cat-order" type="number" min={0} className="input" value={c.sortOrder} onChange={(e) => setC({ ...c, sortOrder: Number(e.target.value) })} />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={pending} className={buttonClasses("primary", "sm")}>
          {pending ? "Opslaan…" : "Opslaan"}
        </button>
        <button type="button" onClick={onCancel} className={buttonClasses("ghost", "sm")}>
          Annuleren
        </button>
      </div>
    </form>
  );
}
