import { MUSIC_PLATFORMS, SPOTIFY_URL, spotifyEmbed } from "@/lib/universe/content";
import TrackedLink from "../TrackedLink";

export default function Listen() {
  return (
    <section id="music" className="listen" aria-labelledby="listen-heading">
      <div className="listen__inner container reveal">
        <div className="listen__copy">
          <p className="section-label">MUSIC · EZEKIEL CRUZ</p>
          <h2 id="listen-heading" className="listen__title">THE SOUNDTRACK TO THE <span className="lime">MOVEMENT</span></h2>
          <p className="listen__body">Argentina ↔ LA. Real verses. Fuel for discipline — stream the artist behind EZE IRL and let the work soundtrack itself.</p>
          <div className="listen__ctas">
            <TrackedLink href={SPOTIFY_URL} className="btn btn-solid" external event="outbound_click" params={{ cta_label: "OPEN SPOTIFY", component: "ListenStrip", platform: "spotify", link_url: SPOTIFY_URL }}>
              OPEN SPOTIFY
            </TrackedLink>
            <ul className="listen__platforms" aria-label="Listen on other platforms">
              {MUSIC_PLATFORMS.map((p) => (
                <li key={p.label}>
                  <TrackedLink href={p.href} external event="outbound_click" params={{ cta_label: p.label, component: "ListenStrip", platform: p.platform, link_url: p.href }}>{p.label}</TrackedLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="listen__embed">
          <iframe title="Ezekiel Cruz on Spotify" src={spotifyEmbed(0)} width="100%" height="352" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" className="listen__iframe" />
        </div>
      </div>
    </section>
  );
}
