import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

/** Server-rendered markdown (no client JS). Raw HTML is not rendered — safe for CMS input. */
export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div
      className={cn(
        "prose prose-lg max-w-none text-graphite",
        "prose-headings:font-medium prose-headings:tracking-[-0.025em] prose-headings:text-ink",
        "prose-h2:mt-14 prose-h2:text-[1.75rem] prose-h3:text-xl",
        "prose-p:leading-[1.75] prose-li:leading-[1.7] prose-strong:font-semibold prose-strong:text-ink",
        "prose-a:text-ink prose-a:decoration-accent prose-a:decoration-2 prose-a:underline-offset-4",
        "prose-blockquote:border-l-accent prose-blockquote:border-l-4 prose-blockquote:font-serif prose-blockquote:text-2xl prose-blockquote:font-normal prose-blockquote:not-italic prose-blockquote:leading-snug prose-blockquote:text-ink",
        "prose-li:marker:text-stone",
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
