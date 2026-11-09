import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Carmen de Groot — Human-Centered Designer",
    short_name: "Carmen de Groot",
    description: "Portfolio van Carmen de Groot, human-centered designer uit Tilburg.",
    start_url: "/",
    display: "standalone",
    background_color: "#F6F5F0",
    theme_color: "#F6F5F0",
    lang: "nl",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
