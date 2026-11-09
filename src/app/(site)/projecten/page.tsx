import type { Metadata } from "next";
import { Suspense } from "react";
import { Emphasis } from "@/components/site/Emphasis";
import { JsonLd } from "@/components/site/JsonLd";
import { ProjectCard } from "@/components/site/ProjectCard";
import { ProjectExplorer } from "@/components/site/ProjectExplorer";
import { getCategories, getPublishedProjects } from "@/lib/data";
import { breadcrumbJsonLd, collectionJsonLd, pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Projecten",
  description:
    "Cases van Carmen de Groot op het snijvlak van design research, conceptontwikkeling, service design en maatschappelijke impact.",
  path: "/projecten",
});

export default async function ProjectsPage() {
  const [projects, categories] = await Promise.all([getPublishedProjects(), getCategories()]);

  return (
    <>
      <JsonLd
        data={[
          collectionJsonLd(projects),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Projecten", path: "/projecten" },
          ]),
        ]}
      />
      <section className="pb-10 pt-32 md:pt-44">
        <div className="container-site grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="eyebrow animate-rise">Projecten</p>
            <h1 className="mt-8 text-display-xl font-medium animate-rise [animation-delay:80ms]">
              <Emphasis text="Werk met *betekenis*." band />
            </h1>
          </div>
          <p className="text-lead text-stone animate-rise [animation-delay:160ms] md:col-span-4">
            Van speculatief onderzoek tot concrete producten: een overzicht van projecten waarin de mens steeds het vertrekpunt is.
          </p>
        </div>
      </section>

      <section className="pb-section">
        <div className="container-site">
          <Suspense
            fallback={
              <div className="mt-10 grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((p, i) => (
                  <ProjectCard key={p.id} project={p} index={i} headingLevel="h2" />
                ))}
              </div>
            }
          >
            <ProjectExplorer projects={projects} categories={categories} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
