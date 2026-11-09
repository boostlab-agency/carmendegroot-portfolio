import Link from "next/link";
import type { Project } from "@/lib/types";
import { cn, yearOf } from "@/lib/utils";
import { ArrowUpRight } from "@/components/ui/icons";
import { ProjectMedia } from "./ProjectMedia";

interface Props {
  project: Project;
  index?: number;
  size?: "default" | "large";
  priority?: boolean;
  className?: string;
  headingLevel?: "h2" | "h3";
}

export function ProjectCard({ project, index, size = "default", priority, className, headingLevel: H = "h3" }: Props) {
  return (
    <article className={cn("group relative", className)}>
      <Link href={`/projecten/${project.slug}`} className="block focus-visible:outline-none" aria-label={`Bekijk project: ${project.title}`}>
        <div className="relative overflow-hidden rounded-[1.25rem] ring-1 ring-ink/5 transition-[border-radius] duration-700 ease-out-expo group-hover:rounded-[2rem] group-focus-visible:ring-2 group-focus-visible:ring-ink">
          <ProjectMedia
            src={project.coverImage}
            alt={project.coverAlt}
            aspect={size === "large" ? "aspect-[4/3] md:aspect-[16/11]" : "aspect-[4/3]"}
            sizes={size === "large" ? "(min-width: 768px) 60vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
            priority={priority}
            zoom
          />
          <span
            className="absolute right-5 top-5 flex h-12 w-12 scale-75 items-center justify-center rounded-full bg-paper text-ink opacity-0 shadow-sm transition-all duration-500 ease-out-expo group-hover:scale-100 group-hover:opacity-100"
            aria-hidden
          >
            <ArrowUpRight size={20} />
          </span>
          {project.category && (
            <span className="absolute left-5 top-5 rounded-full bg-paper/90 px-3 py-1.5 text-xs font-medium text-ink backdrop-blur">
              {project.category.name}
            </span>
          )}
        </div>

        <div className="mt-5 flex items-start justify-between gap-6">
          <div>
            <H className={cn("font-medium tracking-[-0.03em]", size === "large" ? "text-display-sm" : "text-[1.4rem] leading-tight")}>
              {typeof index === "number" && (
                <span className="mr-3 align-top text-xs font-normal tabular-nums tracking-normal text-stone">
                  {String(index + 1).padStart(2, "0")}
                </span>
              )}
              <span className="bg-gradient-to-r from-accent to-accent bg-[length:0%_0.3em] bg-[position:0_88%] bg-no-repeat transition-[background-size] duration-700 ease-out-expo group-hover:bg-[length:100%_0.3em]">
                {project.title}
              </span>
            </H>
            <p className="mt-2 max-w-md text-[0.95rem] leading-relaxed text-stone">{project.description}</p>
          </div>
          <span className="shrink-0 pt-1.5 text-sm tabular-nums text-stone">{yearOf(project.date)}</span>
        </div>
      </Link>
    </article>
  );
}
