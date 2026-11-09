import type { Metadata } from "next";
import { ContactForm } from "@/components/site/ContactForm";
import { Emphasis } from "@/components/site/Emphasis";
import { JsonLd } from "@/components/site/JsonLd";
import { ArrowUpRight, Mail, MapPin, Phone } from "@/components/ui/icons";
import { getPage, getSiteSettings } from "@/lib/data";
import { reveal } from "@/lib/reveal";
import { absoluteUrl, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("contact");
  return pageMetadata({ title: page.seoTitle, description: page.seoDescription, path: "/contact" });
}

export default async function ContactPage() {
  const [{ content }, settings] = await Promise.all([getPage("contact"), getSiteSettings()]);
  const socials = settings.socials.filter((s) => s.url);

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            url: absoluteUrl("/contact"),
            name: "Contact — Carmen de Groot",
          },
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ]}
      />
      <section className="pb-section pt-32 md:pt-44">
        <div className="container-site grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="eyebrow animate-rise">{content.eyebrow}</p>
            <h1 className="mt-8 text-display-xl font-medium animate-rise [animation-delay:80ms]">
              <Emphasis text={content.title} band />
            </h1>
            <p className="mt-8 max-w-md text-lead text-graphite animate-rise [animation-delay:160ms]">{content.intro}</p>

            <ul className="mt-14 border-t border-line" {...reveal(200)}>
              {settings.email && (
                <ContactRow icon={<Mail size={20} />} label="E-mail" href={`mailto:${settings.email}`} value={settings.email} />
              )}
              {settings.phone && (
                <ContactRow icon={<Phone size={20} />} label="Telefoon" href={`tel:${settings.phone.replace(/\s/g, "")}`} value={settings.phone} />
              )}
              {settings.location && <ContactRow icon={<MapPin size={20} />} label="Locatie" value={settings.location} />}
            </ul>

            {socials.length > 0 && (
              <div className="mt-10" {...reveal(240)}>
                <h2 className="text-xs uppercase tracking-[0.16em] text-stone">Social</h2>
                <ul className="mt-4 flex flex-wrap gap-2.5">
                  {socials.map((s) => (
                    <li key={s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                      >
                        {s.label}
                        <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <div className="rounded-[2rem] border border-line bg-surface p-6 sm:p-10 md:p-12" {...reveal(120)}>
              <h2 className="text-display-sm font-medium">{content.formTitle}</h2>
              <p className="mb-8 mt-2 text-sm text-stone">{content.responseNote}</p>
              <ContactForm successMessage={content.successMessage} email={settings.email} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactRow({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const inner = (
    <>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper-2 text-ink transition-colors duration-300 group-hover:bg-accent">
        {icon}
      </span>
      <span>
        <span className="block text-xs uppercase tracking-[0.16em] text-stone">{label}</span>
        <span className="mt-0.5 block text-lg font-medium tracking-[-0.01em]">{value}</span>
      </span>
    </>
  );
  return (
    <li className="border-b border-line">
      {href ? (
        <a href={href} className="group flex items-center gap-5 py-5">
          {inner}
        </a>
      ) : (
        <div className="group flex items-center gap-5 py-5">{inner}</div>
      )}
    </li>
  );
}
