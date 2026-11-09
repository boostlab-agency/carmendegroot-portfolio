"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { buttonClasses } from "@/components/ui/Button";
import { NAV_ITEMS } from "@/lib/nav";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("group inline-flex items-baseline gap-1.5 text-[1.05rem] font-medium tracking-[-0.02em]", className)} aria-label="Carmen de Groot — home">
      <span>Carmen</span>
      <span className="em-serif text-[1.2rem]">de Groot</span>
      <span className="ml-0.5 inline-block h-2 w-2 translate-y-[-1px] rounded-full bg-accent ring-1 ring-ink/10 transition-transform duration-500 ease-out-expo group-hover:scale-150" aria-hidden />
    </Link>
  );
}

export function Header({ availability }: { availability?: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled && !open ? "border-b border-line/70 bg-paper/80 backdrop-blur-xl" : "border-b border-transparent",
        )}
      >
        <div className="container-site flex h-[72px] items-center justify-between md:h-[84px]">
          <Logo className="relative z-[60]" />

          <nav aria-label="Hoofdnavigatie" className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "relative rounded-full px-4 py-2 text-[0.92rem] transition-colors duration-300",
                  isActive(item.href) ? "text-ink" : "text-stone hover:text-ink",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute inset-x-4 bottom-1 h-[3px] origin-left bg-accent transition-transform duration-500 ease-out-expo",
                    isActive(item.href) ? "scale-x-100" : "scale-x-0",
                  )}
                  aria-hidden
                />
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-5 md:flex">
            {availability && (
              <span className="hidden items-center gap-2 text-[0.8rem] text-stone lg:inline-flex">
                <span className="h-2 w-2 animate-pulse-dot rounded-full bg-accent ring-1 ring-ink/20" aria-hidden />
                {availability}
              </span>
            )}
            <Link href="/contact" className={buttonClasses("primary", "sm")}>
              Contact
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="relative z-[60] -mr-2 flex h-11 w-11 items-center justify-center rounded-full md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Menu sluiten" : "Menu openen"}
          >
            <span className="relative block h-3 w-6" aria-hidden>
              <span className={cn("absolute left-0 top-0 h-[1.5px] w-full bg-current transition-transform duration-500 ease-out-expo", open && "translate-y-[5.25px] rotate-45")} />
              <span className={cn("absolute bottom-0 left-0 h-[1.5px] w-full bg-current transition-transform duration-500 ease-out-expo", open && "-translate-y-[5.25px] -rotate-45")} />
            </span>
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 z-40 flex flex-col bg-paper px-[var(--gutter)] pb-10 pt-28 transition-[opacity,visibility] duration-500 md:hidden",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
        aria-hidden={!open}
      >
        <nav aria-label="Mobiele navigatie" className="flex flex-1 flex-col gap-2">
          {[{ href: "/", label: "Home" }, ...NAV_ITEMS].map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              tabIndex={open ? 0 : -1}
              className={cn(
                "flex items-baseline gap-4 border-b border-line py-4 text-[2.5rem] font-medium leading-none tracking-[-0.04em] transition-[transform,opacity] duration-700 ease-out-expo",
                open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
              )}
              style={{ transitionDelay: open ? `${80 + i * 50}ms` : "0ms" }}
            >
              <span className="text-xs font-normal tabular-nums tracking-normal text-stone">0{i + 1}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        {availability && (
          <p className="mt-8 inline-flex items-center gap-2 text-sm text-stone">
            <span className="h-2 w-2 rounded-full bg-accent ring-1 ring-ink/20" aria-hidden />
            {availability}
          </p>
        )}
      </div>
    </>
  );
}
