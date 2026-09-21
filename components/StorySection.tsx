import CtaButton from "@/components/ecosystem/CtaButton";
import Reveal from "@/components/ecosystem/Reveal";
import Photo from "@/components/irl/Photo";
import { ezeIrlPhotos } from "@/config/assets";

/** "This is EZE IRL": the identity beat. Copy and layout follow the approved concept. */
export default function StorySection() {
  return (
    <section id="story" aria-labelledby="story-heading" className="grain relative overflow-hidden bg-brand-black py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.35em] text-brand-red">THE STORY</p>
          <h2 id="story-heading" className="distress mt-4 font-display text-[clamp(60px,10vw,136px)] leading-[0.84] text-brand-white">
            THIS IS
            <br />
            EZE IRL
          </h2>
          <p className="mt-7 max-w-xs font-mono text-[11px] leading-[1.9] tracking-[0.28em] text-brand-white/80">
            FITNESS. LIFESTYLE. DISCIPLINE.
            <br />A HIGHER STATE OF LIVING.
          </p>
          <div className="mt-9">
            <CtaButton href="#irl" tone="irl-outline">
              LEARN MY STORY&nbsp;→
            </CtaButton>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
          <Reveal className="mask-reveal relative col-span-2 aspect-[4/5] overflow-hidden sm:col-span-1 sm:row-span-2 sm:aspect-[3/4.4]">
            <Photo asset={ezeIrlPhotos.portrait} sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 92vw" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-brand-black/85 via-transparent to-transparent" />
            <p className="font-script absolute bottom-4 left-4 right-4 -rotate-2 text-2xl leading-tight text-brand-white sm:text-3xl">
              Real training.
              <br />
              Real life.
              <br />
              <span className="text-brand-red">Real progress.</span>
            </p>
          </Reveal>
          <Reveal delay={120} className="mask-reveal relative aspect-[3/4] overflow-hidden sm:mt-10">
            <Photo asset={ezeIrlPhotos.plate} sizes="(min-width: 1024px) 20vw, 46vw" />
          </Reveal>
          <Reveal delay={220} className="mask-reveal relative aspect-[3/4] overflow-hidden sm:mt-4">
            <Photo asset={ezeIrlPhotos.bench} sizes="(min-width: 1024px) 20vw, 46vw" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
