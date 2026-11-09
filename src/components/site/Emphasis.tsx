import { Fragment } from "react";
import { parseEmphasis } from "@/lib/utils";

/**
 * Renders CMS text where *words* between asterisks get the expressive
 * serif italic treatment — optionally with the chartreuse band behind them.
 */
export function Emphasis({ text, band = false }: { text: string; band?: boolean }) {
  return (
    <>
      {parseEmphasis(text).map((part, i) =>
        part.em ? (
          <em key={i} className={band ? "em-serif band" : "em-serif"}>
            {part.text}
          </em>
        ) : (
          <Fragment key={i}>{part.text}</Fragment>
        ),
      )}
    </>
  );
}
