import { OG_SIZE, renderOgImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Carmen de Groot — Human-Centered Designer";

export default function OpenGraphImage() {
  return renderOgImage({
    eyebrow: "Human-Centered Designer",
    title: "Carmen de Groot",
    footer: "Design dat begint bij mensen.",
  });
}
