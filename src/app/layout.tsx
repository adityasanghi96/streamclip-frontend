import type { Metadata } from "next";
import Script from "next/script";
import { AuthProvider } from "../auth";
import { SiteShell } from "../components/SiteShell";
import { SITE_NAME, SITE_ORIGIN, DEFAULT_DESCRIPTION } from "../site";
import { pageMetadata } from "../seo-meta";
import { PAGES } from "../site";
import "../styles.css";

const themeScript = `(function(){try{var t=localStorage.getItem("streamclip-theme");if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;}}catch(e){}})();`;

export const viewport = {
  themeColor: "#070b16",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  ...pageMetadata(PAGES.home),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  icons: { icon: "/favicon.png", apple: "/logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
        <AuthProvider>
          <SiteShell>{children}</SiteShell>
        </AuthProvider>
      </body>
    </html>
  );
}
