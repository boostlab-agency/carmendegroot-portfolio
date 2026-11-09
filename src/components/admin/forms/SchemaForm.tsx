"use client";

/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import type { ActionResult } from "@/lib/admin/auth";
import type { Field, FieldGroup, ListField, ScalarField } from "@/lib/admin/fields";
import { cn } from "@/lib/utils";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { useToast } from "@/components/admin/Toast";
import { IMAGE_TYPES, uploadFile } from "@/components/admin/upload";
import { buttonClasses } from "@/components/ui/Button";
import { ChevronDown, ChevronUp, Plus, Trash, Upload } from "@/components/ui/icons";

type Values = Record<string, unknown>;

interface Props {
  groups: FieldGroup[];
  initial: Values;
  /** Optional extra values (e.g. SEO) rendered as a final group */
  extra?: { group: FieldGroup; initial: Values };
  onSave: (values: Values, extra: Values) => Promise<ActionResult>;
  submitLabel?: string;
}

/** Generic, schema-driven CMS editor for pages and settings. */
export function SchemaForm({ groups, initial, extra, onSave, submitLabel = "Opslaan" }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [values, setValues] = useState<Values>(initial);
  const [extraValues, setExtraValues] = useState<Values>(extra?.initial ?? {});
  const [dirty, setDirty] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const update = (name: string, value: unknown) => {
    setValues((v) => ({ ...v, [name]: value }));
    setDirty(true);
  };
  const updateExtra = (name: string, value: unknown) => {
    setExtraValues((v) => ({ ...v, [name]: value }));
    setDirty(true);
  };

  const allGroups = extra ? [...groups, extra.group] : groups;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const res = await onSave(values, extraValues);
          if (!res.ok) return toast(res.error, "error");
          setDirty(false);
          toast(res.message ?? "Opgeslagen.");
          router.refresh();
        });
      }}
      className="grid gap-6 lg:grid-cols-[200px_1fr]"
    >
      <nav aria-label="Secties" className="hidden lg:block">
        <ul className="sticky top-8 space-y-1 text-sm">
          {allGroups.map((g, i) => (
            <li key={g.title}>
              <a href={`#group-${i}`} className="block rounded-lg px-3 py-1.5 text-stone hover:bg-ink/5 hover:text-ink">
                {g.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="min-w-0 space-y-6">
        {allGroups.map((g, gi) => {
          const isExtra = extra && g === extra.group;
          const vals = isExtra ? extraValues : values;
          const set = isExtra ? updateExtra : update;
          return (
            <section key={g.title} id={`group-${gi}`} className="scroll-mt-8 rounded-2xl border border-line bg-surface">
              <header className="border-b border-line px-5 py-3.5">
                <h2 className="font-medium">{g.title}</h2>
                {g.description && <p className="text-xs text-stone">{g.description}</p>}
              </header>
              <div className="space-y-5 p-5">
                {g.fields.map((f) => (
                  <FieldInput key={f.name} field={f} value={vals[f.name]} onChange={(v) => set(f.name, v)} idPrefix={`g${gi}`} />
                ))}
              </div>
            </section>
          );
        })}

        <div className="sticky bottom-4 z-10 flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface/95 px-5 py-3 shadow-lg backdrop-blur">
          <span className={cn("text-sm", dirty ? "text-clay" : "text-stone")}>{dirty ? "Niet-opgeslagen wijzigingen" : "Alles is opgeslagen"}</span>
          <button type="submit" disabled={pending} className={buttonClasses("primary", "md")}>
            {pending ? "Opslaan…" : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}

/* ── Field renderers ──────────────────────────────────────────── */

function FieldInput({ field, value, onChange, idPrefix }: { field: Field; value: unknown; onChange: (v: unknown) => void; idPrefix: string }) {
  const id = `${idPrefix}-${field.name}`;
  if (field.type === "list") return <ListInput field={field} value={(value as Values[]) ?? []} onChange={onChange} id={id} />;
  return <ScalarInput field={field} value={value} onChange={onChange} id={id} />;
}

function Label({ field, id, length }: { field: ScalarField | ListField; id: string; length?: number }) {
  const max = "max" in field && field.type !== "number" ? field.max : undefined;
  return (
    <div className="flex items-baseline justify-between">
      <label htmlFor={id} className="field-label">
        {field.label}
      </label>
      {max && typeof length === "number" && (
        <span className={cn("text-xs tabular-nums", length > max ? "text-danger" : "text-stone")}>
          {length}/{max}
        </span>
      )}
    </div>
  );
}

function ScalarInput({ field, value, onChange, id }: { field: ScalarField; value: unknown; onChange: (v: unknown) => void; id: string }) {
  const str = typeof value === "string" ? value : value == null ? "" : String(value);
  const hint = field.hint && <span className="field-hint">{field.hint}</span>;

  switch (field.type) {
    case "text":
    case "url":
    case "email":
      return (
        <div>
          <Label field={field} id={id} length={str.length} />
          <input id={id} type={field.type === "text" ? "text" : field.type} className="input" value={str} onChange={(e) => onChange(e.target.value)} />
          {hint}
        </div>
      );
    case "textarea":
      return (
        <div>
          <Label field={field} id={id} length={str.length} />
          <textarea id={id} rows={field.rows ?? 4} className="input !min-h-0" value={str} onChange={(e) => onChange(e.target.value)} />
          {hint}
        </div>
      );
    case "markdown":
      return (
        <div>
          <Label field={field} id={id} length={str.length} />
          <textarea id={id} rows={16} className="input font-mono text-sm" value={str} onChange={(e) => onChange(e.target.value)} />
          {hint}
        </div>
      );
    case "number":
      return (
        <div>
          <Label field={field} id={id} />
          <input id={id} type="number" min={field.min} max={field.max} step={field.step ?? 1} className="input" value={str} onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))} />
          {hint}
        </div>
      );
    case "boolean":
      return (
        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-line px-4 py-3">
          <span className="text-sm font-medium">{field.label}</span>
          <input type="checkbox" className="h-5 w-5 accent-ink" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
        </label>
      );
    case "stringList":
      return (
        <div>
          <Label field={field} id={id} />
          <textarea
            id={id}
            rows={Math.min(12, Math.max(4, ((value as string[]) ?? []).length + 1))}
            className="input !min-h-0"
            value={((value as string[]) ?? []).join("\n")}
            onChange={(e) => onChange(e.target.value.split("\n").map((s) => s.trimStart()).filter((s, i, arr) => s || i === arr.length - 1))}
            onBlur={(e) => onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
          />
          {hint}
        </div>
      );
    case "image":
    case "file":
      return <AssetInput field={field} value={str} onChange={onChange} id={id} />;
  }
}

function AssetInput({ field, value, onChange, id }: { field: Extract<ScalarField, { type: "image" | "file" }>; value: string; onChange: (v: unknown) => void; id: string }) {
  const toast = useToast();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [picker, setPicker] = useState(false);
  const isImage = field.type === "image";

  return (
    <div>
      <Label field={field} id={id} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        {isImage && value ? <img src={value} alt="" className="h-28 w-24 shrink-0 rounded-xl bg-paper-2 object-cover" /> : null}
        <div className="min-w-0 flex-1 space-y-2">
          <input id={id} className="input font-mono text-xs" value={value} onChange={(e) => onChange(e.target.value)} placeholder={isImage ? "/images/… of https://…" : "/cv/… of https://…"} />
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={busy} onClick={() => input.current?.click()} className={buttonClasses("secondary", "sm")}>
              <Upload size={15} /> {busy ? "Uploaden…" : "Uploaden"}
            </button>
            {isImage && (
              <button type="button" onClick={() => setPicker(true)} className={buttonClasses("ghost", "sm")}>
                Uit media
              </button>
            )}
            {value && !isImage && (
              <a href={value} target="_blank" rel="noopener noreferrer" className={buttonClasses("ghost", "sm")}>
                Bekijken ↗
              </a>
            )}
          </div>
        </div>
      </div>
      <input
        ref={input}
        type="file"
        hidden
        accept={isImage ? "image/*" : field.accept}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          setBusy(true);
          try {
            const up = await uploadFile(file, isImage ? "site" : "documents", isImage ? IMAGE_TYPES : ["application/pdf"]);
            onChange(up.url);
            toast("Bestand geüpload. Vergeet niet op te slaan.");
          } catch (err) {
            toast(err instanceof Error ? err.message : "Upload mislukt.", "error");
          } finally {
            setBusy(false);
          }
        }}
      />
      {field.hint && <span className="field-hint">{field.hint}</span>}
      {isImage && <MediaPicker open={picker} onClose={() => setPicker(false)} onSelect={(items) => items[0] && onChange(items[0].url)} />}
    </div>
  );
}

