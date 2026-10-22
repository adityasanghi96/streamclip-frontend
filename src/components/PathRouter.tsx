"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { Loader } from "./Brand";

const ClipPage = dynamic(() => import("./ClipPage").then((mod) => ({ default: mod.ClipPage })), {
  ssr: false,
  loading: () => <Loader label="Loading clip..." />,
});

const ChannelCatalog = dynamic(() => import("./ChannelCatalog").then((mod) => ({ default: mod.ChannelCatalog })), {
  ssr: false,
  loading: () => <Loader label="Loading clips..." />,
});

const UserCatalog = dynamic(() => import("./UserCatalog").then((mod) => ({ default: mod.UserCatalog })), {
  ssr: false,
  loading: () => <Loader label="Loading clips..." />,
});

export function PathRouter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const clip = pathname.match(/^\/clip\/(\d+)\/?$/);
  if (clip) return <ClipPage clipId={Number(clip[1])} />;

  const channel = pathname.match(/^\/channel\/([^/]+)\/?$/);
  if (channel) {
    return (
      <Suspense fallback={<Loader label="Loading clips..." />}>
        <ChannelCatalog ytChannelId={decodeURIComponent(channel[1])} />
      </Suspense>
    );
  }

  const user = pathname.match(/^\/user\/(\d+)\/?$/);
  if (user) {
    return (
      <Suspense fallback={<Loader label="Loading clips..." />}>
        <UserCatalog userId={Number(user[1])} />
      </Suspense>
    );
  }

  return children;
}
