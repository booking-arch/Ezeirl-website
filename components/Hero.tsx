import CtaButton from "@/components/ecosystem/CtaButton";
import { ezeIrlPhotos } from "@/config/assets";
import ParallaxPhoto from "@/components/irl/ParallaxPhoto";

const side = ["FITNESS", "LIFESTYLE", "DISCIPLINE", "MORE"] as const;
const mantra = ["TRAIN", "FUEL", "IMPROVE", "EXPLORE", "BUILD", "REPEAT"] as const;

/** Homepage hero. One photograph, minimal copy, the wordmark lives in the nav. LCP element is the image. */
export default function Hero() {
  return (
    <section id="home" aria-labelledby="hero-heading" className="grain relative isolate flex min-h-[100svh] items-end overflow-hidden bg-brand-black lg:items-center">
      {/* Photograph: full-bleed on mobile, right-hand column on desktop (stays near native resolution). */}
      <div className="hero-photo-in absolute inset-0 -z-10 lg:left-[40%] lg:[mask-image:linear-gradient(to_right,transparent_0%,#000_30%)]">
        <ParallaxPhoto asset={ezeIrlPhotos.hero} priority sizes="(min-width: 1024px) 60vw, 100vw" focal="60% 30%" travel={5} />
      </div>
      {/* Legibility + depth */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-black via-brand-black/55 to-brand-black/10 lg:bg-gradient-to-r lg:from-brand-black lg:via-brand-black/30 lg:to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-brand-black to-transparent" />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-5 pb-14 pt-32 sm:px-8 lg:grid-cols-[1fr_auto] lg:pb-0 lg:pt-24">
        <div className="max-w-[46rem]">
          <ul aria-hidden="true" className="hero-rise mb-8 hidden gap-1 font-mono text-[11px] tracking-[0.3em] text-brand-white/70 lg:flex lg:flex-col" style={{ animationDelay: "0.5s" }}>
            {side.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>

          <h1 id="hero-heading" className="hero-rise" style={{ animationDelay: "0.25s" }}>
            <span className="sr-only">EZE IRL — </span>
            <span className="distress block font-display text-[clamp(60px,16.5vw,168px)] leading-[0.84] lg:text-[clamp(72px,9.4vw,138px)] tracking-[0.005em] text-brand-white">
              DISCIPLINE
              <br />
              CREATES
            </span>
            <span className="font-script -mt-2 block -rotate-3 text-[clamp(64px,21vw,190px)] leading-[0.9] lg:text-[clamp(80px,11.5vw,172px)] text-brand-red [text-shadow:0_0_40px_rgba(31,224,130,0.25)] sm:-mt-4">
              Freedom
            </span>
          </h1>

          <p className="hero-rise mt-6 max-w-sm font-mono text-[11px] leading-relaxed tracking-[0.28em] text-brand-white/80 sm:text-xs" style={{ animationDelay: "0.55s" }}>
            MORE THAN A WORKOUT.
            <br />A HIGHER STATE.
          </p>

          <div className="hero-rise mt-9 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "0.7s" }}>
            <CtaButton href="#story" tone="irl">
              EXPLORE EZE IRL
            </CtaButton>
            <CtaButton href="#community" tone="irl-outline">
              JOIN THE MOVEMENT
            </CtaButton>
          </div>
        </div>

        {/* Right rail (desktop): handwritten tagline + mantra, as in the approved concept */}
        <aside aria-hidden="true" className="hero-rise hidden max-w-[11rem] flex-col items-start justify-center gap-7 text-right lg:flex" style={{ animationDelay: "0.9s" }}>
          <p className="font-script -rotate-3 self-end text-3xl leading-[1.05] text-brand-white/90">
            Same mindset.
            <br />A higher you.
          </p>
          <ul className="self-end font-mono text-[11px] leading-[1.9] tracking-[0.3em] text-brand-white/70">
            {mantra.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
          <p className="font-script -rotate-3 self-end text-2xl leading-tight text-brand-red">Better than yesterday.</p>
          <p className="self-end font-mono text-[10px] tracking-[0.3em] text-brand-white/60">LOS ANGELES · 2026</p>
        </aside>
      </div>
    </section>
  );
}
