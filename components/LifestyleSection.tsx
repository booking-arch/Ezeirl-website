import Reveal from "@/components/ecosystem/Reveal";
import ParallaxPhoto from "@/components/irl/ParallaxPhoto";
import { ezeIrlPhotos } from "@/config/assets";

/** Lifestyle / adventure beat: the one full-colour photograph, shown near its native size. */
export default function LifestyleSection() {
  return (
    <section id="lifestyle" aria-labelledby="lifestyle-heading" className="grain relative overflow-hidden bg-brand-black py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_0.7fr] lg:gap-20">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.35em] text-brand-red">LIFESTYLE</p>
          <h2 id="lifestyle-heading" className="distress mt-4 font-display text-[clamp(60px,11vw,150px)] leading-[0.84] text-brand-white">
            LIVE
            <br />
            BIGGER.
          </h2>
          <p className="font-script mt-4 -rotate-2 text-[clamp(30px,5vw,56px)] leading-tight text-brand-red">Adventure counts as training.</p>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-brand-muted">
            The gym is one part of it. Movement, places and people are the rest.
          </p>
        </Reveal>
        <Reveal className="mask-reveal relative mx-auto aspect-[9/14] w-full max-w-[26rem] overflow-hidden lg:max-w-none">
          <ParallaxPhoto asset={ezeIrlPhotos.sunset} sizes="(min-width: 1024px) 34vw, 92vw" ungraded travel={4} />
        </Reveal>
      </div>
    </section>
  );
}
