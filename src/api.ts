import { API_URL as ENV_API_URL } from "./env";
import type {
  Channel,
  ChannelSort,
  Clip,
  ClipProviderFilter,
  ClipSourceFilter,
  Game,
  LinkedAccount,
  PublicCreator,
  User,
} from "./types";

export const API_URL = ENV_API_URL;
const TOKEN_KEY = "streamclip_token";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

function qs(params: Record<string, string | number | undefined | null>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "" || value === "all") continue;
    search.set(key, String(value));
  }
  const serialized = search.toString();
  return serialized ? `?${serialized}` : "";
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_URL}${path}`, {
    cache: typeof window === "undefined" ? "force-cache" : "no-store",
    ...options,
    headers,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || `Request failed (${res.status})`);
  }
  return data as T;
}

export type ListQuery = {
  limit?: number;
  offset?: number;
  provider?: ClipProviderFilter | LinkedAccount["provider"];
  source?: ClipSourceFilter | Clip["source"];
  q?: string;
  gameId?: number | string;
  sort?: ChannelSort;
  dir?: "asc" | "desc";
};

export const api = {
  loginWithGoogle: (accessToken: string) =>
    request<{ token: string; user: User }>("/auth/google", {
      method: "POST",
      body: JSON.stringify({ accessToken }),
    }),
  me: () => request<{ user: User }>("/me"),
  myChannels: (limit = 20, offset = 0, provider?: LinkedAccount["provider"]) =>
    request<{ channels: Channel[]; total: number; limit: number; offset: number }>(
      `/me/channels${qs({ limit, offset, provider })}`
    ),
  linkChannel: (ytChannelId: string) =>
    request<{ channel: Channel }>("/me/channels", {
      method: "POST",
      body: JSON.stringify({ ytChannelId }),
    }),
  saveWebhook: (ytChannelId: string, webhookUrl: string | null) =>
    request<{ channel: Channel }>(`/me/channels/${encodeURIComponent(ytChannelId)}/webhook`, {
      method: "PUT",
      body: JSON.stringify({ webhookUrl }),
    }),
  myAccounts: (limit = 20, offset = 0, provider?: LinkedAccount["provider"]) =>
    request<{ accounts: LinkedAccount[]; total: number; limit: number; offset: number }>(
      `/me/accounts${qs({ limit, offset, provider })}`
    ),
  connectYoutube: (body: { accessToken?: string; code?: string }) =>
    request<{ youtubeChannels: User["googleYoutubeChannels"] }>("/me/accounts/youtube", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  startYoutubeOAuth: () => request<{ url: string }>("/me/accounts/youtube/start"),
  completeYoutubeOAuth: (code: string, state: string) =>
    request<{ youtubeChannels: User["googleYoutubeChannels"] }>("/me/accounts/youtube/callback", {
      method: "POST",
      body: JSON.stringify({ code, state }),
    }),
  startTwitchOAuth: () => request<{ url: string }>("/me/accounts/twitch/start"),
  completeTwitchOAuth: (code: string, state: string) =>
    request<{ account: LinkedAccount }>("/me/accounts/twitch/callback", {
      method: "POST",
      body: JSON.stringify({ code, state }),
    }),
  linkTwitch: (username: string) =>
    request<{ account: LinkedAccount }>("/me/accounts/twitch", {
      method: "POST",
      body: JSON.stringify({ username }),
    }),
  saveAccountWebhook: (id: number, webhookUrl: string | null) =>
    request<{ account: LinkedAccount }>(`/me/accounts/${id}/webhook`, {
      method: "PUT",
      body: JSON.stringify({ webhookUrl }),
    }),
  startKickOAuth: () => request<{ url: string }>("/me/accounts/kick/start"),
  completeKickOAuth: (code: string, state: string) =>
    request<{ account: LinkedAccount }>("/me/accounts/kick/callback", {
      method: "POST",
      body: JSON.stringify({ code, state }),
    }),
  linkKick: (username: string) =>
    request<{ account: LinkedAccount }>("/me/accounts/kick", {
      method: "POST",
      body: JSON.stringify({ username }),
    }),
  unlinkAccount: (id: number) =>
    request<{ message: string }>(`/me/accounts/${id}`, { method: "DELETE" }),
  unlinkYoutubeChannel: (ytChannelId: string) =>
    request<{ message: string }>(`/me/channels/${encodeURIComponent(ytChannelId)}`, { method: "DELETE" }),
  myClips: (limit = 12, offset = 0, filters: Pick<ListQuery, "provider" | "source"> = {}) =>
    request<{ clips: Clip[]; total: number; limit: number; offset: number }>(
      `/me/clips${qs({ limit, offset, ...filters })}`
    ),
  publicChannels: (limit = 12, offset = 0, filters: Omit<ListQuery, "limit" | "offset"> = {}) =>
    request<{ channels: Channel[]; total: number; limit: number; offset: number }>(
      `/channels${qs({ limit, offset, ...filters })}`
    ),
  publicUsers: (limit = 12, offset = 0, filters: Omit<ListQuery, "limit" | "offset"> = {}) =>
    request<{ users: PublicCreator[]; total: number; limit: number; offset: number }>(
      `/users${qs({ limit, offset, ...filters })}`
    ),
  publicGames: (filters: Pick<ListQuery, "provider" | "source"> = {}) =>
    request<{ games: Game[] }>(`/games${qs(filters)}`),
  publicUser: (id: number) =>
    request<{ user: PublicCreator; channels: Channel[] }>(`/users/${id}`),
  userClips: (id: number, limit = 12, offset = 0, filters: Pick<ListQuery, "provider" | "source" | "gameId"> = {}) =>
    request<{ user: PublicCreator; clips: Clip[]; total: number; limit: number; offset: number }>(
      `/users/${id}/clips${qs({ limit, offset, ...filters })}`
    ),
  channelClips: (ytChannelId: string, limit = 12, offset = 0, filters: Pick<ListQuery, "source" | "gameId"> = {}) =>
    request<{ channel: Channel; clips: Clip[]; total: number; limit: number; offset: number }>(
      `/channels/${encodeURIComponent(ytChannelId)}/clips${qs({ limit, offset, ...filters })}`
    ),
  publicClip: (id: number) =>
    request<{ clip: Clip; prevId: number | null; nextId: number | null }>(`/clips/${id}`),
};
