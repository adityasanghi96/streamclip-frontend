export type GoogleYoutubeChannel = {
  id: string;
  name: string;
  imageUrl: string;
  handle?: string;
  hasAccess?: boolean;
};

export type User = {
  id: number;
  email: string;
  name: string;
  picture: string | null;
  googleYoutubeChannels: GoogleYoutubeChannel[];
};

export type Channel = {
  id: number;
  ytChannelId: string;
  provider?: string;
  name: string;
  imageUrl: string;
  handle: string | null;
  profileUrl: string | null;
  createdAt: string;
  clipCount?: number;
  lastClipAt?: string;
  firstClipAt?: string;
  followerCount?: number | null;
  discordWebhookUrl?: string | null;
};

export type Game = {
  id: number;
  slug: string;
  name: string;
  imageUrl: string | null;
  clipCount?: number;
};

export type ChannelSort = "latestClip" | "firstClip" | "clipCount" | "alphabetical" | "subCount";

export type LinkedAccount = {
  id: number;
  provider: "youtube" | "twitch" | "kick";
  externalId: string;
  name: string;
  handle: string | null;
  imageUrl: string | null;
  profileUrl: string | null;
  discordWebhookUrl?: string | null;
  createdAt: string;
};

export type Clip = {
  id: number;
  provider: string;
  source?: "native" | "nightbot";
  chatId: string;
  clipName: string;
  liveVideoId: string;
  offsetSeconds: string;
  clippedBy: string;
  thumbnailUrl: string | null;
  createdAt: string;
  youtubeUrl: string;
  gameId?: number | null;
  gameSlug?: string | null;
  gameName?: string | null;
  channel: Channel | null;
};

export type PublicCreator = {
  id: number;
  name: string;
  picture: string | null;
  clipCount?: number;
  lastClipAt?: string;
  providers?: string[];
};

export type ClipSourceFilter = "all" | "native" | "nightbot";
export type ClipProviderFilter = "all" | "youtube" | "twitch" | "kick";
