import Link from "next/link";
import type { Channel, Clip, ClipProviderFilter, ClipSourceFilter, PublicCreator } from "../types";
import { formatDate, formatOffset } from "../format";

export const PAGE_SIZE = 12;

export const PROVIDER_TABS: { id: ClipProviderFilter; label: string }[] = [
  { id: "all", label: "All platforms" },
  { id: "youtube", label: "YouTube" },
  { id: "twitch", label: "Twitch" },
  { id: "kick", label: "Kick" },
];

export const SOURCE_TABS: { id: ClipSourceFilter; label: string }[] = [
  { id: "all", label: "All clips" },
  { id: "native", label: "Native" },
  { id: "nightbot", label: "Nightbot" },
];

export function providerLabel(provider?: string | null) {
  if (provider === "twitch") return "Twitch";
  if (provider === "kick") return "Kick";
  return "YouTube";
}

export function ProviderIcon({ provider }: { provider?: string | null }) {
  if (provider === "twitch") {
    return (
      <svg className="provider-icon twitch" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M4 2 1 7v13h5v3h3l3-3h4l6-6V2H4zm16 11-3 3h-5l-3 3v-3H6V4h14v9z"
        />
        <path fill="currentColor" d="M14.5 7.5h2V13h-2V7.5zm-5 0h2V13h-2V7.5z" />
      </svg>
    );
  }
  if (provider === "kick") {
    return (
      <svg className="provider-icon kick" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M4 3h8v5.2L16.2 4H21l-6 6.2L21 16.5h-4.8L12 12.3V21H4V3z"
        />
      </svg>
    );
  }
  return (
    <svg className="provider-icon youtube" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8z"
      />
      <path fill="#fff" d="M9.75 15.5v-7l6.5 3.5-6.5 3.5z" />
    </svg>
  );
}

function TilePill({ providers, count }: { providers: string[]; count?: number }) {
  return (
    <span className="tile-pill">
      {(providers.length ? providers : ["youtube"]).slice(0, 3).map((provider) => (
        <ProviderIcon key={provider} provider={provider} />
      ))}
      {typeof count === "number" ? <span>{count}</span> : null}
    </span>
  );
}

export function withGame(path: string, gameId?: number | string | null) {
  const id = Number(gameId);
  if (!Number.isInteger(id) || id < 1) return path;
  return `${path}?gameId=${id}`;
}

export function ChannelCard({ channel, gameId }: { channel: Channel; gameId?: number | string }) {
  return (
    <Link href={withGame(`/channel/${channel.ytChannelId}`, gameId)} className="tile" prefetch={false}>
      <img src={channel.imageUrl} alt="" referrerPolicy="no-referrer" />
      <span className="tile-fade" />
      <TilePill providers={[channel.provider || "youtube"]} count={channel.clipCount} />
      <h3 className="tile-name">{channel.name}</h3>
    </Link>
  );
}

export function UserCard({ user, gameId }: { user: PublicCreator; gameId?: number | string }) {
  return (
    <Link href={withGame(`/user/${user.id}`, gameId)} className="tile" prefetch={false}>
      {user.picture ? (
        <img src={user.picture} alt="" referrerPolicy="no-referrer" />
      ) : (
        <span className="tile-fallback">{user.name[0]}</span>
      )}
      <span className="tile-fade" />
      <TilePill providers={user.providers || []} count={user.clipCount} />
      <h3 className="tile-name">{user.name}</h3>
    </Link>
  );
}

export function ClipCard({ clip }: { clip: Clip }) {
  return (
    <Link className="card clip-card" href={`/clip/${clip.id}`} prefetch={false}>
      <div className="clip-thumb-wrap">
        {clip.thumbnailUrl ? (
          <img src={clip.thumbnailUrl} alt="" className="clip-thumb" referrerPolicy="no-referrer" />
        ) : (
          <div className="clip-thumb placeholder" />
        )}
      </div>
      <div className="clip-card-body">
        <h3>{clip.clipName}</h3>
        <p className="muted">
          {clip.channel?.name || providerLabel(clip.provider)}
          {clip.offsetSeconds != null && clip.offsetSeconds !== ""
            ? ` · ${formatOffset(clip.offsetSeconds)}`
            : ` · ${providerLabel(clip.provider)}`}
        </p>
        <p className="meta">
          {clip.source === "native" ? "Native" : "Nightbot"} · Clipped by {clip.clippedBy} · {formatDate(clip.createdAt)}
        </p>
      </div>
    </Link>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="empty">
      <h3>{title}</h3>
      <p className="muted">{body}</p>
    </div>
  );
}

export function ErrorBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return <div className="banner error">{message}</div>;
}

export function Tabs<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { id: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="tabs" role="tablist">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          role="tab"
          className={value === option.id ? "tab active" : "tab"}
          aria-selected={value === option.id}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function Pager({
  page,
  pageSize,
  total,
  disabled,
  onPage,
}: {
  page: number;
  pageSize: number;
  total: number;
  disabled?: boolean;
  onPage: (page: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (total <= pageSize) return null;
  return (
    <div className="pager">
      <button type="button" className="btn secondary" disabled={disabled || page <= 1} onClick={() => onPage(page - 1)}>
        Previous
      </button>
      <span className="muted">
        Page {page} of {pages} · {total} total
      </span>
      <button type="button" className="btn secondary" disabled={disabled || page >= pages} onClick={() => onPage(page + 1)}>
        Next
      </button>
    </div>
  );
}

export function QueryTabs<T extends string>({
  value,
  options,
  hrefFor,
}: {
  value: T;
  options: { id: T; label: string }[];
  hrefFor: (value: T) => string;
}) {
  return (
    <div className="tabs" role="tablist">
      {options.map((option) => (
        <Link
          key={option.id}
          href={hrefFor(option.id)}
          role="tab"
          className={value === option.id ? "tab active" : "tab"}
          aria-selected={value === option.id}
          scroll={false}
        >
          {option.label}
        </Link>
      ))}
    </div>
  );
}

export function QueryPager({
  page,
  pageSize,
  total,
  hrefFor,
}: {
  page: number;
  pageSize: number;
  total: number;
  hrefFor: (page: number) => string;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (total <= pageSize) return null;
  return (
    <div className="pager">
      {page <= 1 ? (
        <span className="btn secondary" aria-disabled="true">
          Previous
        </span>
      ) : (
        <Link className="btn secondary" href={hrefFor(page - 1)}>
          Previous
        </Link>
      )}
      <span className="muted">
        Page {page} of {pages} · {total} total
      </span>
      {page >= pages ? (
        <span className="btn secondary" aria-disabled="true">
          Next
        </span>
      ) : (
        <Link className="btn secondary" href={hrefFor(page + 1)}>
          Next
        </Link>
      )}
    </div>
  );
}
