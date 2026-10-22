"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../auth";
import { Loader } from "../components/Brand";
import { handleLinkConflict, isAlreadyLinkedError } from "../toast";

export function TwitchCallback() {
  const { user, loading } = useAuth();
  const params = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    const code = params.get("code");
    const state = params.get("state");
    const twitchError = params.get("error");
    const twitchErrorDescription = params.get("error_description");
    if (twitchError) {
      setError(twitchErrorDescription || twitchError);
      return;
    }
    if (!code || !state) {
      setError("Twitch did not return a login code.");
      return;
    }
    void api
      .completeTwitchOAuth(code, state)
      .then(() => router.replace("/dashboard"))
      .catch((err) => {
        const message = err instanceof Error ? err.message : "Could not link Twitch";
        if (isAlreadyLinkedError(message)) {
          handleLinkConflict(err, setError);
          router.replace("/dashboard");
          return;
        }
        setError(message);
      });
  }, [loading, user, params, router]);

  return (
    <section className="narrow">
      <h1>Connecting Twitch</h1>
      {error ? (
        <>
          <div className="banner error">{error}</div>
          <Link href="/dashboard">Back to dashboard</Link>
        </>
      ) : (
        <Loader label="Finishing Twitch login..." />
      )}
    </section>
  );
}
