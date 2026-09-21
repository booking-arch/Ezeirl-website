import { ezeFormAssets, hasFormProducts } from "@/config/assets";
import { formCopy, formFaq } from "@/config/ecosystem";
import CtaButton from "@/components/ecosystem/CtaButton";
import MediaSlot from "@/components/ecosystem/MediaSlot";
import Reveal from "@/components/ecosystem/Reveal";
import ScrollDrift from "@/components/ecosystem/ScrollDrift";
import WaitlistForm from "@/components/ecosystem/WaitlistForm";
import DropNumeral from "./DropNumeral";
import ProductGrid from "./ProductGrid";

export function MerchHero() {
  return (
    <section aria-labelledby="form-hero-title" className="relative flex min-h-[100svh] items-end overflow-hidden bg-form-ink pb-16 pt-32 sm:pb-24">
      <div className="absolute inset-0" aria-hidden={ezeFormAssets.hero ? undefined : true}>
        <MediaSlot
          asset={ezeFormAssets.hero}
          label="EZE // FORM — collection hero (full-bleed campaign image)"
          sizes="100vw"
          priority
          className="absolute inset-0 h-full w-full"
          imgClassName="absolute inset-0 h-full w-full object-cover"
          fallback={
            <div className="absolute -right-[4%] top-1/2 -translate-y-1/2 opacity-90">
              <DropNumeral />
            </div>
          }
        />
        <div className="absolute inset-0 bg-gradient-to-t from-form-ink via-form-ink/40 to-transparent" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-8">
        <p className="font-mono text-xs tracking-[0.35em] text-form-stone">
          {formCopy.drop} — {formCopy.status}
        </p>
        <h1 id="form-hero-title" className="mt-4 font-display text-[clamp(64px,15vw,210px)] leading-[0.82] tracking-[0.01em] text-form-bone">
          EZE // FORM
        </h1>
        <p className="mt-8 max-w-xl font-display text-[clamp(26px,3.6vw,44px)] leading-[1.02] tracking-[0.03em] text-form-bone">
          {formCopy.line[0]}
          <br />
          <span className="text-form-stone">{formCopy.line[1]}</span>
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <CtaButton href="#early-access" tone="form" event="merch_early_access_cta" surface="merch_hero">
            GET EARLY ACCESS
          </CtaButton>
          <CtaButton href="#collection" tone="form-outline">
            THE COLLECTION
          </CtaButton>
        </div>
      </div>
    </section>
  );
}

export function EditorialStatement() {
  return (
    <section aria-label="EZE // FORM statement" className="overflow-hidden border-y border-form-line bg-form-ink py-24 sm:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <ScrollDrift from={5} to={-5}>
          <p className="font-display text-[clamp(48px,11vw,170px)] leading-[0.9] tracking-[0.01em] text-form-bone">{formCopy.line[0]}</p>
        </ScrollDrift>
        <ScrollDrift from={-5} to={5} className="mt-2 sm:mt-4">
          <p className="font-display text-[clamp(48px,11vw,170px)] leading-[0.9] tracking-[0.01em] text-form-stone/70">{formCopy.line[1]}</p>
        </ScrollDrift>
        <Reveal className="mt-14 max-w-md">
          <p className="text-base leading-relaxed text-form-stone">
            EZE // FORM is the physical side of EZE: the same work ethic, worn. Details on Drop 001 will be shared as they are confirmed.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export function Collection() {
  const real = hasFormProducts();
  return (
    <section id="collection" aria-labelledby="collection-heading" className="scroll-mt-16 bg-form-ink px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs tracking-[0.35em] text-form-stone">{formCopy.drop}</p>
            <h2 id="collection-heading" className="mt-3 font-display text-[clamp(44px,8vw,110px)] leading-[0.9] text-form-bone">
              THE COLLECTION
            </h2>
          </div>
          <p className="border border-form-bone/40 px-4 py-2 font-mono text-xs tracking-[0.3em] text-form-bone">{formCopy.status}</p>
        </Reveal>

        {real ? (
          <ProductGrid products={ezeFormAssets.products} />
        ) : (
          <>
            {/* Development: labeled slots make the missing imagery obvious. Production: typographic only. */}
            {process.env.NODE_ENV !== "production" && (
              <ul className="mb-14 grid gap-6 sm:grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <li key={i} className="aspect-[4/5]">
                    <MediaSlot asset={null} label={`EZE // FORM — product ${i + 1} front`} sizes="33vw" className="h-full w-full" />
                  </li>
                ))}
              </ul>
            )}
            <Reveal className="max-w-2xl">
              <p className="font-display text-[clamp(32px,5vw,64px)] leading-[0.98] text-form-bone">PRODUCT IMAGERY IS ON THE WAY.</p>
              <p className="mt-4 text-base leading-relaxed text-form-stone">
                We only show the real thing. When Drop 001 photography is ready it will appear here, piece by piece. Join the waitlist to see it first.
              </p>
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
}

export function EarlyAccess({ enabled }: { enabled: boolean }) {
  return (
    <section id="early-access" aria-labelledby="early-heading" className="scroll-mt-16 border-t border-form-line bg-form-ash px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.35em] text-form-stone">
            {formCopy.drop} — {formCopy.status}
          </p>
          <h2 id="early-heading" className="mt-3 font-display text-[clamp(44px,8vw,110px)] leading-[0.9] text-form-bone">
            GET FIRST ACCESS TO DROP 001
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-form-stone">
            Join the waitlist and we will let you know as Drop 001 details are shared. The shop is not open yet.
          </p>
        </Reveal>
        <Reveal delay={100} className="self-center">
          <WaitlistForm
            interests={["eze_form"]}
            source="merch"
            enabled={enabled}
            tone="form"
            cta="JOIN THE WAITLIST"
            success="YOU'RE ON THE LIST."
            successNote="Thanks. We will be in touch about Drop 001."
            disabledTitle="WAITLIST OPENS SOON"
            disabledNote="The Drop 001 waitlist is not open yet. Check back shortly."
            consentLabel="Email me about Drop 001 and EZE // FORM releases."
            analyticsEvent="merch_waitlist_signup"
            analyticsSurface="merch_waitlist_form"
          />
        </Reveal>
      </div>
    </section>
  );
}

export function MerchFaq() {
  return (
    <section aria-labelledby="merch-faq-heading" className="bg-form-ink px-4 py-24 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <h2 id="merch-faq-heading" className="font-display text-[clamp(36px,5vw,64px)] leading-[0.95] text-form-bone">
          BEFORE YOU ASK.
        </h2>
        <div className="mt-8 divide-y divide-form-line border-y border-form-line">
          {formFaq.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-6 text-left text-lg font-medium text-form-bone marker:hidden [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden="true" className="font-mono transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-form-stone">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
