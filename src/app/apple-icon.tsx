import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#111110", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 100, height: 30, background: "#CED82E" }} />
        <div style={{ fontSize: 110, color: "#F6F5F0", fontStyle: "italic", fontFamily: "serif", marginTop: -10 }}>C</div>
      </div>
    ),
    size,
  );
}
