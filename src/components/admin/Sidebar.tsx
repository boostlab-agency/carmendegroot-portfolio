"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "@/lib/admin/actions/auth";
import { cn } from "@/lib/utils";
import { ExternalLink, FileText, Folder, ImageIcon, Inbox, LayoutGrid, LogOut, Settings, Tag, User } from "@/components/ui/icons";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutGrid, exact: true },
  { href: "/admin/projecten", label: "Projecten", icon: Folder },
  { href: "/admin/categorieen", label: "Categorieën", icon: Tag },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/paginas", label: "Pagina's", icon: FileText },
  { href: "/admin/berichten", label: "Berichten", icon: Inbox, badge: "messages" as const },
  { href: "/admin/instellingen", label: "Instellingen", icon: Settings },
  { href: "/admin/account", label: "Account", icon: User },
];

export function Sidebar({ email, unread }: { email: string; unread: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const active = (href: string, exact?: boolean) => (exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-paper/90 px-4 backdrop-blur lg:hidden">
        <span className="font-medium">
          Carmen <span className="em-serif">de Groot</span> <span className="ml-1 rounded bg-accent px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider">CMS</span>
        </span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg border border-line px-3 py-1.5 text-sm"
          aria-expanded={open}
          aria-controls="admin-nav"
        >
          {open ? "Sluiten" : "Menu"}
        </button>
      </div>

      <aside
        id="admin-nav"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-surface transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-line px-5">
          <span className="font-medium tracking-[-0.02em]">
            Carmen <span className="em-serif text-[1.1rem]">de Groot</span>
          </span>
          <span className="rounded bg-accent px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider">CMS</span>
        </div>

        <nav aria-label="CMS navigatie" className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {NAV.map(({ href, label, icon: Icon, exact, badge }) => (
            <Link
              key={href}
              href={href}
              aria-current={active(href, exact) ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-[0.92rem] transition-colors",
                active(href, exact) ? "bg-ink text-paper" : "text-graphite hover:bg-ink/5",
              )}
            >
              <Icon size={18} />
              <span className="flex-1">{label}</span>
              {badge === "messages" && unread > 0 && (
                <span className={cn("rounded-full px-2 py-0.5 text-xs tabular-nums", active(href) ? "bg-accent text-ink" : "bg-accent text-ink")}>
                  {unread}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="space-y-1 border-t border-line p-3">
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg px-3 py-2 text-[0.92rem] text-graphite hover:bg-ink/5">
            <ExternalLink size={18} /> Bekijk website
          </a>
          <form action={signOut}>
            <button type="submit" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[0.92rem] text-graphite hover:bg-ink/5">
              <LogOut size={18} /> Uitloggen
            </button>
          </form>
          <p className="truncate px-3 pt-2 text-xs text-stone" title={email}>
            {email}
          </p>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-40 bg-ink/30 lg:hidden" onClick={() => setOpen(false)} aria-hidden />}
    </>
  );
}
