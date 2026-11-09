import "server-only";
import { cache } from "react";
import { defaultPages, defaultSettings } from "@/content/defaults";
import { seedCategories, seedProjects } from "@/content/projects";
import { isSupabaseConfigured } from "@/lib/env";
import { PROJECT_SELECT, mapCategory, mapProject, type CategoryRow, type ProjectRow } from "@/lib/mappers";
import { createPublicSupabase } from "@/lib/supabase/server";
import type { Category, PageContentMap, PageKey, PageRecord, Project, SiteSettings } from "@/lib/types";

/**
 * Public data access layer.
 * Reads from Supabase (RLS: published content only) and gracefully falls back
 * to the bundled seed content when Supabase is not configured or unreachable.
 */

function sortProjects(list: Project[]) {
  return [...list].sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return b.date.localeCompare(a.date);
  });
}

function warn(scope: string, error: unknown) {
  console.warn(`[data] ${scope} — falling back to seed content:`, error instanceof Error ? error.message : error);
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  if (!isSupabaseConfigured) return defaultSettings;
  try {
    const { data, error } = await createPublicSupabase().from("site_settings").select("data").eq("id", 1).maybeSingle();
    if (error) throw error;
    return { ...defaultSettings, ...((data?.data as Partial<SiteSettings>) ?? {}) };
  } catch (e) {
    warn("settings", e);
    return defaultSettings;
  }
});

export const getPage = cache(async <K extends PageKey>(key: K): Promise<PageRecord<K>> => {
  const fallback = defaultPages[key];
  const base: PageRecord<K> = {
    key,
    title: fallback.title,
    content: fallback.content as PageContentMap[K],
    seoTitle: fallback.seoTitle,
    seoDescription: fallback.seoDescription,
    updatedAt: null,
  };
  if (!isSupabaseConfigured) return base;
  try {
    const { data, error } = await createPublicSupabase()
      .from("pages")
      .select("title, content, seo_title, seo_description, updated_at")
      .eq("key", key)
      .maybeSingle();
    if (error) throw error;
    if (!data) return base;
    return {
      key,
      title: data.title || base.title,
      content: { ...base.content, ...((data.content as Partial<PageContentMap[K]>) ?? {}) },
      seoTitle: data.seo_title || base.seoTitle,
      seoDescription: data.seo_description || base.seoDescription,
      updatedAt: data.updated_at,
    };
  } catch (e) {
    warn(`page:${key}`, e);
    return base;
  }
});

export const getPublishedProjects = cache(async (): Promise<Project[]> => {
  if (!isSupabaseConfigured) return sortProjects(seedProjects);
  try {
    const { data, error } = await createPublicSupabase()
      .from("projects")
      .select(PROJECT_SELECT)
      .eq("status", "published")
      .order("sort_order", { ascending: true })
      .order("project_date", { ascending: false });
    if (error) throw error;
    return sortProjects((data as ProjectRow[]).map(mapProject));
  } catch (e) {
    warn("projects", e);
    return sortProjects(seedProjects);
  }
});

export const getProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  const all = await getPublishedProjects();
  return all.find((p) => p.slug === slug) ?? null;
});

export const getFeaturedProjects = cache(async (limit = 4): Promise<Project[]> => {
  const all = await getPublishedProjects();
  const featured = all.filter((p) => p.featured);
  return (featured.length >= 2 ? featured : all).slice(0, limit);
});

export async function getRelatedProjects(project: Project, limit = 3): Promise<Project[]> {
  const all = (await getPublishedProjects()).filter((p) => p.id !== project.id);
  const score = (p: Project) =>
    (p.category?.id && p.category.id === project.category?.id ? 10 : 0) +
    p.tags.filter((t) => project.tags.includes(t)).length;
  return [...all].sort((a, b) => score(b) - score(a)).slice(0, limit);
}

export const getCategories = cache(async (): Promise<Category[]> => {
  if (!isSupabaseConfigured) return seedCategories;
  try {
    const { data, error } = await createPublicSupabase().from("categories").select("*").order("sort_order");
    if (error) throw error;
    return (data as CategoryRow[]).map(mapCategory);
  } catch (e) {
    warn("categories", e);
    return seedCategories;
  }
});
