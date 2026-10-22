"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../auth";
import { Loader } from "../components/Brand";
import { handleLinkConflict, isAlreadyLinkedError } from "../toast";

export function YoutubeCallback() {
  const { user, loading, refresh } = useAuth();
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
    const googleError = params.get("error");
    if (googleError) {
      setError(googleError);
      return;
    }
    if (!code || !state) {
      setError("Google did not return a YouTube login code.");
      return;
    }
    void api
      .completeYoutubeOAuth(code, state)
      .then(async () => {
        await refresh();
        router.replace("/dashboard");
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : "Could not link YouTube";
        if (isAlreadyLinkedError(message)) {
          handleLinkConflict(err, setError);
          router.replace("/dashboard");
          return;
        }
        setError(message);
      });
  }, [loading, user, params, router, refresh]);

  return (
    <section className="narrow">
      <h1>Connecting YouTube</h1>
      {error ? (
        <>
          <div className="banner error">{error}</div>
          <Link href="/dashboard">Back to dashboard</Link>
        </>
      ) : (
        <Loader label="Finishing YouTube login..." />
      )}
    </section>
  );
}
