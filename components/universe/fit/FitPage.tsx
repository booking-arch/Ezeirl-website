import { FIT_CREATIVES, FIT_FEATURES, FIT_PILLARS, FIT_STILL_BUILDING, IMG, MAILTO_FIT } from "@/lib/universe/content";
import BrandSwitcher from "../BrandSwitcher";
import ConversionBar from "../ConversionBar";
import TrackedLink from "../TrackedLink";
import DemoPhone from "./DemoPhone";
import VoxelField from "./VoxelField";

export default function FitPage() {
  return (
    <>
      <BrandSwitcher active="eze-fit" />
      <section id="eze-fit" className="fit">
        <VoxelField />
        <div className="fit__inner container">
          <header className="fit__header reveal">
            <div className="fit__brandmark">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG.logoCircle} alt="" className="fit__mark" width={96} height={96} />
              <div>
                <p className="fit__wordmark">EZE<span className="lime">-FIT</span></p>
                <p className="fit__tag">YOUR FITNESS. YOUR DATA. YOUR <span className="lime">EVOLUTION.</span></p>
              </div>
            </div>
            <p className="fit__beta">PRIVATE BETA · EXCLUSIVE · TRANSPARENT · COLLABORATIVE</p>
            <h1 className="fit__headline">TRACK. TRAIN. FUEL.<br />LEARN. GROW.</h1>
            <p className="fit__sub">A healthier, stronger you — <span className="lime">made EZE</span>.</p>
            <div className="fit__ctas">
              <TrackedLink href={MAILTO_FIT} className="btn btn-solid" event="beta_signup_click" params={{ cta_label: "TRY BETA", component: "EzeFitShowcase", link_url: MAILTO_FIT }}>TRY BETA</TrackedLink>
              <a href="#eze-fit-detail" className="btn btn-outline">LEARN MORE</a>
            </div>
          </header>
          <div className="fit__stage reveal">
            <div className="fit__copy-left">
              <p className="section-label">PILLARS</p>
              <ul className="fit__pillars">
                {FIT_PILLARS.map((p) => <li key={p.title}><strong>{p.title}</strong><span>{p.desc}</span></li>)}
              </ul>
            </div>
            <DemoPhone />
            <div className="fit__copy-right">
              <p className="section-label">POSITIONING</p>
              <h3>POWERED BY INTENT.<br />BACKED BY FEEDBACK.<br />BUILT FOR REAL LIFE.</h3>
              <ul className="fit__checks">
                <li>Private beta — you help shape the final product</li>
                <li>Transparent about what works and what&apos;s early</li>
                <li>Collaborative: use it, push it, tell us what&apos;s missing</li>
                <li>Interactive demo HUD — stylized, not fake product UI</li>
              </ul>
              <p className="script lime fit__script">Knowledge fuels progress.</p>
            </div>
          </div>
          <div id="eze-fit-detail" className="fit__features reveal">
            <p className="section-label">IN BETA NOW</p>
            <h3 className="fit__features-title">Approved feature set</h3>
            <ul className="fit__feature-list">{FIT_FEATURES.map((f) => <li key={f}>{f}</li>)}</ul>
          </div>
          <div className="fit__wip reveal">
            <p className="section-label">STILL BUILDING</p>
            <h3 className="fit__features-title">What we&apos;re honest about</h3>
            <div className="fit__wip-grid">
              {FIT_STILL_BUILDING.map((w) => <article key={w.title} className="fit__wip-card"><h4>{w.title}</h4><p>{w.note}</p></article>)}
            </div>
            <p className="fit__feedback">BETA MEANS YOU MAY FIND SOMETHING BEFORE WE DO. <span className="lime">That&apos;s exactly why your feedback matters.</span></p>
          </div>
          <div className="fit__story reveal">
            <p className="section-label">PRODUCT STORY</p>
            <h3 className="fit__features-title">FITNESS MADE EZE</h3>
            <p className="fit__story-copy">
              One system for the full loop — <strong>tracking</strong> nutrition and progress, <strong>training</strong> with real sessions,{" "}
              <strong>fuel</strong> with intention, <strong>learn</strong> without the noise, <strong>grow</strong> with healthy pressure. Private beta
              means the core works and you help shape what ships next.
            </p>
          </div>
          <div className="fit__creatives reveal">
            <p className="section-label">PRIVATE BETA CREATIVES</p>
            <h3 className="fit__features-title">Campaign stills · not live app UI</h3>
            <p className="fit__creatives-note">EN carousel frames used as private-beta visual system. Campaign creatives — honest labeling, not product screenshots claiming to be live.</p>
            <div className="fit__creatives-grid">
              {FIT_CREATIVES.map((c) => (
                <figure key={c.src} className="fit__creative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.src} alt={c.label} loading="lazy" width={1200} height={1200} />
                  <figcaption>{c.label}</figcaption>
                </figure>
              ))}
            </div>
          </div>
          <div className="fit__universe reveal">
            <p className="section-label">EXPLORE THE BRANDS</p>
            <h3 className="fit__features-title">More than the app</h3>
            <p className="fit__universe-copy">EZE-FIT lives inside a larger universe — lifestyle from EZE IRL, apparel mindset from EZE//FORM. Pick a lane or run them all.</p>
            <BrandSwitcher active="eze-fit" compact />
            <p className="fit__made">FITNESS MADE EZE</p>
          </div>
        </div>
      </section>
      <ConversionBar brand="eze-fit" />
    </>
  );
}
