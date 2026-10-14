import type { Metadata } from "next";
import GatedSignup from "@/components/universe/offers/GatedSignup";
import { IMG } from "@/lib/universe/content";
import { GUIDE } from "@/lib/universe/offers";
import { jsonLd, SITE_URL } from "@/lib/json-ld";
import { isWaitlistEnabled } from "@/lib/waitlist/config";

const title = `${GUIDE.title} | EZE IRL`;
const description = `${GUIDE.lede} ${GUIDE.quiet}`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: GUIDE.path },
  // Review-only. Keep it out of search until the owner publishes it.
  robots: { index: false, follow: false },
  openGraph: { type: "website", url: `${SITE_URL}${GUIDE.path}`, siteName: "EZE IRL", title, description },
  twitter: { card: "summary_large_image", title, description },
};

export default function GuidePage() {
  const structured = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${SITE_URL}${GUIDE.path}`,
    isPartOf: { "@type": "WebSite", name: "EZE IRL", url: SITE_URL },
  };

  return (
    <>
      <article className="offer">
        <header className="offer__hero">
          <div className="offer__bg" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMG.train1} alt="" width={1200} height={1200} />
            <div className="offer__veil" />
          </div>
          <div className="container offer__hero-copy">
            <p className="section-label">{GUIDE.eyebrow}</p>
            <h1 className="offer__title">
              {GUIDE.titleLine}
              <span className="script lime">{GUIDE.titleScript}</span>
            </h1>
            <p className="script offer__tagline">{GUIDE.tagline}</p>
            <p className="offer__lede">{GUIDE.lede}</p>
            <p className="offer__quiet">{GUIDE.quiet}</p>
          </div>
        </header>

        <section className="offer__section container" aria-labelledby="guide-contents">
          <p className="section-label">The plan</p>
          <h2 id="guide-contents" className="form__section-title">{GUIDE.contentsHeading}</h2>
          <p className="form__body">{GUIDE.availability}</p>
          <div className="offer__layout">
            <ul className="form__pillar-grid">
              {GUIDE.contents.map((item) => (
                <li key={item.title} className="form__pillar">
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </li>
              ))}
            </ul>
            <div className="offer__placeholder" data-placeholder="guide-cover">
              <p className="offer__badge">Cover pending</p>
              <p>Guide cover image is not chosen yet.</p>
            </div>
          </div>
        </section>

        <section className="offer__section offer__section--band container" aria-labelledby="guide-signup">
          <div className="offer__split">
            <div>
              <p className="section-label">Email</p>
              <h2 id="guide-signup" className="form__section-title">{GUIDE.signupHeading}</h2>
              <p className="form__body">
                The form is here so the page can be reviewed. It stays off, and it does not collect an address.
              </p>
              <p className="offer__disclaimer">{GUIDE.disclaimer}</p>
            </div>
            <GatedSignup enabled={isWaitlistEnabled()} />
          </div>
        </section>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structured) }} />
    </>
  );
}
