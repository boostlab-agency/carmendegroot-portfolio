"use client";

/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { deleteMedia, reorderMedia, updateMediaAlt } from "@/lib/admin/actions/content";
import { cn, formatDateTime } from "@/lib/utils";
import { useToast } from "@/components/admin/Toast";
import { IMAGE_TYPES, uploadFile } from "@/components/admin/upload";
import { useSortable } from "@/components/admin/useSortable";
import { buttonClasses } from "@/components/ui/Button";
import { Check, FileText, Trash, Upload } from "@/components/ui/icons";

export interface MediaItem {
  id: string;
  url: string;
  path: string;
  name: string;
  alt: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  width: number | null;
  height: number | null;
  created_at: string;
}

const formatSize = (b: number | null) => (!b ? "" : b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.round(b / 1024)} kB`);

export function MediaLibrary({ items: initial }: { items: MediaItem[] }) {
  const router = useRouter();
  const toast = useToast();
  const [items, setItems] = useState(initial);
  const [orderChanged, setOrderChanged] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [pending, startTransition] = useTransition();
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => setItems(initial), [initial]);

  const { itemProps } = useSortable(items, (next) => {
    setItems(next);
    setOrderChanged(true);
  });

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    const list = Array.from(files);
    let ok = 0;
    for (let i = 0; i < list.length; i++) {
      setUploading(`${i + 1}/${list.length}`);
      try {
        await uploadFile(list[i], "library", [...IMAGE_TYPES, "application/pdf"]);
        ok++;
      } catch (e) {
        toast(e instanceof Error ? e.message : "Upload mislukt.", "error");
      }
    }
    setUploading(null);
    if (ok) toast(`${ok} bestand${ok > 1 ? "en" : ""} geüpload.`);
    router.refresh();
  }

  function remove(item: MediaItem) {
    if (!confirm(`“${item.name}” definitief verwijderen?`)) return;
    startTransition(async () => {
      let res = await deleteMedia(item.id);
      if (!res.ok && res.error.includes("in gebruik")) {
        if (!confirm(`${res.error}\n\nToch verwijderen? De afbeelding verdwijnt dan ook van die plekken.`)) return;
        res = await deleteMedia(item.id, true);
      }
      if (!res.ok) return toast(res.error, "error");
      toast(res.message ?? "Verwijderd.");
      setSelected(null);
      router.refresh();
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div>
        <div
          onDragOver={(e) => {
            if (e.dataTransfer.types.includes("Files")) {
              e.preventDefault();
              setDragOver(true);
            }
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            if (!e.dataTransfer.files.length) return;
            e.preventDefault();
            setDragOver(false);
            upload(e.dataTransfer.files);
          }}
          className={cn(
            "mb-6 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors",
            dragOver ? "border-ink bg-accent/30" : "border-line bg-surface",
          )}
        >
          <Upload size={24} />
          <p className="text-sm text-stone">Sleep afbeeldingen of PDF&apos;s hierheen (max. 10 MB per bestand)</p>
          <button type="button" onClick={() => input.current?.click()} disabled={!!uploading} className={buttonClasses("primary", "sm")}>
            {uploading ? `Uploaden ${uploading}…` : "Bestanden kiezen"}
          </button>
          <input ref={input} type="file" multiple hidden accept="image/*,application/pdf" onChange={(e) => { upload(e.target.files); e.target.value = ""; }} />
        </div>

        {orderChanged && (
          <div className="mb-4 flex items-center justify-between rounded-xl border border-ink bg-accent px-4 py-3 text-sm">
            <span>De volgorde is gewijzigd.</span>
            <button
              type="button"
              disabled={pending}
              className={buttonClasses("primary", "sm")}
              onClick={() =>
                startTransition(async () => {
                  const res = await reorderMedia(items.map((i) => i.id));
                  if (!res.ok) return toast(res.error, "error");
                  setOrderChanged(false);
                  toast(res.message ?? "Opgeslagen.");
                })
              }
            >
              Volgorde opslaan
            </button>
          </div>
        )}

        {items.length === 0 ? (
          <p className="rounded-2xl border border-line bg-surface p-10 text-center text-sm text-stone">De mediabibliotheek is nog leeg.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {items.map((m, i) => (
              <li key={m.id} {...itemProps(i)} className="transition-opacity data-[dragging]:opacity-40 data-[over]:ring-2 data-[over]:ring-ink rounded-xl">
                <button
                  type="button"
                  onClick={() => setSelected(m)}
                  className={cn(
                    "group relative block w-full overflow-hidden rounded-xl border-2 bg-surface text-left",
                    selected?.id === m.id ? "border-ink" : "border-transparent",
                  )}
                >
                  {m.mime_type?.startsWith("image/") ? (
                    <img src={m.url} alt={m.alt ?? ""} loading="lazy" className="aspect-square w-full bg-paper-2 object-cover" />
                  ) : (
                    <span className="flex aspect-square w-full items-center justify-center bg-paper-2 text-stone">
                      <FileText size={32} />
                    </span>
                  )}
                  <span className="block truncate px-2.5 py-2 text-xs text-stone">{m.name}</span>
                  {!m.alt && m.mime_type?.startsWith("image/") && (
                    <span className="absolute left-2 top-2 rounded bg-clay px-1.5 py-0.5 text-[0.65rem] font-medium text-white">Geen alt</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
        {items.length > 1 && <p className="mt-3 text-xs text-stone">Tip: sleep tegels om de bibliotheek te ordenen.</p>}
      </div>

      <aside className="h-fit rounded-2xl border border-line bg-surface p-5 lg:sticky lg:top-8">
        {selected ? <MediaDetails key={selected.id} item={selected} pending={pending} onDelete={() => remove(selected)} /> : <p className="text-sm text-stone">Selecteer een bestand om details te bekijken.</p>}
      </aside>
    </div>
  );
}

function MediaDetails({ item, pending, onDelete }: { item: MediaItem; pending: boolean; onDelete: () => void }) {
  const toast = useToast();
  const [alt, setAlt] = useState(item.alt ?? "");
  const [copied, setCopied] = useState(false);
  const [saving, startTransition] = useTransition();

  return (
    <div className="space-y-4">
      {item.mime_type?.startsWith("image/") && <img src={item.url} alt="" className="w-full rounded-xl bg-paper-2" />}
      <dl className="space-y-1 text-sm">
        <div className="flex justify-between gap-4"><dt className="text-stone">Naam</dt><dd className="truncate">{item.name}</dd></div>
        {item.width && <div className="flex justify-between gap-4"><dt className="text-stone">Afmeting</dt><dd>{item.width} × {item.height}</dd></div>}
        <div className="flex justify-between gap-4"><dt className="text-stone">Grootte</dt><dd>{formatSize(item.size_bytes)}</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-stone">Geüpload</dt><dd>{formatDateTime(item.created_at)}</dd></div>
      </dl>
      {item.mime_type?.startsWith("image/") && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            startTransition(async () => {
              const res = await updateMediaAlt(item.id, alt);
              toast(res.ok ? res.message ?? "Opgeslagen." : res.error, res.ok ? "success" : "error");
            });
          }}
          className="space-y-2"
        >
          <label htmlFor="media-alt" className="field-label !mb-1">Alt-tekst</label>
          <textarea id="media-alt" rows={2} className="input !min-h-0 text-sm" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Beschrijf de afbeelding" />
          <button type="submit" disabled={saving} className={buttonClasses("secondary", "sm")}>Alt-tekst opslaan</button>
        </form>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          className={buttonClasses("secondary", "sm", "flex-1")}
          onClick={async () => {
            await navigator.clipboard.writeText(item.url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          {copied ? <><Check size={14} /> Gekopieerd</> : "Kopieer URL"}
        </button>
        <button type="button" disabled={pending} onClick={onDelete} className="flex h-9 items-center gap-1.5 rounded-full px-3 text-sm text-danger hover:bg-danger/10">
          <Trash size={15} /> Verwijderen
        </button>
      </div>
    </div>
  );
}
