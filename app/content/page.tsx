import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Photo from "@/components/irl/Photo";
import ContentLink from "@/components/content/ContentLink";
import { contentEntries, type ContentCategory } from "@/config/content";
import { jsonLd, SITE_URL } from "@/lib/json-ld";

const title = "Content | EZE IRL";
const description =
  "Training and lifestyle photography from EZE IRL. Official video channels are not connected yet, so this page does not pretend to play them.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/content" },
  openGraph: { type: "website", url: `${SITE_URL}/content`, siteName: "EZE IRL", title, description },
  twitter: { card: "summary_large_image", title, description },
};

const GROUPS: { id: ContentCategory; label: string }[] = [
  { id: "training", label: "TRAINING" },
  { id: "fitness", label: "FITNESS" },
  { id: "lifestyle", label: "LIFESTYLE" },
];

export default function ContentPage() {
  const structured = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: `${SITE_URL}/content`,
    isPartOf: { "@type": "WebSite", name: "EZE IRL", url: SITE_URL },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: contentEntries.map((entry, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: entry.title,
        url: `${SITE_URL}/content#${entry.id}`,
      })),
    },
  };

  return (
    <>
      <Navigation />
      <main id="main-content" className="bg-brand-black">
        <header className="mx-auto max-w-6xl px-4 pb-4 pt-28 sm:pt-32">
          <p className="mb-4 font-mono text-xs tracking-[0.3em] text-brand-red-bright">EZE IRL</p>
          <h1
            className="font-display leading-[0.92] text-brand-white"
            style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(40px, 8vw, 88px)" }}
          >
            THE WORK,
            <br />
            IN THE ROOM.
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-brand-muted sm:text-base">
            Real photographs from training and life. Each one links back to where it appears on the homepage.
            Video stays off this page until an official channel is confirmed.
          </p>
        </header>

        {GROUPS.map((group) => {
          const items = contentEntries.filter((entry) => entry.category === group.id);
          if (items.length === 0) return null;
          return (
            <section key={group.id} aria-labelledby={`content-${group.id}`} className="mx-auto max-w-6xl px-4 py-8">
              <h2 id={`content-${group.id}`} className="mb-6 font-mono text-xs tracking-[0.3em] text-brand-muted">
                {group.label}
              </h2>
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((entry) => (
                  <li key={entry.id}>
                    <article id={entry.id} className="scroll-mt-24 overflow-hidden border border-brand-border/60 bg-brand-card/20">
                      <div className="aspect-[3/4] overflow-hidden">
                        <Photo
                          asset={entry.image}
                          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw"
                          ungraded={entry.id === "sunset-calisthenics"}
                        />
                      </div>
                      <div className="p-4 sm:p-5">
                        <h3
                          className="font-display text-2xl tracking-widest text-brand-white"
                          style={{ fontFamily: "var(--font-bebas)" }}
                        >
                          {entry.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-brand-muted">{entry.excerpt}</p>
                        <ContentLink href={entry.href} itemId={entry.id}>
                          See this on the homepage
                        </ContentLink>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        <p className="mx-auto max-w-6xl px-4 pb-24 pt-4 font-mono text-xs leading-relaxed text-brand-subtle">
          YouTube, TikTok, Instagram, Twitch, and X are not linked here. Those buttons appear only after the account URL is confirmed.
        </p>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structured) }} />
    </>
  );
}
