import { DISCORD_SUPPORT_SERVER_URL as ENV_DISCORD_URL } from "../env";

export const DISCORD_SUPPORT_SERVER_URL = ENV_DISCORD_URL;

export function DiscordIcon() {
  return (
    <svg className="discord-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.1 16.1 0 0 0-4.8 0 12.6 12.6 0 0 0-.53-1.09A.1.1 0 0 0 9 4c-1.5.26-2.94.71-4.27 1.33a.09.09 0 0 0-.04.04C.53 9.7-.32 13.9.1 18.05a.1.1 0 0 0 .04.07 19.8 19.8 0 0 0 5.96 3.03.1.1 0 0 0 .12-.04c.46-.63.87-1.3 1.22-2a.1.1 0 0 0-.05-.14 13.1 13.1 0 0 1-1.87-.9.1.1 0 0 1 0-.17l.38-.3a.1.1 0 0 1 .1 0 14.2 14.2 0 0 0 12.06 0 .1.1 0 0 1 .1 0l.39.3a.1.1 0 0 1 0 .17 12.3 12.3 0 0 1-1.88.9.1.1 0 0 0-.05.14c.36.7.77 1.37 1.22 2a.1.1 0 0 0 .12.04 19.7 19.7 0 0 0 5.97-3.03.1.1 0 0 0 .04-.07c.5-4.79-.83-8.96-3.55-12.68a.07.07 0 0 0-.03-.04ZM8.52 15.33c-1.18 0-2.16-1.08-2.16-2.42s.96-2.42 2.16-2.42 2.18 1.1 2.16 2.42c0 1.34-.96 2.42-2.16 2.42Zm6.97 0c-1.18 0-2.16-1.08-2.16-2.42s.96-2.42 2.16-2.42 2.18 1.1 2.16 2.42c0 1.34-.95 2.42-2.16 2.42Z"
      />
    </svg>
  );
}

export function JoinDiscordButton() {
  if (!DISCORD_SUPPORT_SERVER_URL) return null;
  return (
    <a
      className="discord-join"
      href={DISCORD_SUPPORT_SERVER_URL}
      target="_blank"
      rel="noreferrer"
    >
      <DiscordIcon />
      <span className="discord-join-text">
        <span className="discord-join-full">Join Discord</span>
        <span className="discord-join-short">Join</span>
      </span>
    </a>
  );
}
