import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Emphasis } from "./Emphasis";
import { reveal } from "@/lib/reveal";

interface Props {
  eyebrow?: string;
  title: string;
  text?: string;
  action?: ReactNode;
  className?: string;
  as?: "h1" | "h2";
  index?: string;
}

/** Editorial section header: index + eyebrow, large title, optional intro and action. */
export function SectionHeader({ eyebrow, title, text, action, className, as: Tag = "h2", index }: Props) {
  return (
    <div className={cn("grid gap-8 md:grid-cols-12 md:items-end", className)}>
      <div className="md:col-span-8">
        {(eyebrow || index) && (
          <p className="mb-6 flex items-center gap-4 text-[0.75rem] font-medium uppercase tracking-[0.18em] text-stone" {...reveal()}>
            {index && <span className="tabular-nums text-ink">{index}</span>}
            {index && eyebrow && <span className="h-px w-8 bg-stone/50" aria-hidden />}
            {eyebrow}
          </p>
        )}
        <Tag className="text-display-lg font-medium" {...reveal(60)}>
          <Emphasis text={title} />
        </Tag>
      </div>
      {(text || action) && (
        <div className="flex flex-col gap-6 md:col-span-4 md:items-start md:pb-2" {...reveal(120)}>
          {text && <p className="text-[1.05rem] leading-relaxed text-stone">{text}</p>}
          {action}
        </div>
      )}
    </div>
  );
}
