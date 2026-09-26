import type { MetadataRoute } from "next";
import { getBijouxSitemap } from "@/sanity/lib/bijoux/calls";
import { getBlogSitemap } from "@/sanity/lib/blog/calls";
import { siteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const [bijoux, posts] = await Promise.all([
    getBijouxSitemap(),
    getBlogSitemap(),
  ]);
  const pages = [
    "",
    "/boutique-bijou",
    "/ateliers",
    "/sur-mesure",
    "/marches",
    "/blog",
    "/contact",
    "/cgv",
    "/legals",
  ];
  return [
    ...pages.map((p) => ({
      url: `${base}${p}`,
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1 : p === "/boutique-bijou" ? 0.9 : 0.7,
    })),
    ...bijoux.map((b) => ({
      url: `${base}/boutique-bijou/${b._id}`,
      lastModified: b._updatedAt,
      priority: 0.8,
    })),
    ...posts.map((p) => ({
      url: `${base}/blog/${p._id}`,
      lastModified: p._updatedAt,
      priority: 0.5,
    })),
  ];
}
