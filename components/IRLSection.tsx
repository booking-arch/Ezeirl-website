import Reveal from "@/components/ecosystem/Reveal";
import Photo from "@/components/irl/Photo";
import ParallaxPhoto from "@/components/irl/ParallaxPhoto";
import { ezeIrlPhotos } from "@/config/assets";

const pillars = [
  { symbol: "01", label: "FITNESS", description: "Training hard in real gyms. Real weight. Real results. No performance, no filter." },
  { symbol: "02", label: "COMPETITION", description: "Challenges with real stakes. Public goals. No excuses. The content that makes you put the phone down." },
  { symbol: "03", label: "COMEDY", description: "If you're not laughing at the process, you're missing the point. Wins, fails, and everything awkward in between." },
  { symbol: "04", label: "REAL LIFE", description: "Conversations worth having. Adventures worth taking. The stuff that doesn't fit a template." },
] as const;

const gallery = [
  ezeIrlPhotos.curlLow,
  ezeIrlPhotos.pullUp,
  ezeIrlPhotos.cableSide,
  ezeIrlPhotos.plate,
  ezeIrlPhotos.curlRoar,
] as const;

/** Training / fitness: an editorial spread plus a snap-scroll photo gallery. No boxed cards. */
export default function IRLSection() {
  return (
    <section id="irl" aria-labelledby="irl-heading" className="grain relative overflow-hidden bg-brand-black py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div className="lg:pt-10">
            <Reveal>
              <p className="font-mono text-[11px] tracking-[0.35em] text-brand-red">THE IRL</p>
              <h2 id="irl-heading" className="distress mt-4 font-display text-[clamp(52px,8.4vw,120px)] leading-[0.86] text-brand-white">
                FITNESS. COMEDY.
                <br />
                <span className="text-brand-white/45">REAL CONVERSATIONS.</span>
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-brand-muted">
                EZE IRL follows the wins, mistakes, gains and unpredictable moments that make life worth watching.
              </p>
            </Reveal>

            <ol className="mt-12 divide-y divide-brand-white/10 border-y border-brand-white/10">
              {pillars.map((p, i) => (
                <Reveal as="li" key={p.label} delay={i * 80} className="grid grid-cols-[3rem_1fr] gap-x-4 py-6 sm:grid-cols-[4rem_10rem_1fr] sm:items-baseline">
                  <span className="font-mono text-xs tracking-[0.2em] text-brand-red">{p.symbol}</span>
                  <h3 className="font-display text-2xl tracking-[0.1em] text-brand-white">{p.label}</h3>
                  <p className="col-start-2 mt-2 text-sm leading-relaxed text-brand-muted sm:col-start-3 sm:mt-0">{p.description}</p>
                </Reveal>
              ))}
            </ol>
          </div>

          <Reveal className="mask-reveal relative order-first aspect-[4/5] overflow-hidden lg:order-none lg:aspect-auto lg:min-h-[44rem]">
            <ParallaxPhoto asset={ezeIrlPhotos.dumbbellRow} sizes="(min-width: 1024px) 40vw, 92vw" travel={5} />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-brand-black/70 via-transparent to-transparent" />
            <p className="font-script absolute bottom-5 right-5 -rotate-3 text-3xl text-brand-white sm:text-4xl">More than fitness.</p>
          </Reveal>
        </div>
      </div>

      {/* Gallery: keyboard-scrollable, snap on touch, no JS needed */}
      <div
        role="region"
        aria-label="Training photos"
        tabIndex={0}
        className="mt-16 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-5 pb-3 [scrollbar-width:none] sm:mt-24 sm:gap-3.5 sm:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {gallery.map((g, i) => (
          <Reveal key={g.src} delay={i * 60} className="mask-reveal group relative aspect-[3/4] w-[68vw] shrink-0 snap-start overflow-hidden sm:w-[34vw] lg:w-[22vw]">
            <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]">
              <Photo asset={g} sizes="(min-width: 1024px) 22vw, (min-width: 640px) 34vw, 68vw" />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
