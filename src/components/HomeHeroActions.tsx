"use client";

import Link from "next/link";
import { useAuth } from "../auth";

export function HomeHeroActions() {
  const { user, loading } = useAuth();

  return (
    <div className="hero-actions">
      <a className="btn" href="#clips">
        Browse clips
      </a>
      {loading ? null : user ? (
        <Link className="btn secondary" href="/dashboard">
          Go to dashboard
        </Link>
      ) : (
        <Link className="btn secondary" href="/login">
          Sign in with Google
        </Link>
      )}
    </div>
  );
}
