import type { Metadata } from "next";
import { absoluteUrl, documentTitle, SITE_NAME, type SeoInput } from "./site";

export function pageMetadata(input: SeoInput): Metadata {
  const fullTitle = documentTitle(input.title);
  const url = absoluteUrl(input.path);
  const image = absoluteUrl(input.image || "/logo.png");
  return {
    title: input.title === SITE_NAME ? { absolute: SITE_NAME } : input.title,
    description: input.description,
    robots: input.noindex ? { index: false, follow: false } : { index: true, follow: true },
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      title: fullTitle,
      description: input.description,
      url,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary",
      title: fullTitle,
      description: input.description,
      images: [image],
    },
  };
}
