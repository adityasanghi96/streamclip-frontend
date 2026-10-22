"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../auth";
import { Loader } from "../components/Brand";
import { ErrorBanner } from "../components/Cards";
import { GOOGLE_LOGIN_SCOPE, requestGoogleAccessToken } from "../google";

export function Login() {
  const { user, login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const configured = Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  if (user) return <Loader label="Redirecting..." />;

  async function onGoogle() {
    setError(null);
    setBusy(true);
    try {
      const accessToken = await requestGoogleAccessToken("select_account", GOOGLE_LOGIN_SCOPE);
      await login(accessToken);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="narrow">
      <h1>Sign in to Stream Clip</h1>
      <p className="muted">
        Stream Clip is a livestream clipping app for YouTube, Twitch, and Kick. You can{" "}
        <Link href="/">browse public clips</Link> without an account. Sign in with Google only if you want to connect
        your channels and capture clips.
      </p>
      <ErrorBanner message={error} />
      {!configured && (
        <div className="banner">Add NEXT_PUBLIC_GOOGLE_CLIENT_ID to streamclip-frontend/.env to enable Google login.</div>
      )}
      {busy ? (
        <Loader label="Signing in..." size="sm" />
      ) : (
        <button className="btn google" disabled={!configured} onClick={() => void onGoogle()}>
          Continue with Google
        </button>
      )}
      <p className="legal-note">
        By continuing you agree to our <Link href="/terms">Terms of Service</Link> and{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>
    </section>
  );
}
