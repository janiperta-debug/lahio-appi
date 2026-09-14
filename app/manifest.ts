import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lähellä — Ihmiset lähellä sinua",
    short_name: "Lähellä",
    description:
      "Löydä naapureita, leikkikavereita ja yhteisöllisiä hetkiä lähialueeltasi. Ilmainen, turvallinen ja suomalainen.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fdf8f3",
    theme_color: "#e8734a",
    lang: "fi",
    categories: ["social", "lifestyle"],
    icons: [
      {
        src: "/images/lahella-app-icon.jpg",
        sizes: "192x192",
        type: "image/jpeg",
        purpose: "any",
      },
      {
        src: "/images/lahella-app-icon.jpg",
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "any",
      },
      {
        src: "/images/lahella-app-icon.jpg",
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "maskable",
      },
    ],
  }
}
