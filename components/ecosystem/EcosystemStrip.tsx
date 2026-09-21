import Link from "next/link";
import Reveal from "./Reveal";

type Brand = "irl" | "fit" | "form";

const cards: { id: Brand; name: string; role: string; line: string; href: string; cta: string }[] = [
  { id: "irl", name: "EZE IRL", role: "THE LIFESTYLE", line: "Fitness, challenges and real life. The content and the people behind it.", href: "/", cta: "ENTER EZE IRL" },
  { id: "fit", name: "EZE-FIT", role: "THE TECHNOLOGY", line: "Track meals, plan training and follow progress. In private beta.", href: "/eze-fit", cta: "EXPLORE EZE-FIT" },
  { id: "form", name: "EZE // FORM", role: "THE APPAREL", line: "The physical side of EZE. Drop 001 is coming soon.", href: "/merch", cta: "EXPLORE THE COLLECTION" },
];

const accent: Record<Brand, string> = {
  irl: "text-brand-gold hover:border-brand-gold/60",
  fit: "text-fit-lime hover:border-fit-lime/60",
  form: "text-form-bone hover:border-form-bone/60",
};

/** One world, three identities. `current` is omitted from the row so the page never links to itself. */
export default function EcosystemStrip({ current }: { current?: Brand }) {
  const items = cards.filter((c) => c.id !== current);
  return (
    <section aria-labelledby="ecosystem-heading" className="border-t border-white/10 bg-black px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.3em] text-white/60">ONE WORLD</p>
          <h2 id="ecosystem-heading" className="mt-3 text-balance font-display text-[clamp(40px,7vw,84px)] leading-[0.95] text-white">
            THE LIFESTYLE. THE TECHNOLOGY. THE APPAREL.
          </h2>
        </Reveal>
        <ul className={`mt-12 grid gap-5 ${items.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
          {items.map((c, i) => (
            <Reveal as="li" key={c.id} delay={i * 90}>
              <Link href={c.href} className={`group block h-full border border-white/10 bg-white/[0.02] p-7 transition-colors ${accent[c.id]}`}>
                <p className="font-mono text-[11px] tracking-[0.25em] text-white/60">{c.role}</p>
                <p className="mt-3 font-display text-4xl tracking-[0.06em]">{c.name}</p>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{c.line}</p>
                <p className="mt-6 text-xs font-semibold tracking-[0.2em]">
                  {c.cta} <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </p>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
