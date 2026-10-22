"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../auth";
import { Loader } from "../components/Brand";
import { handleLinkConflict, isAlreadyLinkedError } from "../toast";

export function KickCallback() {
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
    const kickError = params.get("error");
    if (kickError) {
      setError(kickError);
      return;
    }
    if (!code || !state) {
      setError("Kick did not return a login code.");
      return;
    }
    void api
      .completeKickOAuth(code, state)
      .then(() => router.replace("/dashboard"))
      .catch((err) => {
        const message = err instanceof Error ? err.message : "Could not link Kick";
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
      <h1>Connecting Kick</h1>
      {error ? (
        <>
          <div className="banner error">{error}</div>
          <Link href="/dashboard">Back to dashboard</Link>
        </>
      ) : (
        <Loader label="Finishing Kick login..." />
      )}
    </section>
  );
}
