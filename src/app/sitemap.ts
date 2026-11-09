import type { MetadataRoute } from "next";
import { getPage, getPublishedProjects } from "@/lib/data";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, home, about, cv, contact] = await Promise.all([
    getPublishedProjects(),
    getPage("home"),
    getPage("about"),
    getPage("cv"),
    getPage("contact"),
  ]);
  const latestProject = projects.reduce<string | undefined>(
    (acc, p) => (!acc || p.updatedAt > acc ? p.updatedAt : acc),
    undefined,
  );
  const d = (iso?: string | null) => (iso ? new Date(iso) : new Date());

  return [
    { url: absoluteUrl("/"), lastModified: d(home.updatedAt ?? latestProject), changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/projecten"), lastModified: d(latestProject), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/over-mij"), lastModified: d(about.updatedAt), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/cv"), lastModified: d(cv.updatedAt), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/contact"), lastModified: d(contact.updatedAt), changeFrequency: "yearly", priority: 0.6 },
    ...projects.map((p) => ({
      url: absoluteUrl(`/projecten/${p.slug}`),
      lastModified: d(p.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
