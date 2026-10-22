import type { ChannelSort, ClipProviderFilter, ClipSourceFilter } from "./types";

export type SearchValue = string | string[] | undefined;

export type HomeFilters = {
  view: "users" | "streamers";
  provider: ClipProviderFilter;
  source: ClipSourceFilter;
  q: string;
  sort: ChannelSort;
  dir: "asc" | "desc";
  page: number;
  gameId: number;
};

export const SORT_OPTIONS: { id: ChannelSort; label: string }[] = [
  { id: "latestClip", label: "Latest Clip Time" },
  { id: "firstClip", label: "First Clip Time" },
  { id: "clipCount", label: "Clip Count" },
  { id: "alphabetical", label: "Alphabetical" },
  { id: "subCount", label: "Sub Count" },
];

export function firstParam(value: SearchValue) {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

export function parsePage(value: SearchValue) {
  const page = Number(firstParam(value) || 1);
  return Number.isInteger(page) && page > 1 ? page : 1;
}

export function parseGameId(value: SearchValue) {
  const id = Number(firstParam(value) || 0);
  return Number.isInteger(id) && id > 0 ? id : 0;
}

export function parseProvider(value: SearchValue): ClipProviderFilter {
  const next = firstParam(value);
  return next === "youtube" || next === "twitch" || next === "kick" ? next : "all";
}

export function parseSource(value: SearchValue): ClipSourceFilter {
  const next = firstParam(value);
  return next === "native" || next === "nightbot" ? next : "all";
}

export function parseHomeFiltersFromSearch(search: URLSearchParams): HomeFilters {
  const sp: Record<string, string> = {};
  search.forEach((value, key) => {
    sp[key] = value;
  });
  return parseHomeFilters(sp);
}

export function parseHomeFilters(sp: Record<string, SearchValue>): HomeFilters {
  const sortRaw = firstParam(sp.sort) as ChannelSort;
  const sort: ChannelSort =
    sortRaw === "firstClip" ||
    sortRaw === "clipCount" ||
    sortRaw === "alphabetical" ||
    sortRaw === "subCount"
      ? sortRaw
      : "latestClip";
  const dirRaw = firstParam(sp.dir);
  return {
    view: firstParam(sp.view) === "users" ? "users" : "streamers",
    provider: parseProvider(sp.provider),
    source: parseSource(sp.source),
    q: firstParam(sp.q).trim(),
    sort,
    dir: dirRaw === "asc" ? "asc" : "desc",
    page: parsePage(sp.page),
    gameId: parseGameId(sp.gameId),
  };
}

export function hrefFromParams(path: string, params: Record<string, string | number | undefined | null>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "" || value === "all") continue;
    if (key === "page" && Number(value) <= 1) continue;
    if (key === "view" && value === "streamers") continue;
    if (key === "sort" && value === "latestClip") continue;
    if (key === "dir" && value === "desc") continue;
    if (key === "gameId" && Number(value) <= 0) continue;
    search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `${path}?${query}` : path;
}

export function homeHref(filters: HomeFilters) {
  return hrefFromParams("/", {
    view: filters.view,
    provider: filters.provider,
    source: filters.source,
    q: filters.q,
    sort: filters.sort,
    dir: filters.dir,
    page: filters.page,
    gameId: filters.gameId || undefined,
  });
}
