"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { loadHome } from "../data";
import { homeHref, parseHomeFiltersFromSearch } from "../query";
import type { Channel, Game, PublicCreator } from "../types";
import {
  ChannelCard,
  EmptyState,
  ErrorBanner,
  PAGE_SIZE,
  PROVIDER_TABS,
  QueryPager,
  QueryTabs,
  SOURCE_TABS,
  UserCard,
} from "./Cards";
import { HomeDiscover } from "./HomeDiscover";
import { Loader } from "./Brand";

type HomeData = {
  games: Game[];
  channels: Channel[];
  users: PublicCreator[];
  total: number;
};

export function HomeCatalog({ initial }: { initial: HomeData }) {
  const searchParams = useSearchParams();
  const filters = parseHomeFiltersFromSearch(searchParams);
  const [data, setData] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const queryKey = homeHref(filters);

  useEffect(() => {
    if (queryKey === "/") {
      setData(initial);
      setError(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    loadHome(filters)
      .then((next) => {
        if (!cancelled) {
          setData(next);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load clips");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [queryKey, initial]);

  return (
    <>
      <HomeDiscover filters={filters} games={data.games} />
      <QueryTabs
        value={filters.view}
        options={[
          { id: "streamers", label: "Channels" },
          { id: "users", label: "Users" },
        ]}
        hrefFor={(view) => homeHref({ ...filters, view, page: 1 })}
      />
      <QueryTabs
        value={filters.provider}
        options={PROVIDER_TABS}
        hrefFor={(provider) => homeHref({ ...filters, provider, gameId: 0, page: 1 })}
      />
      <QueryTabs
        value={filters.source}
        options={SOURCE_TABS}
        hrefFor={(source) => homeHref({ ...filters, source, page: 1 })}
      />
      <ErrorBanner message={error} />
      {loading && data.total === 0 ? (
        <Loader label="Loading channels..." />
      ) : data.total === 0 ? (
        <EmptyState
          title={filters.view === "users" ? "No users yet" : "No channels yet"}
          body="When a stream is clipped, it will show up here for that platform, game, and clip type."
        />
      ) : filters.view === "users" ? (
        <div className="tile-grid">
          {data.users.map((user) => (
            <UserCard key={user.id} user={user} gameId={filters.gameId || undefined} />
          ))}
        </div>
      ) : (
        <div className="tile-grid">
          {data.channels.map((channel) => (
            <ChannelCard
              key={`${channel.provider}-${channel.ytChannelId}`}
              channel={channel}
              gameId={filters.gameId || undefined}
            />
          ))}
        </div>
      )}
      <QueryPager
        page={filters.page}
        pageSize={PAGE_SIZE}
        total={data.total}
        hrefFor={(page) => homeHref({ ...filters, page })}
      />
    </>
  );
}
