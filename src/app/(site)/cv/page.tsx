import type { Metadata } from "next";
import Image from "next/image";
import { JsonLd } from "@/components/site/JsonLd";
import { ToolDots } from "@/components/site/blocks";
import { AnchorButton } from "@/components/ui/Button";
import { Download, Mail, MapPin, Phone } from "@/components/ui/icons";
import { getPage, getSiteSettings } from "@/lib/data";
import { reveal } from "@/lib/reveal";
import { breadcrumbJsonLd, pageMetadata, personJsonLd } from "@/lib/seo";
import type { TimelineItem } from "@/lib/types";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("cv");
  return pageMetadata({ title: page.seoTitle, description: page.seoDescription, path: "/cv", type: "profile" });
}

function CvSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-6 border-t border-line py-12 md:grid-cols-12 md:py-14 print:break-inside-avoid print:py-6" {...reveal()}>
      <h2 className="md:col-span-3">
        <span className="heading-band text-sm font-semibold uppercase tracking-[0.18em]">{title}</span>
      </h2>
      <div className="md:col-span-9">{children}</div>
    </section>
  );
}

function Entries({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="space-y-10 print:space-y-5">
      {items.map((item, i) => (
        <li key={`${item.title}-${i}`} className="grid gap-2 sm:grid-cols-[9rem_1fr] sm:gap-8 print:break-inside-avoid">
          <p className="pt-1 text-sm tabular-nums text-stone">{item.period}</p>
          <div>
            <h3 className="text-[1.2rem] font-medium leading-snug tracking-[-0.02em]">{item.title}</h3>
            <p className="text-stone">{item.organisation}</p>
            {item.description && <p className="mt-3 max-w-2xl leading-relaxed text-graphite">{item.description}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

export default async function CvPage() {
  const [{ content: cv }, settings] = await Promise.all([getPage("cv"), getSiteSettings()]);

  return (
    <>
      <JsonLd
        data={[
          personJsonLd(settings),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "CV", path: "/cv" },
          ]),
        ]}
      />
      <div className="pb-section pt-28 md:pt-40 print:pt-0">
        <div className="container-site">
          {/* Toolbar */}
          <div className="no-print mb-10 flex flex-wrap items-center justify-between gap-4 animate-rise">
            <p className="eyebrow">Curriculum Vitae</p>
            {settings.cvUrl && (
              <AnchorButton href={settings.cvUrl} download variant="primary">
                <span className="inline-flex items-center gap-2">
                  <Download size={18} /> Download PDF
                </span>
              </AnchorButton>
            )}
          </div>

          {/* Document */}
          <div className="overflow-hidden rounded-[2rem] border border-line bg-surface shadow-[0_30px_80px_-50px_rgb(17_17_16/0.35)] print:rounded-none print:border-0 print:shadow-none">
            <header className="relative isolate grid gap-10 px-6 pb-12 pt-12 sm:px-10 md:grid-cols-12 md:px-14 md:pt-16">
              <div className="relative z-10 md:col-span-4">
                <div className="relative mx-auto aspect-square w-48 overflow-hidden rounded-bl-xl rounded-br-[5rem] rounded-tl-[5rem] rounded-tr-xl bg-paper-2 md:mx-0 md:w-full md:max-w-[280px]">
                  <Image src={settings.portraitUrl} alt={`Portret van ${settings.siteName}`} fill sizes="280px" className="object-cover object-[50%_25%]" priority />
                </div>
              </div>
              <div className="relative md:col-span-8">
                <h1 className="text-display-lg font-medium animate-rise">{settings.siteName}</h1>
                {/* The CV's chartreuse band, carrying the job title */}
                <div className="relative mt-5 py-3">
                  <div aria-hidden className="absolute inset-y-0 -left-[100vw] -right-16 -z-10 bg-accent print:hidden" />
                  <p className="text-lg font-semibold">{settings.jobTitle}</p>
                </div>
                <p className="mt-8 max-w-2xl leading-relaxed text-graphite">{cv.profile}</p>
              </div>
            </header>

            <ul className="flex flex-wrap gap-x-8 gap-y-3 border-y border-line bg-paper/60 px-6 py-5 text-sm sm:px-10 md:px-14">
              {settings.email && (
                <li>
                  <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-2 hover:underline">
                    <Mail size={16} /> {settings.email}
                  </a>
                </li>
              )}
              {settings.phone && (
                <li>
                  <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 hover:underline">
                    <Phone size={16} /> {settings.phone}
                  </a>
                </li>
              )}
              {settings.location && (
                <li className="inline-flex items-center gap-2">
                  <MapPin size={16} /> {settings.location}
                </li>
              )}
            </ul>

            <div className="px-6 sm:px-10 md:px-14">
              <CvSection title="Ervaring">
                <Entries items={cv.experience} />
              </CvSection>
              <CvSection title="Opleiding">
                <Entries items={cv.education} />
              </CvSection>
              <CvSection title="Skills">
                <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {cv.skills.map((s) => (
                    <li key={s} className="flex items-center gap-3 text-graphite">
                      <span className="h-1.5 w-1.5 rounded-full bg-ink" aria-hidden />
                      {s}
                    </li>
                  ))}
                </ul>
              </CvSection>
              <CvSection title="Tools">
                <ul className="grid gap-x-12 gap-y-4 sm:grid-cols-2">
                  {cv.tools.map((t) => (
                    <li key={t.name} className="flex items-center justify-between gap-4 text-graphite">
                      {t.name}
                      <ToolDots level={t.level} />
                    </li>
                  ))}
                </ul>
              </CvSection>
              {cv.otherExperience.length > 0 && (
                <CvSection title="Overig">
                  <ul className="space-y-2 text-graphite">
                    {cv.otherExperience.map((o) => (
                      <li key={o}>{o}</li>
                    ))}
                  </ul>
                </CvSection>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
