"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { homeHref, SORT_OPTIONS, type HomeFilters } from "../query";
import type { Game } from "../types";

export function HomeDiscover({ filters, games }: { filters: HomeFilters; games: Game[] }) {
  const router = useRouter();
  const [query, setQuery] = useState(filters.q);
  const gameStripRef = useRef<HTMLDivElement>(null);
  const [gameStripNav, setGameStripNav] = useState({ left: false, right: false });

  useEffect(() => {
    setQuery(filters.q);
  }, [filters.q]);

  useEffect(() => {
    const strip = gameStripRef.current;
    if (!strip) return;
    function sync() {
      const node = gameStripRef.current;
      if (!node) return;
      const max = node.scrollWidth - node.clientWidth;
      setGameStripNav({
        left: node.scrollLeft > 8,
        right: max > 8 && node.scrollLeft < max - 8,
      });
    }
    sync();
    strip.addEventListener("scroll", sync, { passive: true });
    const observer = new ResizeObserver(sync);
    observer.observe(strip);
    return () => {
      strip.removeEventListener("scroll", sync);
      observer.disconnect();
    };
  }, [games.length]);

  function go(patch: Partial<HomeFilters>) {
    router.push(homeHref({ ...filters, page: 1, ...patch }));
  }

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    go({ q: query.trim() });
  }

  function slideGameStrip(direction: -1 | 1) {
    const el = gameStripRef.current;
    if (!el) return;
    const amount = Math.max(Math.round(el.clientWidth * 0.75), 280);
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  }

  return (
    <>
      <div className="discover-bar" id="clips">
        <form className="discover-search" onSubmit={submitSearch}>
          <svg className="discover-glass" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M16.2 16.2 21 21" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={filters.view === "users" ? "Search for users..." : "Search for channels..."}
            aria-label={filters.view === "users" ? "Search users" : "Search channels"}
          />
          <button type="submit" className="discover-go">
            Search
          </button>
        </form>
        <label className="discover-sort">
          Sort by:
          <select
            value={filters.sort}
            onChange={(event) => {
              const sort = event.target.value as HomeFilters["sort"];
              go({ sort, dir: sort === "alphabetical" ? "asc" : "desc" });
            }}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="discover-dir"
          onClick={() => go({ dir: filters.dir === "asc" ? "desc" : "asc" })}
          aria-label={filters.dir === "desc" ? "Sort descending" : "Sort ascending"}
          title={filters.dir === "desc" ? "Descending" : "Ascending"}
        >
          {filters.dir === "desc" ? "↓" : "↑"}
        </button>
      </div>
      <div className="game-strip-wrap">
        <div className="game-strip-toolbar">
          <button
            type="button"
            className="game-strip-nav"
            onClick={() => slideGameStrip(-1)}
            disabled={!gameStripNav.left}
            aria-label="Slide games left"
          >
            ‹
          </button>
          <button
            type="button"
            className="game-strip-nav"
            onClick={() => slideGameStrip(1)}
            disabled={!gameStripNav.right}
            aria-label="Slide games right"
          >
            ›
          </button>
        </div>
        <div className="game-strip" ref={gameStripRef} role="listbox" aria-label="Games">
          <Link
            href={homeHref({ ...filters, page: 1, gameId: 0 })}
            className={!filters.gameId ? "game-tile active" : "game-tile"}
            scroll={false}
          >
            <span className="game-tile-art all" aria-hidden="true">
              All
            </span>
            <span className="game-tile-label">All Games</span>
          </Link>
          {games.map((item) => (
            <Link
              key={item.id}
              href={homeHref({ ...filters, page: 1, gameId: item.id })}
              className={filters.gameId === item.id ? "game-tile active" : "game-tile"}
              scroll={false}
            >
              {item.imageUrl ? (
                <img src={item.imageUrl} alt="" className="game-tile-art" />
              ) : (
                <span className="game-tile-art fallback" aria-hidden="true">
                  {item.name[0]}
                </span>
              )}
              <span className="game-tile-label">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
