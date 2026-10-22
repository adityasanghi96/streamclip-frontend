import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "../site";

export const dynamic = "force-static";
export const revalidate = false;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/oauth/"],
    },
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
  };
}
