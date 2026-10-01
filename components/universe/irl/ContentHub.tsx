import { CONTENT_PILLARS, FRAMES, IMG, SOCIALS, YOUTUBE_URL } from "@/lib/universe/content";
import TrackedLink from "../TrackedLink";

export default function ContentHub() {
  return (
    <section id="content" className="hub">
      <div className="hub__inner container">
        <header className="hub__header reveal">
          <p className="section-label">CONTENT HUB</p>
          <h2>REAL LIFE. NO FILTER.</h2>
          <p>
            Bad decisions. Better stories. The feed is built on six pillars plus the ongoing series <span className="lime">The Roster</span> — not a
            fake archive of uploads that aren’t live yet.
          </p>
        </header>
        <div className="hub__pillars reveal">
          {CONTENT_PILLARS.map((p) => (
            <article key={p.title} className="hub__pillar"><h3>{p.title}</h3><p>{p.body}</p></article>
          ))}
        </div>
        <article className="hub__series reveal">
          <p className="section-label">SERIES</p>
          <h3>THE <span className="lime">ROSTER</span></h3>
          <p>Recurring faces, recurring standards. Characters from the grind — comedy, discipline, and the in-between — tracked across platforms as the archive grows.</p>
        </article>
        <div className="hub__socials reveal" aria-label="Social platforms">
          {SOCIALS.map((s) => (
            <TrackedLink key={s.label} href={s.href} className="hub__social" external event="outbound_click" params={{ cta_label: s.label, component: "ContentHub", platform: s.platform, link_url: s.href }}>
              <span className="hub__social-label">{s.label}</span>
              <span className="hub__social-handle">{s.handle}</span>
              <span className="hub__social-go">OPEN →</span>
            </TrackedLink>
          ))}
        </div>
        <div className="hub__mosaic reveal">
          <p className="section-label">FRAMES</p>
          <h3 className="hub__mosaic-title">From the field</h3>
          <div className="hub__mosaic-grid">
            {FRAMES.map((f) => (
              <figure key={f.src} className="hub__shot">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.src} alt={f.alt} loading="lazy" width={1200} height={1200} />
              </figure>
            ))}
          </div>
        </div>
        <aside className="hub__yt reveal">
          <div className="hub__yt-copy">
            <p className="section-label">YOUTUBE</p>
            <h3>Channel live · first uploads soon</h3>
            <p>@ItsEzeIRL is live. Zero uploads at ship — when the first cuts land, they’ll sit here. Until then, follow for the drop.</p>
            <TrackedLink href={YOUTUBE_URL} className="btn btn-outline" external event="outbound_click" params={{ cta_label: "OPEN CHANNEL", component: "ContentHub", platform: "youtube", link_url: YOUTUBE_URL }}>
              OPEN CHANNEL
            </TrackedLink>
          </div>
          <TrackedLink href={YOUTUBE_URL} className="hub__yt-card" external event="outbound_click" params={{ cta_label: "YT card", component: "ContentHub", platform: "youtube", link_url: YOUTUBE_URL }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMG.hero2} alt="" loading="lazy" width={941} height={1672} />
            <div className="hub__yt-veil"><span className="hub__yt-badge">YT · LIVE</span><p>First uploads soon</p></div>
          </TrackedLink>
        </aside>
      </div>
    </section>
  );
}
