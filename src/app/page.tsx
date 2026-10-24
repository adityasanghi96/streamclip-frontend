import { Suspense } from "react";
import { Loader } from "../components/Brand";
import { HomeCatalog } from "../components/HomeCatalog";
import { HomeHeroActions } from "../components/HomeHeroActions";
import { JsonLd } from "../components/JsonLd";
import { loadHome } from "../data";
import { parseHomeFilters } from "../query";
import { PAGES } from "../site";

export default async function HomePage() {
  const filters = parseHomeFilters({});
  let error: string | null = null;
  let data = { games: [], channels: [], users: [], total: 0 } as Awaited<ReturnType<typeof loadHome>>;
  try {
    data = await loadHome(filters);
  } catch (err) {
    error = err instanceof Error ? err.message : "Could not load clips";
  }

  return (
    <section>
      <JsonLd {...PAGES.home} />
      <div className="hero">
        <p className="hero-kicker">Livestream clipping for YouTube, Twitch, and Kick</p>
        <h1>Stream Clip</h1>
        <p className="muted">
          Stream Clip is a livestream clipping app for YouTube, Twitch, and Kick. Anyone can browse public clips,
          channels, and games on this page without creating an account or signing in.
        </p>
        <p className="muted">
          Streamers can optionally sign in with Google to connect their channels, capture clips from chat or native
          clip buttons, and share them here.
        </p>
        <HomeHeroActions />
      </div>
      <div className="about-grid" aria-label="What Stream Clip does">
        <article className="about-card">
          <h2>Watch without signing in</h2>
          <p>Public clips, channels, and games are open. You do not need a Stream Clip account to view them.</p>
        </article>
        <article className="about-card">
          <h2>Clip livestreams</h2>
          <p>Capture moments from YouTube, Twitch, and Kick with Nightbot commands or each platform’s native clip button.</p>
        </article>
        <article className="about-card">
          <h2>Optional Google sign-in</h2>
          <p>Streamers sign in with Google only to create a Stream Clip account and link the channels they control.</p>
        </article>
      </div>
      {error ? <p className="banner error">{error}</p> : null}
      <Suspense fallback={<Loader label="Loading channels..." />}>
        <HomeCatalog initial={data} />
      </Suspense>
    </section>
  );
}
