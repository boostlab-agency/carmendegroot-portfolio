import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Emphasis } from "@/components/site/Emphasis";
import { JsonLd } from "@/components/site/JsonLd";
import { ProjectCard } from "@/components/site/ProjectCard";
import { SectionHeader } from "@/components/site/SectionHeader";
import { ContactCta, Marquee, SkillList, Testimonials, Timeline, ToolList } from "@/components/site/blocks";
import { ButtonLink } from "@/components/ui/Button";
import { getFeaturedProjects, getPage, getSiteSettings } from "@/lib/data";
import { reveal } from "@/lib/reveal";
import { pageMetadata, personJsonLd, websiteJsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("home");
  return {
    ...pageMetadata({ title: page.seoTitle, description: page.seoDescription, path: "/" }),
    title: { absolute: page.seoTitle },
  };
}

export default async function HomePage() {
  const [{ content: home }, { content: cv }, settings, featured] = await Promise.all([
    getPage("home"),
    getPage("cv"),
    getSiteSettings(),
    getFeaturedProjects(4),
  ]);

  return (
    <>
      <JsonLd data={[personJsonLd(settings), websiteJsonLd(settings)]} />

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden pb-16 pt-28 md:pb-24 md:pt-40" aria-labelledby="hero-title">
        <div className="container-site relative grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="relative z-10 md:col-span-7 lg:col-span-7">
            <p className="eyebrow animate-rise">{home.heroEyebrow}</p>
            <h1 id="hero-title" className="mt-8 text-display-2xl font-medium animate-rise [animation-delay:80ms]">
              <Emphasis text={home.heroTitle} band />
            </h1>
            <p className="mt-10 max-w-xl text-lead text-graphite animate-rise [animation-delay:180ms]">{home.heroIntro}</p>
            <div className="mt-10 flex flex-wrap items-center gap-3 animate-rise [animation-delay:260ms]">
              <ButtonLink href={home.primaryCtaHref} size="lg" arrow>
                {home.primaryCtaLabel}
              </ButtonLink>
              <ButtonLink href={home.secondaryCtaHref} size="lg" variant="secondary">
                {home.secondaryCtaLabel}
              </ButtonLink>
            </div>
          </div>

          <div className="relative md:col-span-5 md:pt-6">
            {/* The chartreuse band from the CV, running behind the portrait */}
            {/* Desktop: the band starts behind the portrait (column centre), so it
                never runs under the headline and never sticks out on the left. */}
            <div aria-hidden className="absolute -left-[50vw] -right-[50vw] top-[42%] h-[18%] origin-left animate-band-in bg-accent [animation-delay:300ms] md:left-1/2" />
            <div className="relative mx-auto w-full max-w-[460px]">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-bl-2xl rounded-br-[9rem] rounded-tl-[9rem] rounded-tr-2xl bg-paper-2 shadow-[0_40px_80px_-40px_rgb(17_17_16/0.45)] animate-rise [animation-delay:200ms] md:rounded-br-[11rem] md:rounded-tl-[11rem]">
                <Image
                  src={settings.portraitUrl}
                  alt={`Portret van ${settings.siteName}`}
                  fill
                  priority
                  sizes="(min-width: 768px) 460px, 100vw"
                  className="object-cover object-[50%_30%]"
                />
              </div>
              {settings.availableForWork && settings.availability && (
                <p className="absolute -bottom-4 left-0 inline-flex items-center gap-2.5 rounded-full border border-line bg-paper/90 px-4 py-2.5 text-sm shadow-sm backdrop-blur md:-left-6 md:bottom-10">
                  <span className="h-2 w-2 animate-pulse-dot rounded-full bg-accent ring-1 ring-ink/20" aria-hidden />
                  {settings.availability}
                </p>
              )}
            </div>
          </div>
        </div>

        {home.facts.length > 0 && (
          <div className="container-site mt-20 md:mt-28">
            <dl className="grid border-t border-line sm:grid-cols-3">
              {home.facts.map((fact, i) => (
                <div key={fact.label} className={cn("py-6 sm:pr-8", i > 0 && "border-t border-line sm:border-l sm:border-t-0 sm:pl-8")} {...reveal(i * 80)}>
                  <dt className="text-xs uppercase tracking-[0.16em] text-stone">{fact.label}</dt>
                  <dd className="mt-2 text-[1.05rem] font-medium tracking-[-0.01em]">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </section>

      <Marquee items={home.marquee} />

      {/* ── APPROACH ───────────────────────────────────────── */}
      <section className="section-y" aria-labelledby="approach-title">
        <div className="container-site">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="eyebrow" {...reveal()}>
                {home.approachEyebrow}
              </p>
              <h2 id="approach-title" className="mt-6 text-display-lg font-medium" {...reveal(60)}>
                <Emphasis text={home.approachTitle} />
              </h2>
            </div>
            <p className="text-display-sm font-normal leading-[1.3] text-graphite md:col-span-7 md:pt-12" {...reveal(120)}>
              {home.approachText}
            </p>
          </div>

          <ol className="mt-20 grid gap-px overflow-hidden rounded-[1.5rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {home.approachSteps.map((step, i) => (
              <li key={step.title} className="group relative bg-paper p-8 transition-colors duration-500 hover:bg-surface md:p-10" {...reveal(i * 80)}>
                <span className="block font-serif text-[4.5rem] italic leading-none text-ink/15 transition-colors duration-500 group-hover:text-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-10 text-[1.35rem] font-medium tracking-[-0.02em]">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-stone">{step.text}</p>
                <span aria-hidden className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-accent transition-transform duration-700 ease-out-expo group-hover:scale-x-100" />
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── FEATURED WORK ─────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="section-y border-t border-line" aria-labelledby="work-title">
          <div className="container-site">
            <SectionHeader
              index="01"
              eyebrow="Projecten"
              title={home.featuredTitle}
              text={home.featuredText}
              action={
                <ButtonLink href="/projecten" variant="secondary" arrow>
                  Alle projecten
                </ButtonLink>
              }
            />
            <div className="mt-16 grid gap-x-8 gap-y-16 md:mt-24 md:grid-cols-12 md:gap-y-24">
              {featured.map((project, i) => {
                const isLoneLast = i === featured.length - 1 && featured.length % 2 === 1;
                const layout = isLoneLast
                  ? "md:col-span-8 md:col-start-3"
                  : ["md:col-span-7", "md:col-span-5 md:mt-48", "md:col-span-5", "md:col-span-7 md:-mt-24"][i % 4];
                return (
                  <div key={project.id} className={layout} {...reveal(i % 2 ? 120 : 0)}>
                    <ProjectCard project={project} index={i} size={i % 3 === 0 ? "large" : "default"} />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── SKILLS ─────────────────────────────────────────── */}
      <section className="section-y bg-paper-2/60" aria-labelledby="skills-title">
        <div className="container-site grid gap-16 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="flex items-center gap-4 text-[0.75rem] font-medium uppercase tracking-[0.18em] text-stone" {...reveal()}>
              <span className="tabular-nums text-ink">02</span>
              <span className="h-px w-8 bg-stone/50" aria-hidden />
              Expertise
            </p>
            <h2 id="skills-title" className="mt-6 text-display-lg font-medium" {...reveal(60)}>
              <Emphasis text={home.skillsTitle} />
            </h2>
            <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-stone" {...reveal(120)}>
              {home.skillsText}
            </p>
            <div className="mt-10" {...reveal(160)}>
              <SkillList skills={cv.skills} />
            </div>
          </div>
          <div className="md:col-span-5 md:col-start-8" {...reveal(120)}>
            <h3 className="mb-6 text-xs uppercase tracking-[0.16em] text-stone">Tools</h3>
            <ToolList tools={cv.tools} />
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ─────────────────────────────────────── */}
      <section className="section-y" aria-labelledby="experience-title">
        <div className="container-site">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="flex items-center gap-4 text-[0.75rem] font-medium uppercase tracking-[0.18em] text-stone" {...reveal()}>
                <span className="tabular-nums text-ink">03</span>
                <span className="h-px w-8 bg-stone/50" aria-hidden />
                Loopbaan
              </p>
              <h2 id="experience-title" className="mt-6 text-display-lg font-medium" {...reveal(60)}>
                {home.experienceTitle}
              </h2>
            </div>
            <div {...reveal(120)}>
              <ButtonLink href="/cv" variant="secondary" arrow>
                Bekijk volledig cv
              </ButtonLink>
            </div>
          </div>
          <div className="mt-14">
            <Timeline items={cv.experience.slice(0, 4)} />
          </div>

          {/* Education */}
          <h2 className="mt-28 text-display-md font-medium" {...reveal()}>
            {home.educationTitle}
          </h2>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {cv.education.map((edu, i) => (
              <li key={edu.title} className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-line bg-surface p-8" {...reveal(i * 80)}>
                <span className="text-sm tabular-nums text-stone">{edu.period}</span>
                <h3 className="mt-10 text-[1.3rem] font-medium leading-snug tracking-[-0.02em]">{edu.title}</h3>
                <p className="mt-2 text-stone">{edu.organisation}</p>
                {edu.description && <p className="mt-4 text-sm leading-relaxed text-graphite">{edu.description}</p>}
                <span aria-hidden className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-accent transition-transform duration-700 ease-out-expo group-hover:scale-x-100" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────── */}
      {home.testimonials.length > 0 && (
        <section className="section-y border-t border-line" aria-labelledby="testimonials-title">
          <div className="container-site">
            <h2 id="testimonials-title" className="max-w-3xl text-display-lg font-medium" {...reveal()}>
              <Emphasis text={home.testimonialsTitle} />
            </h2>
            <div className="mt-14">
              <Testimonials items={home.testimonials} />
            </div>
            <p className="mt-10 text-sm text-stone" {...reveal()}>
              Meer weten over mijn achtergrond?{" "}
              <Link href="/over-mij" className="font-medium text-ink underline decoration-accent decoration-2 underline-offset-4">
                Lees mijn verhaal
              </Link>
            </p>
          </div>
        </section>
      )}

      <ContactCta title={home.contactTitle} text={home.contactText} ctaLabel={home.contactCtaLabel} email={settings.email} />
    </>
  );
}
