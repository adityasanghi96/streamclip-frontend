import { SITE_ORIGIN as ENV_SITE_ORIGIN } from "./env";

export const SITE_ORIGIN = ENV_SITE_ORIGIN;

export const SITE_NAME = "Stream Clip";

export const DEFAULT_DESCRIPTION =
  "Stream Clip is a livestream clipping app for YouTube, Twitch, and Kick. Browse public clips without signing in. Streamers can sign in with Google to connect channels and capture clips.";

export type SeoInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
  jsonLd?: unknown[];
};

export const PAGES = {
  home: {
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    path: "/",
  },
  login: {
    title: "Sign in",
    description:
      "Sign in to Stream Clip with Google to connect YouTube, Twitch, or Kick channels and capture livestream clips. You can browse public clips without an account.",
    path: "/login",
  },
  privacy: {
    title: "Privacy Policy",
    description:
      "How Stream Clip collects, uses, and shares information when you browse clips or sign in with Google to connect YouTube, Twitch, and Kick.",
    path: "/privacy",
  },
  terms: {
    title: "Terms of Service",
    description:
      "Terms for using Stream Clip to browse, create, and share livestream clips from YouTube, Twitch, and Kick.",
    path: "/terms",
  },
  dashboard: {
    title: "Dashboard",
    description: "Manage linked channels, clip commands, and Discord webhooks on Stream Clip.",
    path: "/dashboard",
    noindex: true,
  },
} as const satisfies Record<string, SeoInput>;

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

export function documentTitle(title: string) {
  return title === SITE_NAME ? SITE_NAME : `${title} · ${SITE_NAME}`;
}

export function jsonLdGraph(input: SeoInput) {
  const url = absoluteUrl(input.path);
  const title = documentTitle(input.title);
  const image = absoluteUrl(input.image || "/logo.png");
  const websiteId = `${SITE_ORIGIN}/#website`;
  const orgId = `${SITE_ORIGIN}/#organization`;
  const appId = `${SITE_ORIGIN}/#app`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: `${SITE_ORIGIN}/`,
        name: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
        inLanguage: "en",
        publisher: { "@id": orgId },
      },
      {
        "@type": "Organization",
        "@id": orgId,
        name: SITE_NAME,
        url: `${SITE_ORIGIN}/`,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/logo.png"),
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": appId,
        name: SITE_NAME,
        url: `${SITE_ORIGIN}/`,
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Web",
        description: DEFAULT_DESCRIPTION,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        publisher: { "@id": orgId },
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        description: input.description,
        isPartOf: { "@id": websiteId },
        about: { "@id": appId },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: image,
        },
      },
      ...(input.jsonLd || []),
    ],
  };
}
