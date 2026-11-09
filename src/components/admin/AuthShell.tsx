import type { ReactNode } from "react";

/** Split-screen frame for login & password reset. */
export function AuthShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <main className="grid min-h-screen bg-paper lg:grid-cols-2">
      <div className="on-dark grain relative hidden overflow-hidden bg-ink p-12 text-paper lg:flex lg:flex-col lg:justify-between">
        <p className="text-lg font-medium">
          Carmen <span className="em-serif text-xl">de Groot</span>
        </p>
        <div aria-hidden className="absolute inset-x-0 top-[55%] h-20 bg-accent" />
        <p className="relative max-w-md text-[2.75rem] font-medium leading-[1.05] tracking-[-0.04em]">
          Beheer je <em className="em-serif">verhaal</em>, project voor project.
        </p>
        <p className="text-sm text-paper/60">carmendegroot.nl — CMS</p>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <h1 className="text-[2rem] font-medium tracking-[-0.03em]">{title}</h1>
          {subtitle && <p className="mt-2 text-stone">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </main>
  );
}
