import { Suspense } from "react";
import { Loader } from "../../../components/Brand";
import { YoutubeCallback } from "../../../views/YoutubeCallback";
import { pageMetadata } from "../../../seo-meta";

export const metadata = pageMetadata({
  title: "Connecting YouTube",
  description: "Finishing YouTube login for Stream Clip.",
  path: "/oauth/youtube",
  noindex: true,
});

export default function YoutubeOAuthPage() {
  return (
    <Suspense fallback={<Loader label="Connecting YouTube..." />}>
      <YoutubeCallback />
    </Suspense>
  );
}
