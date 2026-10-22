"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getChannelClips } from "../data";
import { hrefFromParams, parseGameId, parsePage, parseSource } from "../query";
import { SITE_NAME } from "../site";
import type { Channel, Clip } from "../types";
import { ClipCard, EmptyState, ErrorBanner, PAGE_SIZE, QueryPager, QueryTabs, SOURCE_TABS, providerLabel } from "./Cards";
import { Loader } from "./Brand";

type ChannelData = {
  channel: Channel;
  clips: Clip[];
  total: number;
};

export function ChannelCatalog({ ytChannelId }: { ytChannelId: string }) {
  const searchParams = useSearchParams();
  const source = parseSource(searchParams.get("source") || undefined);
  const page = parsePage(searchParams.get("page") || undefined);
  const gameId = parseGameId(searchParams.get("gameId") || undefined);
  const [data, setData] = useState<ChannelData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getChannelClips(ytChannelId, page, source, gameId)
      .then((next) => {
        if (cancelled) return;
        setData(next);
        setError(null);
        document.title = `${next.channel.name} · ${SITE_NAME}`;
      })
      .catch((err) => {
        if (!cancelled) {
          setData(null);
          setError(err instanceof Error ? err.message : "Could not load clips");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [ytChannelId, source, page, gameId]);

  const hrefFor = (patch: Record<string, string | number | undefined>) =>
    hrefFromParams(`/channel/${ytChannelId}`, {
      source,
      page,
      gameId: gameId || undefined,
      ...patch,
    });

  if (loading && !data) return <Loader label="Loading clips..." />;
  if (error && !data) return <ErrorBanner message={error} />;
  if (!data) return null;

  return (
    <>
      <div className="channel-header">
        <img src={data.channel.imageUrl} alt="" className="channel-image lg" referrerPolicy="no-referrer" />
        <div>
          <h1>{data.channel.name}</h1>
          <p className="muted">
            {providerLabel(data.channel.provider)} · {data.channel.handle || data.channel.ytChannelId}
          </p>
          <p className="meta">
            {`${data.total} ${gameId ? `${data.clips[0]?.gameName || ""} ` : source === "all" ? "" : `${source} `}clip${data.total === 1 ? "" : "s"}`}
          </p>
        </div>
      </div>
      <QueryTabs value={source} options={SOURCE_TABS} hrefFor={(next) => hrefFor({ source: next, page: 1 })} />
      <ErrorBanner message={error} />
      {loading && data.clips.length === 0 ? (
        <Loader label="Loading clips..." />
      ) : data.clips.length === 0 ? (
        <EmptyState title="No clips for this filter" body="Try another tab, or wait for the next clip from this channel." />
      ) : (
        <div className="grid">
          {data.clips.map((clip) => (
            <ClipCard key={clip.id} clip={clip} />
          ))}
        </div>
      )}
      <QueryPager page={page} pageSize={PAGE_SIZE} total={data.total} hrefFor={(nextPage) => hrefFor({ page: nextPage })} />
    </>
  );
}
