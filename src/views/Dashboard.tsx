"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_URL, api } from "../api";
import { useAuth } from "../auth";
import { Loader } from "../components/Brand";
import {
  ClipCard,
  EmptyState,
  ErrorBanner,
  PAGE_SIZE,
  Pager,
  PROVIDER_TABS,
  SOURCE_TABS,
  Tabs,
} from "../components/Cards";
import { requestYouTubeAccessToken } from "../google";
import { handleLinkConflict } from "../toast";
import type { Channel, Clip, ClipProviderFilter, ClipSourceFilter, LinkedAccount } from "../types";

const SETUP_PAGE = 5;

type NightbotCopyKind = "command" | "add" | "edit";

function nightbotCommand(provider: "youtube" | "twitch" | "kick", channelId: string) {
  return `$(urlfetch ${API_URL}/clip/${provider}/${channelId}/$(user)/$(1:clip)?user=$(user))`;
}

function nightbotChatCommand(
  kind: NightbotCopyKind,
  provider: "youtube" | "twitch" | "kick",
  channelId: string
) {
  const command = nightbotCommand(provider, channelId);
  if (kind === "add") return `!addcom !clip ${command}`;
  if (kind === "edit") return `!editcom !clip ${command}`;
  return command;
}

function copyKey(provider: string, channelId: string, kind: NightbotCopyKind = "command") {
  return kind === "command" ? `${provider}:${channelId}` : `${provider}:${channelId}:${kind}`;
}

