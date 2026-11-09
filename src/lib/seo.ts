import type { Metadata } from "next";
import { SITE_URL } from "@/lib/env";
import type { Project, SiteSettings } from "@/lib/types";
import { stripEmphasis } from "@/lib/utils";

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: "website" | "article" | "profile";
  noIndex?: boolean;
}

/** Consistent metadata (incl. Open Graph + Twitter) for every public page. */
export function pageMetadata({ title, description, path, image, type = "website", noIndex }: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const images = image ? [{ url: absoluteUrl(image), width: 1200, height: 630, alt: stripEmphasis(title) }] : undefined;
  return {
    title: stripEmphasis(title),
    description,
    alternates: { canonical: url },
    openGraph: {
      title: stripEmphasis(title),
      description,
      url,
      type,
      locale: "nl_NL",
      siteName: "Carmen de Groot",
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: stripEmphasis(title),
      description,
      ...(images ? { images: images.map((i) => i.url) } : {}),
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

/* ── Structured data (schema.org JSON-LD) ─────────────────────────── */

export function personJsonLd(settings: SiteSettings) {
  const sameAs = settings.socials.map((s) => s.url).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: settings.siteName,
    jobTitle: settings.jobTitle,
    description: settings.siteDescription,
    url: SITE_URL,
    image: absoluteUrl(settings.portraitUrl),
    email: settings.email ? `mailto:${settings.email}` : undefined,
    address: { "@type": "PostalAddress", addressLocality: "Tilburg", addressCountry: "NL" },
    worksFor: { "@type": "Organization", name: "EpilepsieNL" },
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "Tilburg University" },
      { "@type": "CollegeOrUniversity", name: "Fontys Hogescholen" },
    ],
    knowsAbout: [
      "Human-Centered Design",
      "Design Thinking",
      "User Research",
      "Kwalitatief onderzoek",
      "Conceptontwikkeling",
      "Prototyping",
      "Trendonderzoek",
      "Speculative Design",
    ],
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteJsonLd(settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: settings.siteName,
    description: settings.siteDescription,
    inLanguage: "nl-NL",
    publisher: { "@id": `${SITE_URL}/#person` },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function projectJsonLd(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": absoluteUrl(`/projecten/${project.slug}#work`),
    name: project.title,
    headline: project.title,
    description: project.seoDescription || project.description,
    url: absoluteUrl(`/projecten/${project.slug}`),
    image: project.coverImage ? absoluteUrl(project.coverImage) : undefined,
    dateCreated: project.date,
    dateModified: project.updatedAt,
    inLanguage: "nl-NL",
    genre: project.category?.name,
    keywords: project.tags.join(", "),
    creator: { "@id": `${SITE_URL}/#person` },
    author: { "@type": "Person", name: "Carmen de Groot", url: SITE_URL },
  };
}

export function collectionJsonLd(projects: Project[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Projecten — Carmen de Groot",
    url: absoluteUrl("/projecten"),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: projects.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(`/projecten/${p.slug}`),
        name: p.title,
      })),
    },
  };
}
