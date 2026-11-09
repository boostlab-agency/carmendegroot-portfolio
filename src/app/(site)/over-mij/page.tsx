import type { Metadata } from "next";
import Image from "next/image";
import { Emphasis } from "@/components/site/Emphasis";
import { JsonLd } from "@/components/site/JsonLd";
import { Markdown } from "@/components/site/Markdown";
import { ContactCta, Timeline } from "@/components/site/blocks";
import { AnchorButton, ButtonLink } from "@/components/ui/Button";
import { Download } from "@/components/ui/icons";
import { getPage, getSiteSettings } from "@/lib/data";
import { reveal } from "@/lib/reveal";
import { breadcrumbJsonLd, pageMetadata, personJsonLd } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("about");
  return pageMetadata({
    title: page.seoTitle,
    description: page.seoDescription,
    path: "/over-mij",
    type: "profile",
  });
}

export default async function AboutPage() {
  const [{ content: about }, { content: cv }, { content: home }, settings] = await Promise.all([
    getPage("about"),
    getPage("cv"),
    getPage("home"),
    getSiteSettings(),
  ]);

  const career = [...cv.experience, ...cv.education].sort((a, b) => {
    const year = (p: string) => parseInt(p.match(/\d{4}/)?.[0] ?? "0", 10);
    return year(b.period) - year(a.period);
  });

  return (
    <>
      <JsonLd
        data={[
          personJsonLd(settings),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Over mij", path: "/over-mij" },
          ]),
        ]}
      />

      {/* Hero */}
      <section className="pb-20 pt-32 md:pb-28 md:pt-44">
        <div className="container-site">
          <p className="eyebrow animate-rise">{about.eyebrow}</p>
          <h1 className="mt-8 max-w-6xl text-display-xl font-medium animate-rise [animation-delay:80ms]">
            <Emphasis text={about.title} band />
          </h1>
        </div>
      </section>

      {/* Portrait + lead */}
      <section className="pb-section">
        <div className="container-site grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="relative md:col-span-5" {...reveal()}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-bl-2xl rounded-br-[8rem] rounded-tl-[8rem] rounded-tr-2xl bg-paper-2">
              <Image
                src={settings.portraitUrl}
                alt={`Portret van ${settings.siteName}`}
                fill
                priority
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover object-[50%_30%]"
              />
            </div>
            <div aria-hidden className="absolute -bottom-5 left-10 right-[-2rem] h-10 bg-accent md:right-[-4rem]" />
          </div>
          <div className="md:col-span-6 md:col-start-7 md:pt-8">
            <p className="text-display-sm font-normal leading-[1.3]" {...reveal(80)}>
              {about.lead}
            </p>
            <div className="mt-10" {...reveal(140)}>
              <Markdown>{about.story}</Markdown>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="section-y border-t border-line">
        <div className="container-site">
          <ul className="grid gap-12 md:grid-cols-3 md:gap-8">
            {about.principles.map((p, i) => (
              <li key={p.title} {...reveal(i * 80)}>
                <span className="font-serif text-5xl italic text-stone/60">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="mt-6 text-[1.6rem] font-medium tracking-[-0.025em]">
                  <span className="heading-band">{p.title}</span>
                </h2>
                <p className="mt-4 max-w-sm leading-relaxed text-stone">{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Knowledge areas */}
      <section className="section-y bg-ink text-paper on-dark grain">
        <div className="container-site">
          <div className="grid gap-10 md:grid-cols-12">
            <h2 className="text-display-lg font-medium md:col-span-5" {...reveal()}>
              <Emphasis text={about.knowledgeTitle} />
            </h2>
            <div className="md:col-span-7 md:pt-4" {...reveal(80)}>
              <SkillListDark skills={cv.skills} />
            </div>
          </div>
          <ul className="mt-20 grid gap-px overflow-hidden rounded-[1.5rem] border border-paper/10 bg-paper/10 sm:grid-cols-2 lg:grid-cols-3">
            {about.knowledgeAreas.map((area, i) => (
              <li key={area.title} className="group bg-ink p-8 transition-colors duration-500 hover:bg-graphite md:p-10" {...reveal((i % 3) * 80)}>
                <span className="block h-2.5 w-2.5 rounded-full bg-accent transition-transform duration-500 group-hover:scale-150" aria-hidden />
                <h3 className="mt-8 text-[1.35rem] font-medium tracking-[-0.02em]">{area.title}</h3>
                <p className="mt-3 leading-relaxed text-paper/65">{area.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Career */}
      <section className="section-y">
        <div className="container-site">
          <h2 className="text-display-lg font-medium" {...reveal()}>
            <Emphasis text={about.careerTitle} />
          </h2>
          <div className="mt-14">
            <Timeline items={career} />
          </div>

          {cv.otherExperience.length > 0 && (
            <div className="mt-16 grid gap-6 md:grid-cols-12" {...reveal()}>
              <h3 className="text-sm uppercase tracking-[0.16em] text-stone md:col-span-3">Overige werkervaring</h3>
              <ul className="flex flex-wrap gap-2.5 md:col-span-9">
                {cv.otherExperience.map((item) => (
                  <li key={item} className="rounded-full border border-line px-4 py-2 text-sm text-graphite">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* CV download */}
      <section className="pb-section">
        <div className="container-site">
          <div className="relative overflow-hidden rounded-[2rem] bg-accent px-8 py-14 md:px-16 md:py-20" {...reveal()}>
            <div className="grid gap-8 md:grid-cols-12 md:items-end">
              <div className="md:col-span-7">
                <h2 className="text-display-md font-medium text-accent-ink">{about.cvTitle}</h2>
                <p className="mt-4 max-w-md text-lg text-accent-ink/80">{about.cvText}</p>
              </div>
              <div className="flex flex-wrap gap-3 md:col-span-5 md:justify-end">
                <ButtonLink href="/cv" size="lg" arrow>
                  Online cv
                </ButtonLink>
                {settings.cvUrl && (
                  <AnchorButton href={settings.cvUrl} download size="lg" variant="secondary" className="!border-ink/30">
                    <span className="inline-flex items-center gap-2">
                      <Download size={18} /> Download PDF
                    </span>
                  </AnchorButton>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactCta title={home.contactTitle} text={home.contactText} ctaLabel={home.contactCtaLabel} email={settings.email} />
    </>
  );
}

function SkillListDark({ skills }: { skills: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2.5">
      {skills.map((s) => (
        <li key={s} className="rounded-full border border-paper/15 px-4 py-2 text-[0.92rem] text-paper/80 transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-ink">
          {s}
        </li>
      ))}
    </ul>
  );
}
