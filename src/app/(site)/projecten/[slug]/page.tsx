import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/site/JsonLd";
import { Markdown } from "@/components/site/Markdown";
import { ProjectCard } from "@/components/site/ProjectCard";
import { ProjectMedia } from "@/components/site/ProjectMedia";
import { BackLink } from "@/components/site/blocks";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/icons";
import { getProjectBySlug, getPublishedProjects, getRelatedProjects } from "@/lib/data";
import { reveal } from "@/lib/reveal";
import { breadcrumbJsonLd, pageMetadata, projectJsonLd } from "@/lib/seo";
import { formatMonthYear } from "@/lib/utils";

export const revalidate = 3600;
export const dynamicParams = true;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project niet gevonden" };
  return pageMetadata({
    title: project.seoTitle || project.title,
    description: project.seoDescription || project.description,
    path: `/projecten/${project.slug}`,
    type: "article",
  });
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const [related, all] = await Promise.all([getRelatedProjects(project, 3), getPublishedProjects()]);
  const idx = all.findIndex((p) => p.id === project.id);
  const next = all[(idx + 1) % all.length];

  const facts = [
    { label: "Opdrachtgever", value: project.client },
    { label: "Rol", value: project.role },
    { label: "Periode", value: formatMonthYear(project.date) },
    { label: "Duur", value: project.duration },
    { label: "Team", value: project.team },
    { label: "Categorie", value: project.category?.name ?? "" },
  ].filter((f) => f.value);

  const chapters = [
    { id: "uitdaging", label: "De uitdaging", text: project.challenge },
    { id: "aanpak", label: "De aanpak", text: project.approach },
    { id: "resultaat", label: "Het resultaat", text: project.result },
  ].filter((c) => c.text);

  return (
    <>
      <JsonLd
        data={[
          projectJsonLd(project),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Projecten", path: "/projecten" },
            { name: project.title, path: `/projecten/${project.slug}` },
          ]),
        ]}
      />

      <article>
        {/* Header */}
        <header className="pb-12 pt-28 md:pb-16 md:pt-40">
          <div className="container-site">
            <div className="animate-rise">
              <BackLink href="/projecten" label="Alle projecten" />
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-3 animate-rise [animation-delay:60ms]">
              {project.category && (
                <Link
                  href={`/projecten?categorie=${project.category.slug}`}
                  className="rounded-full bg-accent px-3.5 py-1.5 text-xs font-medium text-accent-ink transition-colors hover:bg-ink hover:text-paper"
                >
                  {project.category.name}
                </Link>
              )}
              <span className="text-sm text-stone">{formatMonthYear(project.date)}</span>
            </div>
            <h1 className="mt-6 max-w-6xl text-display-xl font-medium animate-rise [animation-delay:120ms]">{project.title}</h1>
            <p className="mt-8 max-w-3xl text-lead text-graphite animate-rise [animation-delay:180ms]">{project.description}</p>
          </div>
        </header>

        {/* Cover */}
        <div className="container-site animate-rise [animation-delay:240ms]">
          <ProjectMedia
            src={project.coverImage}
            alt={project.coverAlt}
            aspect="aspect-[4/3] md:aspect-[16/8]"
            className="rounded-[1.5rem] md:rounded-[2rem]"
            sizes="(min-width: 1440px) 1340px, 100vw"
            priority
          />
        </div>

        {/* Intro + facts */}
        <section className="section-y">
          <div className="container-site grid gap-14 md:grid-cols-12">
            <dl className="grid h-fit grid-cols-2 gap-x-6 gap-y-7 md:col-span-4 md:grid-cols-1 lg:col-span-3" {...reveal()}>
              {facts.map((f) => (
                <div key={f.label} className="border-t border-line pt-4">
                  <dt className="text-xs uppercase tracking-[0.16em] text-stone">{f.label}</dt>
                  <dd className="mt-1.5 font-medium leading-snug">{f.value}</dd>
                </div>
              ))}
            </dl>
            <div className="md:col-span-8 lg:col-span-8 lg:col-start-5">
              <p className="text-display-sm font-normal leading-[1.35]" {...reveal(80)}>
                {project.intro}
              </p>
            </div>
          </div>
        </section>

        {/* Challenge / Approach / Result */}
        {chapters.length > 0 && (
          <section className="border-t border-line">
            <div className="container-site">
              {chapters.map((c, i) => (
                <div key={c.id} id={c.id} className="grid gap-6 border-b border-line py-14 md:grid-cols-12 md:py-20" {...reveal()}>
                  <div className="md:col-span-4 lg:col-span-3">
                    <span className="text-sm tabular-nums text-stone">0{i + 1}</span>
                    <h2 className="mt-2 text-[1.75rem] font-medium tracking-[-0.03em]">
                      <span className="heading-band">{c.label}</span>
                    </h2>
                  </div>
                  <p className="text-[1.15rem] leading-[1.75] text-graphite md:col-span-8 lg:col-span-8 lg:col-start-5">{c.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Gallery */}
        {project.images.length > 0 && (
          <section className="section-y" aria-label="Beeldmateriaal">
            <div className="container-site grid gap-5 md:grid-cols-2 md:gap-6">
              {project.images.map((image, i) => {
                const wide = project.images.length % 2 === 1 && i === 0;
                return (
                  <figure key={image.id} className={wide ? "md:col-span-2" : ""} {...reveal((i % 2) * 100)}>
                    <ProjectMedia
                      src={image.url}
                      alt={image.alt || project.title}
                      aspect={wide ? "aspect-[16/9]" : "aspect-[4/3]"}
                      className="rounded-[1.25rem]"
                      sizes={wide ? "100vw" : "(min-width: 768px) 50vw, 100vw"}
                    />
                    {image.caption && <figcaption className="mt-3 text-sm text-stone">{image.caption}</figcaption>}
                  </figure>
                );
              })}
            </div>
          </section>
        )}

        {/* Full body */}
        {project.body && (
          <section className="pb-section">
            <div className="container-site grid md:grid-cols-12">
              <div className="md:col-span-8 lg:col-span-7 lg:col-start-5" {...reveal()}>
                <Markdown>{project.body}</Markdown>
              </div>
            </div>
          </section>
        )}

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="container-site pb-section">
            <div className="grid gap-4 border-t border-line pt-8 md:grid-cols-12">
              <h2 className="text-xs uppercase tracking-[0.16em] text-stone md:col-span-4 lg:col-span-3">Tags</h2>
              <ul className="flex flex-wrap gap-2 md:col-span-8 lg:col-start-5">
                {project.tags.map((tag) => (
                  <li key={tag}>
                    <Link
                      href={`/projecten?q=${encodeURIComponent(tag)}`}
                      className="inline-block rounded-full border border-line px-3.5 py-1.5 text-sm text-graphite transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                    >
                      {tag}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </article>

      {/* Next project */}
      {next && next.id !== project.id && (
        <section className="on-dark grain bg-ink text-paper">
          <Link href={`/projecten/${next.slug}`} className="group container-site block py-20 md:py-28">
            <p className="text-xs uppercase tracking-[0.18em] text-paper/60">Volgend project</p>
            <div className="mt-6 flex items-end justify-between gap-8">
              <p className="text-display-xl font-medium transition-transform duration-700 ease-out-expo group-hover:translate-x-3">
                {next.title}
              </p>
              <span className="mb-3 hidden h-20 w-20 shrink-0 items-center justify-center rounded-full bg-accent text-ink transition-transform duration-700 ease-out-expo group-hover:-rotate-45 md:flex">
                <ArrowRight size={30} />
              </span>
            </div>
          </Link>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="section-y" aria-labelledby="related-title">
          <div className="container-site">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <h2 id="related-title" className="text-display-md font-medium" {...reveal()}>
                Gerelateerde projecten
              </h2>
              <div {...reveal(80)}>
                <ButtonLink href="/projecten" variant="secondary" arrow>
                  Alle projecten
                </ButtonLink>
              </div>
            </div>
            <div className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <div key={p.id} {...reveal(i * 80)}>
                  <ProjectCard project={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
