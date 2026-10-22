import { Suspense } from "react";
import { Loader } from "../../../components/Brand";
import { TwitchCallback } from "../../../views/TwitchCallback";
import { pageMetadata } from "../../../seo-meta";

export const metadata = pageMetadata({
  title: "Connecting Twitch",
  description: "Finishing Twitch login for Stream Clip.",
  path: "/oauth/twitch",
  noindex: true,
});

export default function TwitchOAuthPage() {
  return (
    <Suspense fallback={<Loader label="Connecting Twitch..." />}>
      <TwitchCallback />
    </Suspense>
  );
}
