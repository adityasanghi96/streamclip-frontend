import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "../site";

export const dynamic = "force-static";
export const revalidate = false;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_ORIGIN}/`, lastModified: new Date(), changeFrequency: "hourly", priority: 1 },
    { url: `${SITE_ORIGIN}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_ORIGIN}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_ORIGIN}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
  ];
}
