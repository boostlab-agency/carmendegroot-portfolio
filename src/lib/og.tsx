import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

/** Branded Open Graph card: paper background, ink type and the chartreuse band. */
export function renderOgImage({ eyebrow, title, footer }: { eyebrow: string; title: string; footer: string }) {
  const fontSize = title.length > 40 ? 72 : title.length > 24 ? 88 : 104;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F6F5F0",
          padding: "72px 80px",
          position: "relative",
          color: "#111110",
        }}
      >
        <div style={{ position: "absolute", left: 0, right: 0, top: 360, height: 70, background: "#CED82E" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 24, letterSpacing: 4, textTransform: "uppercase", color: "#605F59" }}>
          <div style={{ width: 40, height: 2, background: "#605F59" }} />
          {eyebrow}
        </div>
        <div style={{ display: "flex", fontSize, fontWeight: 600, lineHeight: 1, letterSpacing: -3, maxWidth: 1000 }}>{title}</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#111110" }}>
          <span>{footer}</span>
          <span style={{ color: "#605F59" }}>carmendegroot.nl</span>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
