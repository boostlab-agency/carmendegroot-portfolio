import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  actions,
  back,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        {back && (
          <Link href={back.href} className="mb-3 inline-flex items-center gap-1.5 text-sm text-stone hover:text-ink">
            ← {back.label}
          </Link>
        )}
        <h1 className="text-[1.9rem] font-medium tracking-[-0.03em]">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-[0.95rem] text-stone">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className, title, description, actions }: { children: ReactNode; className?: string; title?: string; description?: string; actions?: ReactNode }) {
  return (
    <section className={cn("rounded-2xl border border-line bg-surface", className)}>
      {(title || actions) && (
        <header className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
          <div>
            {title && <h2 className="font-medium tracking-[-0.01em]">{title}</h2>}
            {description && <p className="mt-0.5 text-sm text-stone">{description}</p>}
          </div>
          {actions}
        </header>
      )}
      <div className="p-6">{children}</div>
    </section>
  );
}

export function StatusBadge({ status }: { status: "draft" | "published" }) {
  return status === "published" ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
      <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden /> Gepubliceerd
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/5 px-2.5 py-1 text-xs font-medium text-stone">
      <span className="h-1.5 w-1.5 rounded-full bg-stone" aria-hidden /> Concept
    </span>
  );
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-line px-6 py-16 text-center">
      <p className="text-lg font-medium">{title}</p>
      {text && <p className="mx-auto mt-1.5 max-w-sm text-sm text-stone">{text}</p>}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}

export function SetupNotice() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper p-6">
      <div className="max-w-lg rounded-2xl border border-line bg-surface p-8">
        <p className="text-xs uppercase tracking-[0.16em] text-stone">CMS</p>
        <h1 className="mt-2 text-2xl font-medium tracking-[-0.02em]">Supabase is nog niet gekoppeld</h1>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-stone">
          De publieke website draait op de ingebouwde content. Om het CMS te gebruiken, vul je de Supabase-gegevens in
          <code className="mx-1 rounded bg-paper-2 px-1.5 py-0.5 text-sm">.env.local</code>
          (lokaal) of in de Environment Variables van Vercel. Zie de README voor de stappen.
        </p>
        <ul className="mt-5 space-y-1.5 font-mono text-sm text-graphite">
          <li>NEXT_PUBLIC_SUPABASE_URL</li>
          <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
        </ul>
      </div>
    </main>
  );
}
