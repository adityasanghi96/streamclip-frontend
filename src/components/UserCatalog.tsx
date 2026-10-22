"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getPublicUser, getUserClips } from "../data";
import { hrefFromParams, parseGameId, parsePage, parseProvider, parseSource } from "../query";
import { SITE_NAME } from "../site";
import type { Channel, Clip, PublicCreator } from "../types";
import {
  ClipCard,
  EmptyState,
  ErrorBanner,
  PAGE_SIZE,
  PROVIDER_TABS,
  QueryPager,
  QueryTabs,
  SOURCE_TABS,
  providerLabel,
  withGame,
} from "./Cards";
import { Loader } from "./Brand";

export function UserCatalog({ userId }: { userId: number }) {
  const searchParams = useSearchParams();
  const provider = parseProvider(searchParams.get("provider") || undefined);
  const source = parseSource(searchParams.get("source") || undefined);
  const page = parsePage(searchParams.get("page") || undefined);
  const gameId = parseGameId(searchParams.get("gameId") || undefined);
  const [user, setUser] = useState<PublicCreator | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [clips, setClips] = useState<Clip[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([getPublicUser(userId), getUserClips(userId, page, provider, source, gameId)])
      .then(([profile, clipRes]) => {
        if (cancelled) return;
        setUser(profile.user);
        setChannels(profile.channels);
        setClips(clipRes.clips);
        setTotal(clipRes.total);
        setError(null);
        document.title = `${profile.user.name} · ${SITE_NAME}`;
      })
      .catch((err) => {
        if (!cancelled) {
          setUser(null);
          setError(err instanceof Error ? err.message : "Could not load clips");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId, provider, source, page, gameId]);

  const hrefFor = (patch: Record<string, string | number | undefined>) =>
    hrefFromParams(`/user/${userId}`, {
      provider,
      source,
      page,
      gameId: gameId || undefined,
      ...patch,
    });

  if (loading && !user) return <Loader label="Loading clips..." />;
  if (error && !user) return <ErrorBanner message={error} />;
  if (!user) return null;

  return (
    <>
      <div className="channel-header">
        {user.picture ? (
          <img src={user.picture} alt="" className="channel-image lg" referrerPolicy="no-referrer" />
        ) : (
          <span className="channel-image lg avatar fallback">{user.name[0]}</span>
        )}
        <div>
          <h1>{user.name}</h1>
          <p className="muted">Clips from YouTube, Twitch, and Kick linked to this account.</p>
          <p className="meta">
            {`${total} ${gameId ? `${clips[0]?.gameName || ""} ` : source === "all" ? "" : `${source} `}clip${total === 1 ? "" : "s"}`}
          </p>
        </div>
      </div>
      {channels.length > 0 && (
        <div className="chip-row">
          {channels.map((channel) => (
            <Link
              key={`${channel.provider}-${channel.ytChannelId}`}
              href={withGame(`/channel/${channel.ytChannelId}`, gameId)}
              className="chip"
            >
              {providerLabel(channel.provider)} · {channel.name}
            </Link>
          ))}
        </div>
      )}
      <QueryTabs value={provider} options={PROVIDER_TABS} hrefFor={(next) => hrefFor({ provider: next, page: 1 })} />
      <QueryTabs value={source} options={SOURCE_TABS} hrefFor={(next) => hrefFor({ source: next, page: 1 })} />
      <ErrorBanner message={error} />
      {loading && clips.length === 0 ? (
        <Loader label="Loading clips..." />
      ) : clips.length === 0 ? (
        <EmptyState title="No clips for this filter" body="Try another platform or clip type for this user." />
      ) : (
        <div className="grid">
          {clips.map((clip) => (
            <ClipCard key={clip.id} clip={clip} />
          ))}
        </div>
      )}
      <QueryPager page={page} pageSize={PAGE_SIZE} total={total} hrefFor={(nextPage) => hrefFor({ page: nextPage })} />
    </>
  );
}
