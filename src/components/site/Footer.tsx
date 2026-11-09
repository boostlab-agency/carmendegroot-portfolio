import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { ArrowUpRight } from "@/components/ui/icons";
import { NAV_ITEMS } from "@/lib/nav";

export function Footer({ settings }: { settings: SiteSettings }) {
  const socials = settings.socials.filter((s) => s.url);
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark grain bg-ink text-paper">
      <div className="container-site">
        <div className="grid gap-14 border-t border-paper/10 py-16 md:grid-cols-12 md:py-20">
          <div className="md:col-span-5">
            <p className="text-[1.6rem] font-medium leading-tight tracking-[-0.03em]">
              Carmen <span className="em-serif text-[1.85rem]">de Groot</span>
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-paper/60">
              {settings.jobTitle} — {settings.location}
            </p>
          </div>

          <nav aria-label="Footer navigatie" className="md:col-span-3">
            <p className="mb-5 text-[0.7rem] uppercase tracking-[0.18em] text-paper/60">Navigatie</p>
            <ul className="space-y-2.5">
              {[{ href: "/", label: "Home" }, ...NAV_ITEMS].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-underline text-paper/85 transition-colors hover:text-paper">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <p className="mb-5 text-[0.7rem] uppercase tracking-[0.18em] text-paper/60">Contact</p>
            <ul className="space-y-2.5">
              {settings.email && (
                <li>
                  <a href={`mailto:${settings.email}`} className="link-underline text-paper/85 hover:text-paper">
                    {settings.email}
                  </a>
                </li>
              )}
              {settings.phone && (
                <li>
                  <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="link-underline text-paper/85 hover:text-paper">
                    {settings.phone}
                  </a>
                </li>
              )}
              {socials.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 text-paper/85 hover:text-paper">
                    <span className="link-underline">{s.label}</span>
                    <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-paper/10 py-8 text-xs text-paper/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {settings.siteName}. Alle rechten voorbehouden.</p>
          <a href="#top" className="link-underline self-start hover:text-paper sm:self-auto">
            Terug naar boven ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
