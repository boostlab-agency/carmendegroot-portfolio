"use client";

import { useSearchParams } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import type { Category, Project } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Close, Search } from "@/components/ui/icons";
import { ProjectCard } from "./ProjectCard";

function normalize(s: string) {
  return s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function ProjectExplorer({ projects, categories }: { projects: Project[]; categories: Category[] }) {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState(params.get("categorie") ?? "alle");
  const deferredQuery = useDeferredValue(query);

  // Only show categories that actually contain published work
  const usedCategories = useMemo(
    () => categories.filter((c) => projects.some((p) => p.category?.slug === c.slug)),
    [categories, projects],
  );

  // Keep the URL shareable without triggering navigation
  useEffect(() => {
    const url = new URL(window.location.href);
    if (deferredQuery) url.searchParams.set("q", deferredQuery);
    else url.searchParams.delete("q");
    if (category !== "alle") url.searchParams.set("categorie", category);
    else url.searchParams.delete("categorie");
    window.history.replaceState(null, "", url.toString());
  }, [deferredQuery, category]);

  const filtered = useMemo(() => {
    const q = normalize(deferredQuery.trim());
    return projects.filter((p) => {
      if (category !== "alle" && p.category?.slug !== category) return false;
      if (!q) return true;
      const haystack = normalize(
        [p.title, p.description, p.intro, p.client, p.role, p.category?.name ?? "", ...p.tags].join(" "),
      );
      return q.split(/\s+/).every((term) => haystack.includes(term));
    });
  }, [projects, deferredQuery, category]);

  const chips = [{ slug: "alle", name: "Alle projecten" }, ...usedCategories];

  return (
    <div>
      <div className="flex flex-col gap-6 border-y border-line py-6 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter op categorie" className="no-scrollbar -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] lg:mx-0 lg:flex-wrap lg:px-0">
          {chips.map((c) => {
            const count = c.slug === "alle" ? projects.length : projects.filter((p) => p.category?.slug === c.slug).length;
            const active = category === c.slug;
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => setCategory(c.slug)}
                aria-pressed={active}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors duration-300",
                  active ? "border-ink bg-ink text-paper" : "border-line bg-surface/50 text-graphite hover:border-ink",
                )}
              >
                {c.name}
                <span className={cn("text-xs tabular-nums", active ? "text-paper/60" : "text-stone")}>{count}</span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:max-w-xs">
          <label htmlFor="project-search" className="sr-only">
            Zoek in projecten
          </label>
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone" />
          <input
            id="project-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Zoek op titel, thema of tag…"
            className="input !rounded-full !py-2.5 pl-11 pr-10 [&::-webkit-search-cancel-button]:hidden"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-stone hover:bg-ink/5 hover:text-ink"
              aria-label="Zoekopdracht wissen"
            >
              <Close size={16} />
            </button>
          )}
        </div>
      </div>

      <p className="mt-6 text-sm text-stone" aria-live="polite">
        {filtered.length === 1 ? "1 project" : `${filtered.length} projecten`}
        {deferredQuery && <> voor “{deferredQuery}”</>}
      </p>

      {filtered.length > 0 ? (
        <div className="mt-10 grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={projects.indexOf(project)} priority={i < 3} headingLevel="h2" />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-[1.5rem] border border-dashed border-line px-6 py-20 text-center">
          <p className="text-display-sm font-medium">Geen projecten gevonden.</p>
          <p className="mt-3 text-stone">Probeer een andere zoekterm of categorie.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("alle");
            }}
            className="mt-6 text-sm font-medium underline decoration-accent decoration-2 underline-offset-4"
          >
            Alle filters wissen
          </button>
        </div>
      )}
    </div>
  );
}
