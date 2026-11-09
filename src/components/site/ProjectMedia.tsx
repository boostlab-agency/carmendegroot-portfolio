import Image from "next/image";
import { cn } from "@/lib/utils";

interface Props {
  src: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Tailwind aspect class, e.g. "aspect-[4/3]" */
  aspect?: string;
  zoom?: boolean;
}

/**
 * Image frame used for all project visuals. SVG placeholders are served as-is,
 * raster images (Supabase Storage) go through the Next.js image optimizer.
 */
export function ProjectMedia({ src, alt, className, sizes = "100vw", priority, aspect = "aspect-[4/3]", zoom }: Props) {
  return (
    <div className={cn("relative overflow-hidden bg-paper-2", aspect, className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          unoptimized={src.endsWith(".svg")}
          className={cn(
            "object-cover",
            zoom && "transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.04]",
          )}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-stone" aria-hidden>
          Geen afbeelding
        </div>
      )}
    </div>
  );
}
