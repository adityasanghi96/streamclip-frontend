"use client";

import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-youtube";
import type { Clip } from "../types";
import { providerLabel } from "./Cards";

function twitchParents() {
  const host = window.location.hostname;
  return [...new Set([host, "localhost", "127.0.0.1"])]
    .map((parent) => `parent=${encodeURIComponent(parent)}`)
    .join("&");
}

function kickSlug(clip: Clip) {
  return (clip.channel?.handle || "").replace(/^@/, "");
}

function youtubeSrc(clip: Clip) {
  const start = Number(clip.offsetSeconds) || 0;
  if (clip.source === "native" && clip.liveVideoId.startsWith("Ug")) {
    return `https://www.youtube.com/clip/${clip.liveVideoId}`;
  }
  return `https://www.youtube.com/watch?v=${clip.liveVideoId}${start > 0 ? `&t=${start}s` : ""}`;
}

function YoutubePlayer({ clip }: { clip: Clip }) {
  const holderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const holder = holderRef.current;
    if (!holder) return;

    const video = document.createElement("video");
    video.className = "video-js vjs-big-play-centered";
    video.setAttribute("playsinline", "true");
    holder.replaceChildren(video);

    const start = Number(clip.offsetSeconds) || 0;
    const player = videojs(video, {
      controls: true,
      autoplay: false,
      preload: "auto",
      fluid: false,
      fill: true,
      techOrder: ["youtube", "html5"],
      sources: [{ type: "video/youtube", src: youtubeSrc(clip) }],
      youtube: {
        modestbranding: 1,
        rel: 0,
        iv_load_policy: 3,
        playsinline: 1,
      },
    });

    if (start > 0 && !clip.liveVideoId.startsWith("Ug")) {
      player.one("playing", () => {
        if (Math.abs((player.currentTime() || 0) - start) > 2) player.currentTime(start);
      });
    }

    return () => {
      player.dispose();
    };
  }, [clip.id, clip.liveVideoId, clip.offsetSeconds, clip.source]);

  return <div className="player-wrap" ref={holderRef} />;
}

function EmbedPlayer({ src, title }: { src: string; title: string }) {
  return (
    <div className="player-wrap">
      <iframe
        src={src}
        title={title}
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        allowFullScreen
      />
    </div>
  );
}

export function ClipPlayer({ clip }: { clip: Clip }) {
  if (clip.provider === "twitch") {
    return (
      <EmbedPlayer
        title={clip.clipName}
        src={`https://clips.twitch.tv/embed?clip=${encodeURIComponent(clip.liveVideoId)}&${twitchParents()}&autoplay=true`}
      />
    );
  }

  if (clip.provider === "kick") {
    const slug = kickSlug(clip);
    if (!slug) {
      return (
        <div className="player-wrap player-fallback">
          <p className="muted">Open this clip on {providerLabel(clip.provider)} to watch it.</p>
        </div>
      );
    }
    const src =
      clip.source === "native"
        ? `https://player.kick.com/${encodeURIComponent(slug)}?clip=${encodeURIComponent(clip.liveVideoId)}&autoplay=true`
        : `https://player.kick.com/${encodeURIComponent(slug)}?autoplay=true`;
    return <EmbedPlayer title={clip.clipName} src={src} />;
  }

  return <YoutubePlayer clip={clip} />;
}
