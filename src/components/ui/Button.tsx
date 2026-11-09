import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "./icons";

type Variant = "primary" | "secondary" | "ghost" | "accent" | "light" | "danger";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-graphite",
  secondary: "border border-ink/15 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-paper",
  ghost: "bg-transparent text-ink hover:bg-ink/5",
  accent: "bg-accent text-accent-ink hover:bg-paper",
  light: "border border-paper/20 bg-transparent text-paper hover:border-paper hover:bg-paper hover:text-ink",
  danger: "bg-danger text-white hover:bg-danger/90",
};

const sizes: Record<Size, string> = {
  sm: "h-9 gap-2 px-4 text-sm",
  md: "h-12 gap-2.5 px-6 text-[0.95rem]",
  lg: "h-14 gap-3 px-7 text-base",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(
    "group/btn relative inline-flex select-none items-center justify-center whitespace-nowrap rounded-full font-medium tracking-[-0.01em] transition-[background-color,color,border-color,transform] duration-300 ease-out-expo active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );
}

function ArrowSwap() {
  return (
    <span className="relative -mr-1 inline-flex h-5 w-5 overflow-hidden" aria-hidden>
      <ArrowUpRight
        size={18}
        className="absolute inset-0 m-auto transition-transform duration-500 ease-out-expo group-hover/btn:-translate-y-5 group-hover/btn:translate-x-5"
      />
      <ArrowUpRight
        size={18}
        className="absolute inset-0 m-auto -translate-x-5 translate-y-5 transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-0 group-hover/btn:translate-y-0"
      />
    </span>
  );
}

interface ButtonLinkProps extends Omit<ComponentProps<typeof Link>, "className"> {
  variant?: Variant;
  size?: Size;
  className?: string;
  arrow?: boolean;
  children: ReactNode;
}

export function ButtonLink({ variant, size, className, arrow, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={buttonClasses(variant, size, className)} {...props}>
      <span>{children}</span>
      {arrow && <ArrowSwap />}
    </Link>
  );
}

interface AnchorButtonProps extends ComponentProps<"a"> {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
}

export function AnchorButton({ variant, size, className, arrow, children, ...props }: AnchorButtonProps) {
  return (
    <a className={buttonClasses(variant, size, className)} {...props}>
      <span>{children}</span>
      {arrow && <ArrowSwap />}
    </a>
  );
}

interface ButtonProps extends ComponentProps<"button"> {
  variant?: Variant;
  size?: Size;
}

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, size, className)} {...props} />;
}
