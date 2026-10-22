"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { formatAgo, formatOffset } from "../format";
import { showToast } from "../toast";
import type { Clip } from "../types";
import { providerLabel } from "./Cards";
import { ClipPlayer } from "./ClipPlayer";

export function ClipWatch({
  clip,
  prevId,
  nextId,
}: {
  clip: Clip;
  prevId: number | null;
  nextId: number | null;
}) {
  const router = useRouter();

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowLeft" && prevId) router.push(`/clip/${prevId}`);
      if (event.key === "ArrowRight" && nextId) router.push(`/clip/${nextId}`);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, prevId, nextId]);

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    showToast("Link copied", "ok");
  }

  return (
    <section className="watch-page">
      <div className="watch-stage">
        <button
          type="button"
          className="watch-nav"
          disabled={!prevId}
          onClick={() => prevId && router.push(`/clip/${prevId}`)}
          aria-label="Previous clip"
        >
          ‹
        </button>
        <div className="watch-hero">
          {clip.thumbnailUrl && (
            <div className="watch-hero-bg" style={{ backgroundImage: `url(${clip.thumbnailUrl})` }} />
          )}
          <ClipPlayer clip={clip} />
        </div>
        <button
          type="button"
          className="watch-nav"
          disabled={!nextId}
          onClick={() => nextId && router.push(`/clip/${nextId}`)}
          aria-label="Next clip"
        >
          ›
        </button>
      </div>

      <div className="watch-info">
        <div className="watch-toolbar">
          {clip.channel && (
            <Link href={`/channel/${clip.channel.ytChannelId}`} className="watch-channel">
              <img src={clip.channel.imageUrl} alt="" className="channel-image" referrerPolicy="no-referrer" />
              <div>
                <strong>{clip.channel.name}</strong>
                <p className="muted">
                  {providerLabel(clip.provider)}
                  {clip.channel.handle ? ` · ${clip.channel.handle}` : ""}
                </p>
              </div>
            </Link>
          )}
          <div className="watch-actions">
            <button type="button" className="btn secondary" onClick={() => void copyLink()}>
              Share
            </button>
            <a className="btn" href={clip.youtubeUrl} target="_blank" rel="noreferrer">
              Open on {providerLabel(clip.provider)}
            </a>
          </div>
        </div>
        <div className="watch-copy">
          <h1>{clip.clipName}</h1>
          <p className="meta">
            {clip.source === "native" ? "Native" : "Nightbot"}
            {clip.provider === "youtube" && clip.source !== "native" ? ` · ${formatOffset(clip.offsetSeconds)}` : ""}
            {" · Clipped by "}
            {clip.clippedBy}
            {" · "}
            {formatAgo(clip.createdAt)}
          </p>
        </div>
      </div>
      <p className="muted watch-hint">Use Previous / Next or the left and right arrow keys.</p>
    </section>
  );
}
