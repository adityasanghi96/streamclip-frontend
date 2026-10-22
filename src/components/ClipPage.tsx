"use client";

import { useEffect, useState } from "react";
import { getPublicClip } from "../data";
import { SITE_NAME } from "../site";
import type { Clip } from "../types";
import { Loader } from "./Brand";
import { ClipWatch } from "./ClipWatch";
import { ErrorBanner } from "./Cards";

export function ClipPage({ clipId }: { clipId: number }) {
  const [clip, setClip] = useState<Clip | null>(null);
  const [prevId, setPrevId] = useState<number | null>(null);
  const [nextId, setNextId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setClip(null);
    setError(null);
    getPublicClip(clipId)
      .then((data) => {
        if (cancelled) return;
        setClip(data.clip);
        setPrevId(data.prevId);
        setNextId(data.nextId);
        document.title = `${data.clip.clipName} · ${SITE_NAME}`;
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load clip");
      });
    return () => {
      cancelled = true;
    };
  }, [clipId]);

  if (error) return <ErrorBanner message={error} />;
  if (!clip) return <Loader label="Loading clip..." />;
  return <ClipWatch clip={clip} prevId={prevId} nextId={nextId} />;
}
