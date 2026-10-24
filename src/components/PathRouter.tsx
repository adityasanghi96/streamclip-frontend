"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
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

const Dashboard = dynamic(() => import("../views/Dashboard").then((mod) => ({ default: mod.Dashboard })), {
  ssr: false,
  loading: () => <Loader label="Loading dashboard..." />,
});

const Login = dynamic(() => import("../views/Login").then((mod) => ({ default: mod.Login })), {
  ssr: false,
  loading: () => <Loader label="Loading..." />,
});

const PrivacyPolicy = dynamic(() => import("../views/Legal").then((mod) => ({ default: mod.PrivacyPolicy })), {
  ssr: false,
});

const TermsOfService = dynamic(() => import("../views/Legal").then((mod) => ({ default: mod.TermsOfService })), {
  ssr: false,
});

const YoutubeCallback = dynamic(() => import("../views/YoutubeCallback").then((mod) => ({ default: mod.YoutubeCallback })), {
  ssr: false,
  loading: () => <Loader label="Connecting YouTube..." />,
});

const TwitchCallback = dynamic(() => import("../views/TwitchCallback").then((mod) => ({ default: mod.TwitchCallback })), {
  ssr: false,
  loading: () => <Loader label="Connecting Twitch..." />,
});

const KickCallback = dynamic(() => import("../views/KickCallback").then((mod) => ({ default: mod.KickCallback })), {
  ssr: false,
  loading: () => <Loader label="Connecting Kick..." />,
});

function normalizePath(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

export function PathRouter({ children }: { children: React.ReactNode }) {
  const pathname = normalizePath(usePathname());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return children;

  const clip = pathname.match(/^\/clip\/(\d+)$/);
  if (clip) return <ClipPage clipId={Number(clip[1])} />;

  const channel = pathname.match(/^\/channel\/([^/]+)$/);
  if (channel) {
    return (
      <Suspense fallback={<Loader label="Loading clips..." />}>
        <ChannelCatalog ytChannelId={decodeURIComponent(channel[1])} />
      </Suspense>
    );
  }

  const user = pathname.match(/^\/user\/(\d+)$/);
  if (user) {
    return (
      <Suspense fallback={<Loader label="Loading clips..." />}>
        <UserCatalog userId={Number(user[1])} />
      </Suspense>
    );
  }

  if (pathname === "/dashboard") return <Dashboard />;
  if (pathname === "/login") return <Login />;
  if (pathname === "/privacy") return <PrivacyPolicy />;
  if (pathname === "/terms") return <TermsOfService />;

  if (pathname === "/oauth/youtube") {
    return (
      <Suspense fallback={<Loader label="Connecting YouTube..." />}>
        <YoutubeCallback />
      </Suspense>
    );
  }
  if (pathname === "/oauth/twitch") {
    return (
      <Suspense fallback={<Loader label="Connecting Twitch..." />}>
        <TwitchCallback />
      </Suspense>
    );
  }
  if (pathname === "/oauth/kick") {
    return (
      <Suspense fallback={<Loader label="Connecting Kick..." />}>
        <KickCallback />
      </Suspense>
    );
  }

  return children;
}
