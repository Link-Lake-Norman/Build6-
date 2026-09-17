import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/ambassador",
    name: "BUILD6 Student Companion",
    short_name: "BUILD6",
    description:
      "BUILD6 Student Companion — assignments, experiences, reflection, growth and the story of who you are becoming.",
    start_url: "/ambassador",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0D1B3D",
    theme_color: "#0D1B3D",
    categories: ["education", "productivity"],
    icons: [
      {
        src: "/build6-icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/build6-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/build6-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
