import Link from "next/link";
import type { TimelineItem, ToolItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { reveal } from "@/lib/reveal";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowUpRight } from "@/components/ui/icons";
import { Emphasis } from "./Emphasis";

/* ── Marquee ─────────────────────────────────────────────────────── */
export function Marquee({ items }: { items: string[] }) {
  if (!items.length) return null;
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li key={`${item}-${i}`} className="flex items-center">
          <span className="px-6 text-[clamp(1.5rem,3.2vw,2.75rem)] font-medium tracking-[-0.03em] md:px-10">{item}</span>
          <span className="h-2.5 w-2.5 rounded-full bg-accent ring-1 ring-ink/10" aria-hidden />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="mask-fade-x overflow-hidden border-y border-line py-7 md:py-9">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

/* ── Timeline (experience / education) ───────────────────────────── */
export function Timeline({ items, compact = false }: { items: TimelineItem[]; compact?: boolean }) {
  return (
    <ol className="border-t border-line">
      {items.map((item, i) => (
        <li
          key={`${item.title}-${i}`}
          className="group grid gap-x-8 gap-y-2 border-b border-line py-7 transition-colors duration-500 md:grid-cols-12 md:py-9"
          {...reveal(Math.min(i, 4) * 60)}
        >
          <p className="text-sm tabular-nums text-stone md:col-span-3 md:pt-1.5">{item.period}</p>
          <div className={cn(compact ? "md:col-span-9" : "md:col-span-4")}>
            <h3 className="text-[1.35rem] font-medium leading-snug tracking-[-0.02em]">
              <span className="bg-gradient-to-r from-accent to-accent bg-[length:0%_0.3em] bg-[position:0_88%] bg-no-repeat transition-[background-size] duration-700 ease-out-expo group-hover:bg-[length:100%_0.3em]">
                {item.title}
              </span>
            </h3>
            <p className="mt-1 text-[0.95rem] text-stone">{item.organisation}</p>
            {compact && item.description && <p className="mt-3 max-w-2xl leading-relaxed text-graphite">{item.description}</p>}
          </div>
          {!compact && item.description && (
            <p className="leading-relaxed text-graphite md:col-span-5 md:pt-1">{item.description}</p>
          )}
        </li>
      ))}
    </ol>
  );
}

/* ── Tool level dots (mirrors the CV) ────────────────────────────── */
export function ToolDots({ level, max = 4, dark = false }: { level: number; max?: number; dark?: boolean }) {
  return (
    <span className="flex items-center gap-1.5" role="img" aria-label={`Niveau ${level} van ${max}`}>
      {Array.from({ length: max }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, level - i));
        return (
          <span key={i} className={cn("relative h-3 w-3 overflow-hidden rounded-full", dark ? "bg-paper/15" : "bg-ink/10")}>
            <span className={cn("absolute inset-y-0 left-0", dark ? "bg-accent" : "bg-moss")} style={{ width: `${fill * 100}%` }} />
          </span>
        );
      })}
    </span>
  );
}

export function ToolList({ tools }: { tools: ToolItem[] }) {
  return (
    <ul className="divide-y divide-line border-y border-line">
      {tools.map((tool) => (
        <li key={tool.name} className="flex items-center justify-between py-3.5">
          <span className="text-[0.98rem] text-graphite">{tool.name}</span>
          <ToolDots level={tool.level} />
        </li>
      ))}
    </ul>
  );
}

/* ── Skills list ─────────────────────────────────────────────────── */
export function SkillList({ skills }: { skills: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2.5">
      {skills.map((skill) => (
        <li
          key={skill}
          className="rounded-full border border-ink/15 bg-surface/60 px-4 py-2 text-[0.92rem] text-graphite transition-colors duration-300 hover:border-ink hover:bg-accent hover:text-ink"
        >
          {skill}
        </li>
      ))}
    </ul>
  );
}

/* ── Testimonials ────────────────────────────────────────────────── */
export function Testimonials({ items }: { items: { quote: string; name: string; role: string }[] }) {
  return (
    <ul className="grid gap-5 md:grid-cols-3">
      {items.map((t, i) => (
        <li key={i} className="flex flex-col justify-between rounded-[1.5rem] border border-line bg-surface p-8 md:p-9" {...reveal(i * 90)}>
          <span className="font-serif text-6xl leading-none text-accent [text-shadow:0_0_1px_rgb(var(--ink)/0.4)]" aria-hidden>
            “
          </span>
          <blockquote className="mt-2 flex-1 text-[1.12rem] leading-relaxed tracking-[-0.01em] text-graphite">
            {t.quote}
          </blockquote>
          <footer className="mt-8 border-t border-line pt-5">
            <p className="font-medium">{t.name}</p>
            <p className="text-sm text-stone">{t.role}</p>
          </footer>
        </li>
      ))}
    </ul>
  );
}

/* ── Contact call-to-action (dark) ───────────────────────────────── */
export function ContactCta({
  title,
  text,
  ctaLabel,
  email,
}: {
  title: string;
  text: string;
  ctaLabel: string;
  email: string;
}) {
  return (
    <section className="on-dark grain overflow-hidden bg-ink text-paper" aria-labelledby="contact-cta-title">
      <div className="container-site section-y relative">
        <div aria-hidden className="pointer-events-none absolute -right-24 top-16 h-[28rem] w-[28rem] rounded-full bg-moss/60 blur-[120px]" />
        <p className="eyebrow !text-paper/60" {...reveal()}>
          Contact
        </p>
        <h2 id="contact-cta-title" className="relative mt-8 max-w-5xl text-display-xl font-medium" {...reveal(60)}>
          <Emphasis text={title} />
        </h2>
        <div className="relative mt-12 grid gap-10 md:mt-16 md:grid-cols-12 md:items-end">
          <p className="max-w-md text-lead text-paper/70 md:col-span-5" {...reveal(120)}>
            {text}
          </p>
          <div className="flex flex-col items-start gap-6 md:col-span-7 md:items-end" {...reveal(180)}>
            <ButtonLink href="/contact" variant="accent" size="lg" arrow>
              {ctaLabel}
            </ButtonLink>
            {email && (
              <a
                href={`mailto:${email}`}
                className="group inline-flex items-center gap-2 text-[clamp(1.25rem,2.4vw,2rem)] font-medium tracking-[-0.03em] text-paper"
              >
                <span className="link-underline">{email}</span>
                <ArrowUpRight size={22} className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-1 group-hover:translate-x-1" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Breadcrumb-ish back link ────────────────────────────────────── */
export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2 text-sm text-stone transition-colors hover:text-ink">
      <span className="transition-transform duration-500 ease-out-expo group-hover:-translate-x-1" aria-hidden>
        ←
      </span>
      {label}
    </Link>
  );
}
