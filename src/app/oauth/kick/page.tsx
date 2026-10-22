import { Suspense } from "react";
import { Loader } from "../../../components/Brand";
import { KickCallback } from "../../../views/KickCallback";
import { pageMetadata } from "../../../seo-meta";

export const metadata = pageMetadata({
  title: "Connecting Kick",
  description: "Finishing Kick login for Stream Clip.",
  path: "/oauth/kick",
  noindex: true,
});

export default function KickOAuthPage() {
  return (
    <Suspense fallback={<Loader label="Connecting Kick..." />}>
      <KickCallback />
    </Suspense>
  );
}
