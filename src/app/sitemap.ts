import type { MetadataRoute } from "next";

const routes = [
  "",
  "/blog",
  "/blog/creer-qr-code-gratuit",
  "/blog/qr-code-dynamique-vs-statique",
  "/blog/qr-code-marketing-pme",
  "/qr-code-avis-google",
  "/qr-code-carte-visite",
  "/qr-code-evenement",
  "/qr-code-wifi",
  "/qr-code-menu-restaurant",
  "/qr-code-flyer-affiche",
  "/qr-code-packaging-produit",
  "/qr-code-portfolio-creatif",
  "/confidentialite",
  "/mentions-legales",
  "/cgv",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((route) => ({
    url: `https://leqr.fr${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.startsWith("/qr-code-") ? 0.8 : 0.6,
  }));
}
