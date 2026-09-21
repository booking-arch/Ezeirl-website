import CtaButton from "@/components/ecosystem/CtaButton";
import Reveal from "@/components/ecosystem/Reveal";

/** Closing beat before the footer, as in the approved concept. Typography only. */
export default function ClosingCta() {
  return (
    <section aria-labelledby="closing-heading" className="grain relative overflow-hidden border-t border-brand-white/10 bg-brand-black py-28 text-center sm:py-40">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(31,224,130,0.10),transparent_70%)]" />
      <Reveal className="relative mx-auto max-w-4xl px-5">
        <h2 id="closing-heading" className="font-script -rotate-2 text-[clamp(52px,12vw,140px)] leading-[0.95] text-brand-white">
          You&rsquo;re never <span className="text-brand-red">finished.</span>
        </h2>
        <p className="mt-8 font-mono text-[11px] tracking-[0.35em] text-brand-white/70">FITNESS / LIFESTYLE / A HIGHER STATE</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <CtaButton href="#community" tone="irl">
            JOIN THE MOVEMENT
          </CtaButton>
          <CtaButton href="/eze-fit" tone="irl-outline">
            EXPLORE EZE-FIT
          </CtaButton>
        </div>
      </Reveal>
    </section>
  );
}
