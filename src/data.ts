import { api } from "./api";
import { PAGE_SIZE } from "./components/Cards";
import type { HomeFilters } from "./query";

export function getPublicClip(id: number) {
  return api.publicClip(id);
}

export function getChannelClips(
  ytChannelId: string,
  page: number,
  source: HomeFilters["source"] | "all",
  gameId: number | string
) {
  return api.channelClips(ytChannelId, PAGE_SIZE, (page - 1) * PAGE_SIZE, { source, gameId });
}

export function getPublicUser(id: number) {
  return api.publicUser(id);
}

export function getUserClips(
  id: number,
  page: number,
  provider: HomeFilters["provider"],
  source: HomeFilters["source"],
  gameId: number | string
) {
  return api.userClips(id, PAGE_SIZE, (page - 1) * PAGE_SIZE, { provider, source, gameId });
}

export async function loadHome(filters: HomeFilters) {
  const offset = (filters.page - 1) * PAGE_SIZE;
  const listFilters = {
    provider: filters.provider,
    source: filters.source,
    q: filters.q,
    gameId: filters.gameId || undefined,
    sort: filters.sort,
    dir: filters.dir,
  };
  const [gamesRes, listRes] = await Promise.all([
    api.publicGames({ provider: filters.provider, source: filters.source }).catch(() => ({ games: [] })),
    filters.view === "users"
      ? api.publicUsers(PAGE_SIZE, offset, listFilters)
      : api.publicChannels(PAGE_SIZE, offset, listFilters),
  ]);
  return {
    games: gamesRes.games,
    channels: "channels" in listRes ? listRes.channels : [],
    users: "users" in listRes ? listRes.users : [],
    total: listRes.total,
  };
}
