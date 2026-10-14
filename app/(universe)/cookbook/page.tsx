import type { Metadata } from "next";
import { IMG } from "@/lib/universe/content";
import { COOKBOOK } from "@/lib/universe/offers";
import { jsonLd, SITE_URL } from "@/lib/json-ld";

const title = `${COOKBOOK.title} | EZE IRL`;
const description = `${COOKBOOK.hook} ${COOKBOOK.lede}`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: COOKBOOK.path },
  // Review-only. Keep it out of search until the owner publishes it.
  robots: { index: false, follow: false },
  openGraph: { type: "website", url: `${SITE_URL}${COOKBOOK.path}`, siteName: "EZE IRL", title, description },
  twitter: { card: "summary_large_image", title, description },
};

export default function CookbookPage() {
  const structured = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${SITE_URL}${COOKBOOK.path}`,
    isPartOf: { "@type": "WebSite", name: "EZE IRL", url: SITE_URL },
  };

  return (
    <>
      <article className="offer">
        <header className="offer__hero">
          <div className="offer__bg" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMG.lifestyle1} alt="" width={1200} height={1200} />
            <div className="offer__veil" />
          </div>
          <div className="container offer__hero-copy">
            <p className="section-label">{COOKBOOK.eyebrow}</p>
            {COOKBOOK.workingTitle && <p className="offer__badge">Working title</p>}
            <h1 className="offer__title">
              {COOKBOOK.titleLine}
              <span className="script lime">{COOKBOOK.titleScript}</span>
            </h1>
            <p className="offer__lede">{COOKBOOK.hook}</p>
            <p className="form__body">{COOKBOOK.lede}</p>
          </div>
        </header>

        <section className="offer__section container" aria-labelledby="cookbook-contents">
          <p className="section-label">The book</p>
          <h2 id="cookbook-contents" className="form__section-title">{COOKBOOK.contentsHeading}</h2>
          <p className="offer__flag" role="note">{COOKBOOK.recipeFlag}</p>
          <div className="offer__layout">
            <ul className="form__pillar-grid">
              {COOKBOOK.contents.map((item) => (
                <li key={item.title} className="form__pillar">
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </li>
              ))}
            </ul>
            <div className="offer__placeholder" data-placeholder="cookbook-cover">
              <p className="offer__badge">Cover pending</p>
              <p>Cookbook cover image is not chosen yet.</p>
            </div>
          </div>
        </section>

        <section className="offer__section offer__section--band container" aria-labelledby="cookbook-price">
          <p className="section-label">Review only</p>
          <h2 id="cookbook-price" className="form__section-title">{COOKBOOK.priceHeading}</h2>
          <p className="offer__badge">{COOKBOOK.priceStatus}</p>
          <div className="offer__price">
            <p>
              <span>{COOKBOOK.launchLabel}</span>
              <strong>{COOKBOOK.launchPrice}</strong>
            </p>
            <p>
              <span>{COOKBOOK.regularLabel}</span>
              <strong>{COOKBOOK.regularPrice}</strong>
            </p>
          </div>
          <p className="form__body">{COOKBOOK.priceNote}</p>
          <p className="form__body">{COOKBOOK.availability}</p>
          <button type="button" className="btn btn-solid" disabled aria-disabled="true">
            {COOKBOOK.buyLabel}
          </button>
          <p className="offer__note">{COOKBOOK.buyNote}</p>
        </section>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structured) }} />
    </>
  );
}
