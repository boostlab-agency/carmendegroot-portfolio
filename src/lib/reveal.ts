import type { CSSProperties } from "react";

/** Spread onto any element to scroll-reveal it, with an optional stagger delay (ms). */
export function reveal(delay = 0): { "data-reveal": ""; style?: CSSProperties } {
  return {
    "data-reveal": "",
    style: delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined,
  };
}