function ListInput({ field, value, onChange, id }: { field: ListField; value: Values[]; onChange: (v: unknown) => void; id: string }) {
  const empty = () => Object.fromEntries(field.fields.map((f) => [f.name, f.type === "number" ? 0 : f.type === "boolean" ? false : f.type === "stringList" ? [] : ""]));
  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const [it] = next.splice(from, 1);
    next.splice(to, 0, it);
    onChange(next);
  };

  return (
    <fieldset>
      <legend className="field-label">{field.label}</legend>
      {field.hint && <span className="field-hint -mt-1 mb-2">{field.hint}</span>}
      <ol className="space-y-3">
        {value.map((item, i) => (
          <li key={i} className="rounded-xl border border-line bg-paper/50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-stone">
                {field.itemLabel} {i + 1}
              </span>
              <span className="flex gap-1">
                <SmallBtn label="Omhoog" disabled={i === 0} onClick={() => move(i, i - 1)}>
                  <ChevronUp size={15} />
                </SmallBtn>
                <SmallBtn label="Omlaag" disabled={i === value.length - 1} onClick={() => move(i, i + 1)}>
                  <ChevronDown size={15} />
                </SmallBtn>
                <SmallBtn label="Verwijderen" danger onClick={() => onChange(value.filter((_, x) => x !== i))}>
                  <Trash size={15} />
                </SmallBtn>
              </span>
            </div>
            <div className={cn("grid gap-4", field.fields.length > 1 && field.fields.every((f) => f.type !== "textarea") && "sm:grid-cols-2")}>
              {field.fields.map((sf) => (
                <ScalarInput
                  key={sf.name}
                  field={sf}
                  id={`${id}-${i}-${sf.name}`}
                  value={item[sf.name]}
                  onChange={(v) => onChange(value.map((it, x) => (x === i ? { ...it, [sf.name]: v } : it)))}
                />
              ))}
            </div>
          </li>
        ))}
      </ol>
      <button type="button" onClick={() => onChange([...value, empty()])} className={buttonClasses("secondary", "sm", "mt-3")}>
        <Plus size={15} /> {field.itemLabel} toevoegen
      </button>
    </fieldset>
  );
}

function SmallBtn({ label, onClick, disabled, danger, children }: { label: string; onClick: () => void; disabled?: boolean; danger?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn("flex h-7 w-7 items-center justify-center rounded-md text-stone disabled:opacity-30", danger ? "hover:bg-danger/10 hover:text-danger" : "hover:bg-ink/5 hover:text-ink")}
    >
      {children}
    </button>
  );
}
