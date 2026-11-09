import type { Category, Project, ProjectImage } from "@/lib/types";

/* Database row shapes (snake_case) → app types (camelCase). */

export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
}

export interface ProjectImageRow {
  id: string;
  project_id: string;
  url: string;
  path: string | null;
  alt: string | null;
  caption: string | null;
  sort_order: number;
}

export interface ProjectRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  intro: string | null;
  body: string | null;
  challenge: string | null;
  approach: string | null;
  result: string | null;
  cover_image_url: string | null;
  cover_alt: string | null;
  tags: string[] | null;
  project_date: string | null;
  category_id: string | null;
  client: string | null;
  role: string | null;
  duration: string | null;
  team: string | null;
  seo_title: string | null;
  seo_description: string | null;
  status: "draft" | "published";
  featured: boolean;
  sort_order: number;
  updated_at: string;
  category?: CategoryRow | null;
  images?: ProjectImageRow[] | null;
}

export const PROJECT_SELECT = "*, category:categories(*), images:project_images(*)";

export function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    sortOrder: row.sort_order ?? 0,
  };
}

export function mapImage(row: ProjectImageRow): ProjectImage {
  return {
    id: row.id,
    url: row.url,
    path: row.path,
    alt: row.alt ?? "",
    caption: row.caption,
    sortOrder: row.sort_order ?? 0,
  };
}

export function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description ?? "",
    intro: row.intro ?? "",
    body: row.body ?? "",
    challenge: row.challenge ?? "",
    approach: row.approach ?? "",
    result: row.result ?? "",
    coverImage: row.cover_image_url,
    coverAlt: row.cover_alt ?? row.title,
    images: (row.images ?? []).map(mapImage).sort((a, b) => a.sortOrder - b.sortOrder),
    tags: row.tags ?? [],
    date: row.project_date ?? row.updated_at.slice(0, 10),
    category: row.category ? mapCategory(row.category) : null,
    client: row.client ?? "",
    role: row.role ?? "",
    duration: row.duration ?? "",
    team: row.team ?? "",
    seoTitle: row.seo_title ?? "",
    seoDescription: row.seo_description ?? "",
    status: row.status,
    featured: row.featured,
    sortOrder: row.sort_order ?? 0,
    updatedAt: row.updated_at,
  };
}
