"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { deleteProject, saveProject, type ProjectPayload } from "@/lib/admin/actions/projects";
import type { Category } from "@/lib/types";
import { cn, slugify } from "@/lib/utils";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { useToast } from "@/components/admin/Toast";
import { uploadFile } from "@/components/admin/upload";
import { useSortable } from "@/components/admin/useSortable";
import { buttonClasses } from "@/components/ui/Button";
import { ChevronDown, ChevronUp, Eye, GripVertical, ImageIcon, Trash, Upload } from "@/components/ui/icons";

type FormImage = ProjectPayload["images"][number] & { key: string };
type FormState = Omit<ProjectPayload, "images"> & { images: FormImage[] };

let keySeq = 0;
const nextKey = () => `img-${++keySeq}`;

export function ProjectForm({ initial, categories }: { initial: ProjectPayload; categories: Category[] }) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [state, setState] = useState<FormState>(() => ({
    ...initial,
    images: initial.images.map((i) => ({ ...i, key: nextKey() })),
  }));
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.id));
  const [dirty, setDirty] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [picker, setPicker] = useState<"cover" | "gallery" | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [bodyPreview, setBodyPreview] = useState(false);
  const galleryInput = useRef<HTMLInputElement>(null);
  const coverInput = useRef<HTMLInputElement>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setState((s) => ({ ...s, [key]: value }));
    setDirty(true);
  };

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const { itemProps, move } = useSortable(state.images, (images) => set("images", images));

  async function handleUpload(files: FileList | null, target: "cover" | "gallery") {
    if (!files?.length) return;
    try {
      const list = Array.from(files);
      for (let i = 0; i < list.length; i++) {
        setUploading(`${i + 1}/${list.length}`);
        const up = await uploadFile(list[i], "projects");
        if (target === "cover") {
          setState((s) => ({ ...s, coverImageUrl: up.url, coverImagePath: up.path, coverAlt: s.coverAlt || s.title }));
        } else {
          setState((s) => ({ ...s, images: [...s.images, { key: nextKey(), url: up.url, path: up.path, alt: "", caption: "" }] }));
        }
      }
      setDirty(true);
      toast(list.length > 1 ? `${list.length} afbeeldingen geüpload.` : "Afbeelding geüpload.");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Upload mislukt.", "error");
    } finally {
      setUploading(null);
    }
  }

  function addTag(raw: string) {
    const tags = raw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (!tags.length) return;
    set("tags", Array.from(new Set([...state.tags, ...tags])).slice(0, 20));
    setTagInput("");
  }

  function submit(status: "draft" | "published") {
    const payload: ProjectPayload = {
      ...state,
      status,
      images: state.images.map(({ url, path, alt, caption }) => ({ url, path, alt, caption })),
    };
    startTransition(async () => {
      const res = await saveProject(payload);
      if (!res.ok) {
        toast(res.error, "error");
        return;
      }
      setDirty(false);
      setState((s) => ({ ...s, status, id: res.data!.id }));
      toast(res.message ?? "Opgeslagen.");
      if (!initial.id) router.replace(`/admin/projecten/${res.data!.id}`);
      else router.refresh();
    });
  }

  function remove() {
    if (!state.id) return;
    if (!confirm(`Weet je zeker dat je “${state.title}” definitief wilt verwijderen?`)) return;
    startTransition(async () => {
      const res = await deleteProject(state.id!);
      if (!res.ok) return toast(res.error, "error");
      setDirty(false);
      toast(res.message ?? "Verwijderd.");
      router.replace("/admin/projecten");
    });
  }

  const seoTitle = state.seoTitle || state.title || "Projecttitel";
  const seoDesc = state.seoDescription || state.description || "Omschrijving van het project…";
  const isPublished = initial.status === "published" || state.status === "published";
  const publicUrl = useMemo(() => `/projecten/${state.slug}`, [state.slug]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit(state.status);
      }}
      className="grid gap-6 xl:grid-cols-[1fr_340px]"
    >
      {/* ── Main column ─────────────────────────────── */}
      <div className="min-w-0 space-y-6">
        <Section title="Basis">
          <Field label="Titel" htmlFor="title">
            <input
              id="title"
              required
              className="input text-lg font-medium"
              value={state.title}
              onChange={(e) => {
                const title = e.target.value;
                setState((s) => ({ ...s, title, slug: slugTouched ? s.slug : slugify(title) }));
                setDirty(true);
              }}
            />
          </Field>
          <Field label="Slug (URL)" htmlFor="slug" hint={`carmendegroot.nl/projecten/${state.slug || "…"}`}>
            <input
              id="slug"
              required
              className="input font-mono text-sm"
              value={state.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", slugify(e.target.value));
              }}
            />
          </Field>
          <Field label="Korte omschrijving" htmlFor="description" hint="Wordt getoond op projectkaarten en in zoekresultaten." counter={[state.description.length, 400]}>
            <textarea id="description" rows={2} className="input !min-h-0" value={state.description} onChange={(e) => set("description", e.target.value)} />
          </Field>
          <Field label="Introtekst" htmlFor="intro" hint="De openingsparagraaf op de projectpagina.">
            <textarea id="intro" rows={4} className="input" value={state.intro} onChange={(e) => set("intro", e.target.value)} />
          </Field>
        </Section>

        <Section title="Case study">
          <Field label="Uitdaging" htmlFor="challenge">
            <textarea id="challenge" rows={4} className="input" value={state.challenge} onChange={(e) => set("challenge", e.target.value)} />
          </Field>
          <Field label="Aanpak" htmlFor="approach">
            <textarea id="approach" rows={5} className="input" value={state.approach} onChange={(e) => set("approach", e.target.value)} />
          </Field>
          <Field label="Resultaat" htmlFor="result">
            <textarea id="result" rows={4} className="input" value={state.result} onChange={(e) => set("result", e.target.value)} />
          </Field>
        </Section>

        <Section
          title="Volledige projecttekst"
          description="Markdown: ## Kop, **vet**, *cursief*, - lijst, > citaat"
          actions={
            <button type="button" onClick={() => setBodyPreview((v) => !v)} className={buttonClasses("ghost", "sm")}>
              <Eye size={16} /> {bodyPreview ? "Bewerken" : "Voorbeeld"}
            </button>
          }
        >
          {bodyPreview ? (
            <MarkdownPreview text={state.body} />
          ) : (
            <textarea aria-label="Volledige projecttekst" rows={16} className="input font-mono text-sm" value={state.body} onChange={(e) => set("body", e.target.value)} />
          )}
        </Section>

        <Section
          title="Afbeeldingen"
          description="Sleep om de volgorde te wijzigen. De eerste afbeelding wordt breed getoond bij een oneven aantal."
          actions={
            <div className="flex gap-2">
              <button type="button" onClick={() => setPicker("gallery")} className={buttonClasses("secondary", "sm")}>
                <ImageIcon size={16} /> Uit media
              </button>
              <button type="button" onClick={() => galleryInput.current?.click()} className={buttonClasses("primary", "sm")} disabled={!!uploading}>
                <Upload size={16} /> {uploading ? `Uploaden ${uploading}` : "Uploaden"}
              </button>
              <input ref={galleryInput} type="file" accept="image/*" multiple hidden onChange={(e) => { handleUpload(e.target.files, "gallery"); e.target.value = ""; }} />
            </div>
          }
        >
          {state.images.length === 0 ? (
            <button
              type="button"
              onClick={() => galleryInput.current?.click()}
              className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-line py-12 text-sm text-stone transition-colors hover:border-ink hover:text-ink"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleUpload(e.dataTransfer.files, "gallery");
              }}
            >
              <Upload size={22} />
              <span className="mt-2">Sleep afbeeldingen hierheen of klik om te uploaden</span>
            </button>
          ) : (
            <ul className="space-y-3">
              {state.images.map((img, i) => (
                <li
                  key={img.key}
                  {...itemProps(i)}
                  className="flex gap-4 rounded-xl border border-line bg-paper/50 p-3 transition-[opacity,border-color] data-[dragging]:opacity-40 data-[over]:border-ink"
                >
                  <span className="flex cursor-grab items-center text-stone active:cursor-grabbing" aria-hidden>
                    <GripVertical size={18} />
                  </span>
                  <img src={img.url} alt="" className="h-20 w-28 shrink-0 rounded-lg bg-paper-2 object-cover" />
                  <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2">
                    <input
                      aria-label={`Alt-tekst afbeelding ${i + 1}`}
                      placeholder="Alt-tekst (beschrijving)"
                      className="input !py-2 text-sm"
                      value={img.alt}
                      onChange={(e) => set("images", state.images.map((x) => (x.key === img.key ? { ...x, alt: e.target.value } : x)))}
                    />
                    <input
                      aria-label={`Bijschrift afbeelding ${i + 1}`}
                      placeholder="Bijschrift (optioneel)"
                      className="input !py-2 text-sm"
                      value={img.caption}
                      onChange={(e) => set("images", state.images.map((x) => (x.key === img.key ? { ...x, caption: e.target.value } : x)))}
                    />
                  </div>
                  <div className="flex shrink-0 flex-col justify-center gap-1">
                    <IconBtn label="Omhoog" onClick={() => move(i, i - 1)} disabled={i === 0}><ChevronUp size={16} /></IconBtn>
                    <IconBtn label="Omlaag" onClick={() => move(i, i + 1)} disabled={i === state.images.length - 1}><ChevronDown size={16} /></IconBtn>
                  </div>
                  <div className="flex shrink-0 items-center">
                    <IconBtn label="Verwijderen uit project" onClick={() => set("images", state.images.filter((x) => x.key !== img.key))} danger>
                      <Trash size={16} />
                    </IconBtn>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Projectinformatie">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Opdrachtgever" htmlFor="client">
              <input id="client" className="input" value={state.client} onChange={(e) => set("client", e.target.value)} />
            </Field>
            <Field label="Rol" htmlFor="role">
              <input id="role" className="input" value={state.role} onChange={(e) => set("role", e.target.value)} />
            </Field>
            <Field label="Duur" htmlFor="duration">
              <input id="duration" className="input" value={state.duration} onChange={(e) => set("duration", e.target.value)} placeholder="bijv. 4 maanden" />
            </Field>
            <Field label="Team" htmlFor="team">
              <input id="team" className="input" value={state.team} onChange={(e) => set("team", e.target.value)} />
            </Field>
          </div>
        </Section>

        <Section title="SEO">
          <Field label="SEO titel" htmlFor="seoTitle" hint="Laat leeg om de projecttitel te gebruiken." counter={[state.seoTitle.length, 60]}>
            <input id="seoTitle" className="input" value={state.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} />
          </Field>
          <Field label="SEO beschrijving" htmlFor="seoDescription" hint="Laat leeg om de korte omschrijving te gebruiken." counter={[state.seoDescription.length, 160]}>
            <textarea id="seoDescription" rows={3} className="input !min-h-0" value={state.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} />
          </Field>
          <div className="rounded-xl border border-line bg-paper/60 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-stone">Voorbeeld in Google</p>
            <p className="mt-2 truncate text-sm text-graphite">carmendegroot.nl › projecten › {state.slug || "…"}</p>
            <p className="truncate text-lg text-[#1a0dab]">{seoTitle} — Carmen de Groot</p>
            <p className="line-clamp-2 text-sm text-stone">{seoDesc}</p>
          </div>
        </Section>
      </div>

      {/* ── Sidebar ─────────────────────────────────── */}
      <aside className="space-y-6 xl:sticky xl:top-8 xl:self-start">
        <Section title="Publicatie">
          <p className="flex items-center justify-between text-sm">
            <span className="text-stone">Status</span>
            <span className={cn("font-medium", state.status === "published" ? "text-success" : "text-stone")}>
              {state.status === "published" ? "Gepubliceerd" : "Concept"}
            </span>
          </p>
          {dirty && <p className="text-xs text-clay">Je hebt niet-opgeslagen wijzigingen.</p>}
          <div className="grid gap-2">
            <button type="button" disabled={pending || !!uploading} onClick={() => submit("published")} className={buttonClasses("primary", "md", "w-full")}>
              {pending ? "Bezig…" : state.status === "published" ? "Bijwerken" : "Publiceren"}
            </button>
            <button type="button" disabled={pending || !!uploading} onClick={() => submit("draft")} className={buttonClasses("secondary", "md", "w-full")}>
              {state.status === "published" ? "Terugzetten naar concept" : "Concept opslaan"}
            </button>
          </div>
          {state.id && isPublished && (
            <Link href={publicUrl} target="_blank" className="block text-center text-sm text-stone underline-offset-4 hover:text-ink hover:underline">
              Bekijk op website ↗
            </Link>
          )}
        </Section>

        <Section title="Cover afbeelding">
          {state.coverImageUrl ? (
            <div className="space-y-3">
              <img src={state.coverImageUrl} alt="" className="aspect-[4/3] w-full rounded-xl bg-paper-2 object-cover" />
              <input aria-label="Alt-tekst cover" placeholder="Alt-tekst" className="input !py-2 text-sm" value={state.coverAlt} onChange={(e) => set("coverAlt", e.target.value)} />
              <div className="flex gap-2">
                <button type="button" onClick={() => coverInput.current?.click()} className={buttonClasses("secondary", "sm", "flex-1")}>Vervangen</button>
                <button type="button" onClick={() => setPicker("cover")} className={buttonClasses("secondary", "sm", "flex-1")}>Uit media</button>
                <IconBtn label="Cover verwijderen" danger onClick={() => { set("coverImageUrl", ""); set("coverImagePath", null); }}>
                  <Trash size={16} />
                </IconBtn>
              </div>
            </div>
          ) : (
            <div className="grid gap-2">
              <button
                type="button"
                onClick={() => coverInput.current?.click()}
                className="flex aspect-[4/3] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-line text-sm text-stone hover:border-ink hover:text-ink"
              >
                <Upload size={22} />
                <span className="mt-2">{uploading ? "Uploaden…" : "Cover uploaden"}</span>
              </button>
              <button type="button" onClick={() => setPicker("cover")} className={buttonClasses("ghost", "sm")}>Kies uit media</button>
            </div>
          )}
          <input ref={coverInput} type="file" accept="image/*" hidden onChange={(e) => { handleUpload(e.target.files, "cover"); e.target.value = ""; }} />
        </Section>

        <Section title="Indeling">
          <Field label="Categorie" htmlFor="category">
            <select id="category" className="input" value={state.categoryId ?? ""} onChange={(e) => set("categoryId", e.target.value || null)}>
              <option value="">Geen categorie</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Datum" htmlFor="date">
            <input id="date" type="date" className="input" value={state.date} onChange={(e) => set("date", e.target.value)} />
          </Field>
          <Field label="Tags" htmlFor="tags" hint="Enter of komma om toe te voegen.">
            <input
              id="tags"
              className="input"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  addTag(tagInput);
                }
              }}
              onBlur={() => addTag(tagInput)}
            />
          </Field>
          {state.tags.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {state.tags.map((t) => (
                <li key={t}>
                  <button
                    type="button"
                    onClick={() => set("tags", state.tags.filter((x) => x !== t))}
                    className="group inline-flex items-center gap-1 rounded-full bg-paper-2 px-2.5 py-1 text-xs hover:bg-danger/10 hover:text-danger"
                    aria-label={`Tag ${t} verwijderen`}
                  >
                    {t} <span aria-hidden>×</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-line px-4 py-3">
            <span className="text-sm">
              <span className="font-medium">Uitgelicht</span>
              <span className="block text-xs text-stone">Tonen op de homepage</span>
            </span>
            <input type="checkbox" className="h-5 w-5 accent-ink" checked={state.featured} onChange={(e) => set("featured", e.target.checked)} />
          </label>
          <Field label="Volgorde" htmlFor="sortOrder" hint="Lager = eerder getoond.">
            <input id="sortOrder" type="number" min={0} className="input" value={state.sortOrder} onChange={(e) => set("sortOrder", Number(e.target.value))} />
          </Field>
        </Section>

        {state.id && (
          <button type="button" onClick={remove} disabled={pending} className="w-full rounded-xl border border-danger/30 px-4 py-3 text-sm text-danger transition-colors hover:bg-danger hover:text-white">
            Project verwijderen
          </button>
        )}
      </aside>

      <MediaPicker
        open={picker !== null}
        multiple={picker === "gallery"}
        onClose={() => setPicker(null)}
        onSelect={(items) => {
          if (picker === "cover" && items[0]) {
            setState((s) => ({ ...s, coverImageUrl: items[0].url, coverImagePath: items[0].path, coverAlt: s.coverAlt || items[0].alt || s.title }));
          } else {
            setState((s) => ({
              ...s,
              images: [...s.images, ...items.map((m) => ({ key: nextKey(), url: m.url, path: m.path, alt: m.alt ?? "", caption: "" }))],
            }));
          }
          setDirty(true);
        }}
      />
    </form>
  );
}

/* ── small building blocks ─────────────────────────────── */

function Section({ title, description, actions, children }: { title: string; description?: string; actions?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-surface">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <div>
          <h2 className="font-medium">{title}</h2>
          {description && <p className="text-xs text-stone">{description}</p>}
        </div>
        {actions}
      </header>
      <div className="space-y-5 p-5">{children}</div>
    </section>
  );
}

function Field({ label, htmlFor, hint, counter, children }: { label: string; htmlFor: string; hint?: string; counter?: [number, number]; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={htmlFor} className="field-label">{label}</label>
        {counter && <span className={cn("text-xs tabular-nums", counter[0] > counter[1] ? "text-clay" : "text-stone")}>{counter[0]}/{counter[1]}</span>}
      </div>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </div>
  );
}

function IconBtn({ label, onClick, disabled, danger, children }: { label: string; onClick: () => void; disabled?: boolean; danger?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn("flex h-8 w-8 items-center justify-center rounded-lg text-stone transition-colors disabled:opacity-30", danger ? "hover:bg-danger/10 hover:text-danger" : "hover:bg-ink/5 hover:text-ink")}
    >
      {children}
    </button>
  );
}

/** Very small markdown preview for the editor (headings, bold, italics, lists, quotes). */
function MarkdownPreview({ text }: { text: string }) {
  const html = useMemo(() => {
    const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const inline = (s: string) => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>");
    return text
      .split(/\n{2,}/)
      .map((block) => {
        if (block.startsWith("## ")) return `<h2>${inline(block.slice(3))}</h2>`;
        if (block.startsWith("### ")) return `<h3>${inline(block.slice(4))}</h3>`;
        if (block.startsWith("> ")) return `<blockquote>${block.split("\n").map((l) => inline(l.replace(/^>\s?/, ""))).join("<br/>")}</blockquote>`;
        if (/^(- |\d+\. )/.test(block)) {
          const ordered = /^\d+\. /.test(block);
          const items = block.split("\n").map((l) => `<li>${inline(l.replace(/^(- |\d+\. )/, ""))}</li>`).join("");
          return ordered ? `<ol>${items}</ol>` : `<ul>${items}</ul>`;
        }
        return `<p>${inline(block).replace(/\n/g, "<br/>")}</p>`;
      })
      .join("");
  }, [text]);
  return <div className="prose max-w-none rounded-xl border border-line p-5" dangerouslySetInnerHTML={{ __html: html || "<p><em>Nog geen tekst.</em></p>" }} />;
}
