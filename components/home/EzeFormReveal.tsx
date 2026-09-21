import { ezeFormAssets } from "@/config/assets";
import { formCopy } from "@/config/ecosystem";
import CtaButton from "@/components/ecosystem/CtaButton";
import MediaSlot from "@/components/ecosystem/MediaSlot";
import Reveal from "@/components/ecosystem/Reveal";
import DropNumeral from "@/components/merch/DropNumeral";

/** Homepage: EZE // FORM reveal. Editorial and typographic; real imagery replaces the numeral when supplied. */
export default function EzeFormReveal() {
  return (
    <section id="eze-form" aria-labelledby="home-form-heading" className="theme-form relative overflow-hidden bg-form-ink py-28 sm:py-40">
      <div className="absolute inset-0" aria-hidden="true">
        <MediaSlot
          asset={ezeFormAssets.hero}
          label="EZE // FORM — homepage feature image"
          sizes="100vw"
          className="absolute inset-0 h-full w-full"
          imgClassName="absolute inset-0 h-full w-full object-cover opacity-70"
          fallback={
            <div className="absolute -right-[6%] top-1/2 -translate-y-1/2">
              <DropNumeral size="clamp(200px, 40vw, 520px)" />
            </div>
          }
        />
        <div className="absolute inset-0 bg-gradient-to-r from-form-ink via-form-ink/70 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.35em] text-form-stone">
            {formCopy.drop} — {formCopy.status}
          </p>
          <h2 id="home-form-heading" className="mt-5 font-display text-[clamp(60px,13vw,180px)] leading-[0.84] tracking-[0.01em] text-form-bone">
            EZE // FORM
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="mt-8 max-w-md font-display text-[clamp(24px,3vw,38px)] leading-[1.02] tracking-[0.03em] text-form-bone">
            {formCopy.line[0]}
            <br />
            <span className="text-form-stone">{formCopy.line[1]}</span>
          </p>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-form-stone">{formCopy.homeSupport}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <CtaButton href="/merch" tone="form">
              EXPLORE THE COLLECTION
            </CtaButton>
            <CtaButton href="/merch#early-access" tone="form-outline" event="merch_early_access_cta" surface="home_form">
              GET EARLY ACCESS
            </CtaButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
