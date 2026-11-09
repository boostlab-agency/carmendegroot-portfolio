"use client";

import { useEffect, useRef, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Check, Close } from "@/components/ui/icons";
import { buttonClasses } from "@/components/ui/Button";

export interface MediaRow {
  id: string;
  url: string;
  path: string;
  name: string;
  alt: string | null;
  mime_type: string | null;
}

/** Modal to pick one or more images from the media library. */
export function MediaPicker({
  open,
  onClose,
  onSelect,
  multiple = false,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (items: MediaRow[]) => void;
  multiple?: boolean;
}) {
  const [items, setItems] = useState<MediaRow[] | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      setSelected([]);
      createBrowserSupabase()
        .from("media")
        .select("id, url, path, name, alt, mime_type")
        .like("mime_type", "image/%")
        .order("sort_order")
        .order("created_at", { ascending: false })
        .then(({ data }: { data: unknown }) => setItems((data as MediaRow[] | null) ?? []));
    } else if (!open && d.open) d.close();
  }, [open]);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : multiple ? [...s, id] : [id]));

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="m-auto w-[min(96vw,960px)] rounded-2xl bg-surface p-0 text-ink shadow-2xl backdrop:bg-ink/40 backdrop:backdrop-blur-sm"
      aria-labelledby="media-picker-title"
    >
      <div className="flex items-center justify-between border-b border-line px-6 py-4">
        <h2 id="media-picker-title" className="font-medium">
          Kies uit mediabibliotheek
        </h2>
        <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-ink/5" aria-label="Sluiten">
          <Close size={18} />
        </button>
      </div>
      <div className="max-h-[60vh] overflow-y-auto p-6">
        {items === null ? (
          <p className="text-sm text-stone">Laden…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-stone">Nog geen afbeeldingen in de bibliotheek. Upload eerst via Media.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {items.map((m) => {
              const isSel = selected.includes(m.id);
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => toggle(m.id)}
                    aria-pressed={isSel}
                    className={cn("group relative block w-full overflow-hidden rounded-xl border-2 text-left", isSel ? "border-ink" : "border-transparent")}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.url} alt={m.alt ?? ""} className="aspect-[4/3] w-full bg-paper-2 object-cover" loading="lazy" />
                    <span className="block truncate px-2 py-1.5 text-xs text-stone">{m.name}</span>
                    {isSel && (
                      <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-paper">
                        <Check size={14} />
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className="flex justify-end gap-2 border-t border-line px-6 py-4">
        <button type="button" onClick={onClose} className={buttonClasses("ghost", "sm")}>
          Annuleren
        </button>
        <button
          type="button"
          disabled={!selected.length}
          onClick={() => {
            onSelect((items ?? []).filter((m) => selected.includes(m.id)));
            onClose();
          }}
          className={buttonClasses("primary", "sm")}
        >
          {multiple && selected.length > 1 ? `${selected.length} afbeeldingen toevoegen` : "Selecteren"}
        </button>
      </div>
    </dialog>
  );
}