export function Dashboard() {
  const { user, loading, refresh } = useAuth();
  const router = useRouter();
  const [linked, setLinked] = useState<Channel[]>([]);
  const [twitchAccounts, setTwitchAccounts] = useState<LinkedAccount[]>([]);
  const [kickAccounts, setKickAccounts] = useState<LinkedAccount[]>([]);
  const [twitchTotal, setTwitchTotal] = useState(0);
  const [kickTotal, setKickTotal] = useState(0);
  const [clips, setClips] = useState<Clip[]>([]);
  const [clipTotal, setClipTotal] = useState(0);
  const [clipSource, setClipSource] = useState<ClipSourceFilter>("all");
  const [clipProvider, setClipProvider] = useState<ClipProviderFilter>("all");
  const [clipPage, setClipPage] = useState(1);
  const [ytPage, setYtPage] = useState(1);
  const [twitchPage, setTwitchPage] = useState(1);
  const [kickPage, setKickPage] = useState(1);
  const [clipsLoading, setClipsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [webhooks, setWebhooks] = useState<Record<string, string>>({});
  const [accountWebhooks, setAccountWebhooks] = useState<Record<number, string>>({});

  const youtubeChannelCards = useMemo(() => {
    const byId = new Map<
      string,
      { id: string; name: string; imageUrl: string; handle?: string | null; linked?: Channel }
    >();
    for (const channel of user?.googleYoutubeChannels ?? []) {
      byId.set(channel.id, {
        id: channel.id,
        name: channel.name,
        imageUrl: channel.imageUrl,
        handle: channel.handle,
      });
    }
    for (const channel of linked) {
      if ((channel.provider || "youtube") !== "youtube") continue;
      const existing = byId.get(channel.ytChannelId);
      byId.set(channel.ytChannelId, {
        id: channel.ytChannelId,
        name: channel.name || existing?.name || "",
        imageUrl: channel.imageUrl || existing?.imageUrl || "",
        handle: channel.handle || existing?.handle,
        linked: channel,
      });
    }
    return [...byId.values()];
  }, [user, linked]);
  const youtubeVisible = youtubeChannelCards.slice((ytPage - 1) * SETUP_PAGE, ytPage * SETUP_PAGE);

  async function loadLinked() {
    const channelsRes = await api.myChannels(100, 0);
    setLinked(channelsRes.channels);
    setWebhooks(
      Object.fromEntries(channelsRes.channels.map((c) => [c.ytChannelId, c.discordWebhookUrl || ""]))
    );
  }

  async function loadTwitch(page = twitchPage) {
    const res = await api.myAccounts(SETUP_PAGE, (page - 1) * SETUP_PAGE, "twitch");
    if (res.accounts.length === 0 && page > 1) {
      setTwitchPage(page - 1);
      return;
    }
    setTwitchAccounts(res.accounts);
    setTwitchTotal(res.total);
    setAccountWebhooks((prev) => ({
      ...prev,
      ...Object.fromEntries(res.accounts.map((account) => [account.id, account.discordWebhookUrl || ""])),
    }));
  }

  async function loadKick(page = kickPage) {
    const res = await api.myAccounts(SETUP_PAGE, (page - 1) * SETUP_PAGE, "kick");
    if (res.accounts.length === 0 && page > 1) {
      setKickPage(page - 1);
      return;
    }
    setKickAccounts(res.accounts);
    setKickTotal(res.total);
    setAccountWebhooks((prev) => ({
      ...prev,
      ...Object.fromEntries(res.accounts.map((account) => [account.id, account.discordWebhookUrl || ""])),
    }));
  }

  async function loadClips(
    page = clipPage,
    source: ClipSourceFilter = clipSource,
    provider: ClipProviderFilter = clipProvider
  ) {
    setClipsLoading(true);
    try {
      const clipsRes = await api.myClips(PAGE_SIZE, (page - 1) * PAGE_SIZE, { source, provider });
      setClips(clipsRes.clips);
      setClipTotal(clipsRes.total);
    } finally {
      setClipsLoading(false);
    }
  }

  async function load() {
    await Promise.all([loadLinked(), loadTwitch(), loadKick(), loadClips()]);
  }

  useEffect(() => {
    if (!user) return;
    void loadLinked().catch((err) => setError(err instanceof Error ? err.message : "Could not load dashboard"));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    void loadTwitch(twitchPage).catch((err) => setError(err instanceof Error ? err.message : "Could not load Twitch"));
  }, [user, twitchPage]);

  useEffect(() => {
    if (!user) return;
    void loadKick(kickPage).catch((err) => setError(err instanceof Error ? err.message : "Could not load Kick"));
  }, [user, kickPage]);

  useEffect(() => {
    if (!user) return;
    void loadClips(clipPage, clipSource, clipProvider).catch((err) =>
      setError(err instanceof Error ? err.message : "Could not load clips")
    );
  }, [user, clipPage, clipSource, clipProvider]);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) return <Loader label={loading ? "Loading dashboard..." : "Redirecting..."} />;
  const email = user.email;

  async function copyCommand(
    provider: "youtube" | "twitch" | "kick",
    channelId: string,
    kind: NightbotCopyKind = "command"
  ) {
    const text = nightbotChatCommand(kind, provider, channelId);
    await navigator.clipboard.writeText(text);
    const token = copyKey(provider, channelId, kind);
    setCopied(token);
    window.setTimeout(() => setCopied((current) => (current === token ? null : current)), 2000);
  }

  async function connectYoutube() {
    setError(null);
    setBusyId("youtube");
    try {
      const accessToken = await requestYouTubeAccessToken(email);
      await api.connectYoutube({ accessToken });
      await refresh();
      await load();
    } catch (err) {
      handleLinkConflict(err, (message) => setError(message || "Could not start YouTube login"));
    } finally {
      setBusyId(null);
    }
  }

  async function linkChannel(ytChannelId: string) {
    setError(null);
    setBusyId(ytChannelId);
    try {
      await api.linkChannel(ytChannelId);
      await load();
    } catch (err) {
      handleLinkConflict(err, (message) => setError(message || "Could not link channel"));
    } finally {
      setBusyId(null);
    }
  }

  async function connectTwitch() {
    setError(null);
    setBusyId("twitch-oauth");
    try {
      const { url } = await api.startTwitchOAuth();
      window.location.href = url;
    } catch (err) {
      handleLinkConflict(err, (message) => setError(message || "Could not start Twitch login"));
      setBusyId(null);
    }
  }

  async function connectKick() {
    setError(null);
    setBusyId("kick-oauth");
    try {
      const { url } = await api.startKickOAuth();
      window.location.href = url;
    } catch (err) {
      handleLinkConflict(err, (message) => setError(message || "Could not start Kick login"));
      setBusyId(null);
    }
  }

  async function unlinkYoutube(ytChannelId: string) {
    setError(null);
    setBusyId(`unlink-yt-${ytChannelId}`);
    try {
      await api.unlinkYoutubeChannel(ytChannelId);
      await refresh();
      await loadLinked();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not unlink YouTube channel");
    } finally {
      setBusyId(null);
    }
  }

  async function unlink(id: number) {
    setError(null);
    setBusyId(`unlink-${id}`);
    try {
      await api.unlinkAccount(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not unlink account");
    } finally {
      setBusyId(null);
    }
  }

  async function saveWebhook(event: FormEvent, ytChannelId: string) {
    event.preventDefault();
    setError(null);
    setBusyId(ytChannelId);
    try {
      const value = (webhooks[ytChannelId] || "").trim();
      await api.saveWebhook(ytChannelId, value || null);
      await loadLinked();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save webhook");
    } finally {
      setBusyId(null);
    }
  }

  async function saveAccountWebhook(event: FormEvent, accountId: number) {
    event.preventDefault();
    setError(null);
    setBusyId(`account-webhook-${accountId}`);
    try {
      const value = (accountWebhooks[accountId] || "").trim();
      await api.saveAccountWebhook(accountId, value || null);
      const account = [...twitchAccounts, ...kickAccounts].find((item) => item.id === accountId);
      if (account?.provider === "twitch") await loadTwitch();
      else if (account?.provider === "kick") await loadKick();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save webhook");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section>
      <div className="hero">
        <h1>Dashboard</h1>
        <p className="muted">Signed in as {user.name} ({user.email})</p>
      </div>
      <ErrorBanner message={error} />

      <h2>YouTube</h2>
      <p className="muted">
        Native clips from the YouTube Clip button are imported automatically. Chat can also use Nightbot <code>!clip</code>. New clips are posted to the Stream Clip Discord; add your own webhook if you also want them in your server.
      </p>
      <button className="btn" disabled={busyId === "youtube"} onClick={() => void connectYoutube()}>
        {busyId === "youtube"
          ? "Connecting..."
          : youtubeChannelCards.length
            ? "Connect another YouTube account"
            : "Connect YouTube"}
      </button>
      {youtubeChannelCards.length === 0 ? (
        <EmptyState title="No YouTube channels yet" body="Connect a YouTube account to see each channel’s clip command and Discord webhook here." />
      ) : (
        <div className="stack">
          {youtubeVisible.map((channel) => (
            <YoutubeChannelCard
              key={channel.id}
              channel={channel}
              webhook={webhooks[channel.id] || ""}
              copied={copied}
              busy={busyId === channel.id || busyId === `unlink-yt-${channel.id}`}
              onWebhookChange={(value) =>
                setWebhooks((prev) => ({ ...prev, [channel.id]: value }))
              }
              onCopy={(kind) => void copyCommand("youtube", channel.id, kind)}
              onLink={() => void linkChannel(channel.id)}
              onUnlink={() => void unlinkYoutube(channel.id)}
              onSaveWebhook={(event) => void saveWebhook(event, channel.id)}
              onRemoveWebhook={() => {
                setWebhooks((prev) => ({ ...prev, [channel.id]: "" }));
                void api.saveWebhook(channel.id, null).then(loadLinked).catch((err) => {
                  setError(err instanceof Error ? err.message : "Could not remove webhook");
                });
              }}
            />
          ))}
          <Pager page={ytPage} pageSize={SETUP_PAGE} total={youtubeChannelCards.length} onPage={setYtPage} />
        </div>
      )}

      <h2>Kick</h2>
      <p className="muted">
        Native clips from Kick’s <code>/clip</code> or Clip button are imported automatically. Chat can also use Nightbot <code>!clip</code>. New clips are posted to the Stream Clip Discord; add your own webhook if you also want them in your server.
      </p>
      <button className="btn" disabled={busyId === "kick-oauth"} onClick={() => void connectKick()}>
        {busyId === "kick-oauth"
          ? "Redirecting..."
          : kickTotal
            ? "Connect another Kick account"
            : "Connect Kick"}
      </button>
      {kickTotal > 0 && (
        <div className="stack">
          {kickAccounts.map((account) => (
            <PlatformAccountCard
              key={account.id}
              account={account}
              webhook={accountWebhooks[account.id] || ""}
              copied={copied}
              busy={busyId === `account-webhook-${account.id}` || busyId === `unlink-${account.id}`}
              onCopy={(kind) => void copyCommand("kick", account.externalId, kind)}
              onWebhookChange={(value) =>
                setAccountWebhooks((prev) => ({ ...prev, [account.id]: value }))
              }
              onSaveWebhook={(event) => void saveAccountWebhook(event, account.id)}
              onRemoveWebhook={() => {
                setAccountWebhooks((prev) => ({ ...prev, [account.id]: "" }));
                void api.saveAccountWebhook(account.id, null).then(() => loadKick()).catch((err) => {
                  setError(err instanceof Error ? err.message : "Could not remove webhook");
                });
              }}
              onUnlink={() => void unlink(account.id)}
            />
          ))}
          <Pager page={kickPage} pageSize={SETUP_PAGE} total={kickTotal} onPage={setKickPage} />
        </div>
      )}

      <h2>Twitch</h2>
      <p className="muted">
        Native clips from Twitch’s Clip button are imported automatically. Chat can also use Nightbot <code>!clip</code> after you connect Twitch. New clips are posted to the Stream Clip Discord; add your own webhook if you also want them in your server.
      </p>
      <button className="btn" disabled={busyId === "twitch-oauth"} onClick={() => void connectTwitch()}>
        {busyId === "twitch-oauth"
          ? "Redirecting..."
          : twitchTotal
            ? "Connect another Twitch account"
            : "Connect Twitch"}
      </button>
      {twitchTotal > 0 && (
        <div className="stack">
          {twitchAccounts.map((account) => (
            <PlatformAccountCard
              key={account.id}
              account={account}
              webhook={accountWebhooks[account.id] || ""}
              copied={copied}
              busy={busyId === `account-webhook-${account.id}` || busyId === `unlink-${account.id}`}
              onCopy={(kind) => void copyCommand("twitch", account.externalId, kind)}
              onWebhookChange={(value) =>
                setAccountWebhooks((prev) => ({ ...prev, [account.id]: value }))
              }
              onSaveWebhook={(event) => void saveAccountWebhook(event, account.id)}
              onRemoveWebhook={() => {
                setAccountWebhooks((prev) => ({ ...prev, [account.id]: "" }));
                void api.saveAccountWebhook(account.id, null).then(() => loadTwitch()).catch((err) => {
                  setError(err instanceof Error ? err.message : "Could not remove webhook");
                });
              }}
              onUnlink={() => void unlink(account.id)}
            />
          ))}
          <Pager page={twitchPage} pageSize={SETUP_PAGE} total={twitchTotal} onPage={setTwitchPage} />
        </div>
      )}

      <h2>Your clips</h2>
      <Tabs
        value={clipProvider}
        options={PROVIDER_TABS}
        onChange={(next) => {
          setClipProvider(next);
          setClipPage(1);
        }}
      />
      <Tabs
        value={clipSource}
        options={SOURCE_TABS}
        onChange={(next) => {
          setClipSource(next);
          setClipPage(1);
        }}
      />
      {clipsLoading && clips.length === 0 ? (
        <Loader label="Loading clips..." />
      ) : clips.length === 0 ? (
        <EmptyState title="No clips for this filter" body="Clips appear from Nightbot !clip and from each platform’s native Clip button." />
      ) : (
        <div className="grid">
          {clips.map((clip) => (
            <ClipCard key={clip.id} clip={clip} />
          ))}
        </div>
      )}
      <Pager
        page={clipPage}
        pageSize={PAGE_SIZE}
        total={clipTotal}
        disabled={clipsLoading}
        onPage={setClipPage}
      />
    </section>
  );
}

function youtubeOpenUrl(channel: { id: string; handle?: string | null; linked?: Channel }) {
  if (channel.linked?.profileUrl) return channel.linked.profileUrl;
  if (channel.handle) {
    const handle = channel.handle.startsWith("@") ? channel.handle : `@${channel.handle}`;
    return `https://www.youtube.com/${handle}`;
  }
  return `https://www.youtube.com/channel/${channel.id}`;
}

function YoutubeChannelCard({
  channel,
  webhook,
  copied,
  busy,
  onWebhookChange,
  onCopy,
  onLink,
  onUnlink,
  onSaveWebhook,
  onRemoveWebhook,
}: {
  channel: { id: string; name: string; imageUrl: string; handle?: string | null; linked?: Channel };
  webhook: string;
  copied: string | null;
  busy: boolean;
  onWebhookChange: (value: string) => void;
  onCopy: (kind: NightbotCopyKind) => void;
  onLink: () => void;
  onUnlink: () => void;
  onSaveWebhook: (event: FormEvent) => void;
  onRemoveWebhook: () => void;
}) {
  return (
    <div className="card channel-setup">
      <div className="row">
        <img src={channel.imageUrl} alt="" className="channel-image" referrerPolicy="no-referrer" />
        <div className="grow">
          <h3>{channel.name}</h3>
          <p className="muted">{channel.handle || channel.id}</p>
        </div>
        {channel.linked ? (
          <Link href={`/channel/${channel.id}`}>View clips</Link>
        ) : (
          <button className="btn" disabled={busy} onClick={onLink}>
            {busy ? "Linking..." : "Link"}
          </button>
        )}
        <a href={youtubeOpenUrl(channel)} target="_blank" rel="noreferrer">
          Open
        </a>
        <button type="button" className="btn secondary" disabled={busy} onClick={onUnlink}>
          Unlink
        </button>
      </div>

      <NightbotCommandBox
        provider="youtube"
        channelId={channel.id}
        copied={copied}
        onCopy={onCopy}
      />

      {channel.linked ? (
        <form onSubmit={onSaveWebhook}>
          <label>
            Discord webhook
            <input
              value={webhook}
              onChange={(event) => onWebhookChange(event.target.value)}
              placeholder="https://discord.com/api/webhooks/..."
            />
          </label>
          <div className="row">
            <button className="btn" disabled={busy}>
              {busy ? "Saving..." : "Save webhook"}
            </button>
            <button type="button" className="btn secondary" disabled={busy} onClick={onRemoveWebhook}>
              Remove
            </button>
          </div>
        </form>
      ) : (
        <p className="muted">Link this channel to save a Discord webhook.</p>
      )}
    </div>
  );
}

function NightbotCommandBox({
  provider,
  channelId,
  copied,
  onCopy,
}: {
  provider: "youtube" | "twitch" | "kick";
  channelId: string;
  copied: string | null;
  onCopy: (kind: NightbotCopyKind) => void;
}) {
  return (
    <div className="command-box">
      <div className="row wrap">
        <span className="muted">Nightbot !clip</span>
        <button type="button" className="btn secondary" onClick={() => onCopy("command")}>
          {copied === copyKey(provider, channelId) ? "Copied" : "Copy command"}
        </button>
        <button type="button" className="btn secondary" onClick={() => onCopy("add")}>
          {copied === copyKey(provider, channelId, "add") ? "Copied" : "Add command"}
        </button>
        <button type="button" className="btn secondary" onClick={() => onCopy("edit")}>
          {copied === copyKey(provider, channelId, "edit") ? "Copied" : "Edit command"}
        </button>
      </div>
      <p className="meta">Paste Add command or Edit command in chat, then press Enter.</p>
      <code>{nightbotCommand(provider, channelId)}</code>
    </div>
  );
}

function PlatformAccountCard({
  account,
  webhook,
  copied,
  busy,
  onCopy,
  onWebhookChange,
  onSaveWebhook,
  onRemoveWebhook,
  onUnlink,
}: {
  account: LinkedAccount;
  webhook: string;
  copied: string | null;
  busy: boolean;
  onCopy: (kind: NightbotCopyKind) => void;
  onWebhookChange: (value: string) => void;
  onSaveWebhook: (event: FormEvent) => void;
  onRemoveWebhook: () => void;
  onUnlink: () => void;
}) {
  return (
    <div className="card channel-setup">
      <div className="row">
        {account.imageUrl ? (
          <img src={account.imageUrl} alt="" className="channel-image" referrerPolicy="no-referrer" />
        ) : (
          <div className="channel-image" />
        )}
        <div className="grow">
          <h3>{account.name}</h3>
          <p className="muted">{account.handle || account.externalId}</p>
        </div>
        {account.profileUrl && (
          <a href={account.profileUrl} target="_blank" rel="noreferrer">Open</a>
        )}
        <button type="button" className="btn secondary" disabled={busy} onClick={onUnlink}>
          Unlink
        </button>
      </div>
      <NightbotCommandBox
        provider={account.provider === "kick" ? "kick" : "twitch"}
        channelId={account.externalId}
        copied={copied}
        onCopy={onCopy}
      />
      <form onSubmit={onSaveWebhook}>
        <label>
          Discord webhook
          <input
            value={webhook}
            onChange={(event) => onWebhookChange(event.target.value)}
            placeholder="https://discord.com/api/webhooks/..."
          />
        </label>
        <div className="row">
          <button className="btn" disabled={busy}>
            {busy ? "Saving..." : "Save webhook"}
          </button>
          <button type="button" className="btn secondary" disabled={busy} onClick={onRemoveWebhook}>
            Remove
          </button>
        </div>
      </form>
    </div>
  );
}
