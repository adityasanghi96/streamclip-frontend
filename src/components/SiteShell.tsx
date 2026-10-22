"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../auth";
import { getTheme, toggleTheme, type ThemeName } from "../theme";
import { onToast } from "../toast";
import { BrandLockup } from "./Brand";
import { JoinDiscordButton } from "./Discord";
import { Footer } from "./Footer";
import { NavLink } from "./NavLink";
import { PathRouter } from "./PathRouter";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const wide = pathname.startsWith("/clip/") || pathname === "/";
  const [toast, setToast] = useState<{ message: string; kind: "error" | "ok" } | null>(null);
  const [theme, setTheme] = useState<ThemeName>("dark");

  useEffect(() => {
    setTheme(getTheme());
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    return onToast((message, kind) => {
      setToast({ message, kind });
      window.setTimeout(() => setToast((current) => (current?.message === message ? null : current)), 7000);
    });
  }, []);

  return (
    <div className="page">
      <header className="topbar">
        <Link href="/" className="brand" aria-label="Stream Clip">
          <BrandLockup />
        </Link>
        <nav className="nav">
          <NavLink href="/" end className="nav-home">
            Home
          </NavLink>
          {user ? (
            <>
              <NavLink href="/dashboard">Dashboard</NavLink>
              <button className="linkish" onClick={logout}>
                Sign out
              </button>
              {user.picture ? (
                <img className="avatar" src={user.picture} alt={user.name} referrerPolicy="no-referrer" />
              ) : (
                <span className="avatar fallback">{user.name[0]}</span>
              )}
            </>
          ) : (
            <NavLink href="/login">Sign in</NavLink>
          )}
          <JoinDiscordButton />
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setTheme(toggleTheme())}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            title="Theme"
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>
        </nav>
      </header>
      <main className={wide ? "content content-wide" : "content"}>
        <PathRouter>{children}</PathRouter>
      </main>
      <Footer />
      {toast && (
        <div className={toast.kind === "ok" ? "toast ok" : "toast"} role="status">
          {toast.message}
        </div>
      )}
    </div>
  );
}
