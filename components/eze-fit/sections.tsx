import { ezeFitAssets } from "@/config/assets";
import { fitBetaHelps, fitCopy, fitFaq, fitTesting } from "@/config/ecosystem";
import CtaButton from "@/components/ecosystem/CtaButton";
import FitMark from "@/components/ecosystem/FitMark";
import PhoneDevice from "@/components/ecosystem/PhoneDevice";
import PointerTilt from "@/components/ecosystem/PointerTilt";
import Reveal from "@/components/ecosystem/Reveal";
import WaitlistForm from "@/components/ecosystem/WaitlistForm";

export function FitHero() {
  return (
    <section aria-labelledby="fit-hero-title" className="relative overflow-hidden bg-fit-ink pb-24 pt-32 sm:pt-40">
      <div aria-hidden="true" className="fit-grid absolute inset-0" />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[70%]"
        style={{ background: "radial-gradient(ellipse 60% 55% at 70% 20%, rgba(29,181,164,0.16), transparent 70%)" }}
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="border border-fit-lime px-3 py-1.5 font-mono text-xs tracking-[0.25em] text-fit-lime">{fitCopy.status}</span>
            <span className="font-mono text-xs tracking-[0.25em] text-fit-mist">{fitCopy.availability}</span>
          </div>
          <div className="mt-8">
            <FitMark size="md" />
          </div>
          <h1 id="fit-hero-title" className="mt-4 font-display text-[clamp(64px,13vw,156px)] leading-[0.86] tracking-[0.01em] text-white">
            FITNESS
            <br />
            MADE <span className="text-fit-lime">EZE</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-fit-mist">{fitCopy.pageSupport}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <CtaButton href="#beta-access" tone="fit" event="eze_fit_beta_cta" surface="eze_fit_hero">
              REQUEST BETA ACCESS
            </CtaButton>
            <CtaButton href="#launch-waitlist" tone="fit-outline" event="eze_fit_beta_cta" surface="eze_fit_hero_launch">
              JOIN THE LAUNCH WAITLIST
            </CtaButton>
          </div>
        </div>

        <PointerTilt className="mt-2 lg:mt-0">
          <PhoneDevice screens={ezeFitAssets.screens} activeId="track" priority />
        </PointerTilt>
      </div>
    </section>
  );
}

export function StorySectionHeader() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:pt-36">
      <Reveal>
        <p className="font-mono text-xs tracking-[0.3em] text-fit-lime">WHAT IT DOES TODAY</p>
        <h2 className="mt-3 max-w-3xl font-display text-[clamp(40px,7vw,88px)] leading-[0.95] text-white">
          BUILT FOR THE DAILY WORK.
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-fit-mist">
          What follows is what the beta does now. We do not show features that are not ready.
        </p>
      </Reveal>
    </div>
  );
}

export function StillTesting() {
  return (
    <section aria-labelledby="testing-heading" className="mx-auto max-w-6xl px-4 pb-24">
      <Reveal className="border border-fit-line bg-fit-panel/50 p-7 sm:p-10">
        <p className="font-mono text-xs tracking-[0.3em] text-fit-teal">STILL BEING TESTED</p>
        <h2 id="testing-heading" className="mt-3 font-display text-4xl text-white sm:text-5xl">
          BETA FEATURES
        </h2>
        <ul className="mt-6 space-y-4">
          {fitTesting.map((f) => (
            <li key={f.label} className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
              <span className="font-medium text-white">
                {f.label} <span className="ml-2 border border-fit-teal/50 px-2 py-0.5 font-mono text-[10px] tracking-[0.2em] text-fit-teal">BETA</span>
              </span>
              <span className="text-sm text-fit-mist">{f.note}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

export function BetaExplainer() {
  return (
    <section aria-labelledby="beta-heading" className="border-y border-fit-line bg-fit-charcoal px-4 py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-2">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.3em] text-fit-lime">THE BETA</p>
          <h2 id="beta-heading" className="mt-3 font-display text-[clamp(44px,7vw,92px)] leading-[0.92] text-white">
            HELP BUILD WHAT COMES NEXT.
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-fit-mist">
            EZE-FIT is currently being tested by a limited group of users. Testers use the app the way anyone would, then tell us how it went.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <p className="font-mono text-xs tracking-[0.3em] text-white/60">TESTER FEEDBACK HELPS US FIND</p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {fitBetaHelps.map((h) => (
              <li key={h} className="flex items-center gap-3 border border-fit-line bg-fit-panel/60 px-4 py-4 text-white">
                <span aria-hidden="true" className="h-2 w-2 shrink-0 bg-fit-lime" />
                {h}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

export function BetaAccess({ enabled }: { enabled: boolean }) {
  return (
    <section id="beta-access" aria-labelledby="access-heading" className="scroll-mt-20 px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.3em] text-fit-lime">{fitCopy.status}</p>
          <h2 id="access-heading" className="mt-3 max-w-3xl font-display text-[clamp(40px,7vw,88px)] leading-[0.95] text-white">
            EZE-FIT IS CURRENTLY IN PRIVATE BETA.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-fit-mist">
            Two different lists. Pick the one that fits, or join both.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <Reveal className="border border-fit-line bg-fit-panel/50 p-7 sm:p-9">
            <p className="font-mono text-xs tracking-[0.3em] text-fit-lime">BECOME A TESTER</p>
            <h3 className="mt-2 font-display text-4xl text-white">TRY IT FIRST</h3>
            <p className="mb-7 mt-3 text-sm leading-relaxed text-fit-mist">
              Request an invite to the private beta. Spots are limited and invitations go out in waves.
            </p>
            <WaitlistForm
              interests={["eze_fit_beta"]}
              source="eze_fit"
              enabled={enabled}
              tone="fit"
              cta="REQUEST AN INVITE"
              success="YOU'RE ON THE LIST."
              successNote="Thanks. If a beta spot opens, we will be in touch."
              disabledTitle="BETA REQUESTS OPEN SOON"
              disabledNote="Invite requests are not open yet. Check back shortly."
              consentLabel="Email me about beta invitations and testing."
              analyticsEvent="eze_fit_beta_signup"
              analyticsSurface="eze_fit_beta_form"
            />
          </Reveal>

          <div id="launch-waitlist" className="scroll-mt-24">
          <Reveal delay={100} className="h-full border border-fit-line bg-fit-panel/50 p-7 sm:p-9">
            <p className="font-mono text-xs tracking-[0.3em] text-fit-teal">PUBLIC LAUNCH</p>
            <h3 className="mt-2 font-display text-4xl text-white">HEAR WHEN IT OPENS</h3>
            <p className="mb-7 mt-3 text-sm leading-relaxed text-fit-mist">
              Not ready to test? Get one email when EZE-FIT opens to everyone. No beta commitment.
            </p>
            <WaitlistForm
              interests={["eze_fit_launch"]}
              source="eze_fit"
              enabled={enabled}
              tone="fit"
              cta="NOTIFY ME AT LAUNCH"
              success="YOU'RE ON THE LIST."
              successNote="Thanks. We will let you know when EZE-FIT opens to everyone."
              disabledTitle="LAUNCH LIST OPENS SOON"
              disabledNote="The launch list is not open yet. Check back shortly."
              consentLabel="Email me when EZE-FIT launches."
              analyticsEvent="eze_fit_launch_signup"
              analyticsSurface="eze_fit_launch_form"
            />
          </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FitFaq() {
  return (
    <section aria-labelledby="faq-heading" className="border-t border-fit-line bg-fit-charcoal px-4 py-24 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.3em] text-fit-lime">QUESTIONS</p>
          <h2 id="faq-heading" className="mt-3 font-display text-[clamp(40px,6vw,72px)] leading-[0.95] text-white">
            THE SHORT ANSWERS.
          </h2>
        </Reveal>
        <div className="mt-10 divide-y divide-fit-line border-y border-fit-line">
          {fitFaq.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-6 text-left text-lg font-medium text-white marker:hidden [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden="true" className="font-mono text-fit-lime transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-fit-mist">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FitDisclaimer() {
  return (
    <section aria-label="Important information" className="bg-fit-ink px-4 py-12">
      <p className="mx-auto max-w-3xl text-center font-mono text-xs leading-relaxed text-fit-mist/80">{fitCopy.disclaimer}</p>
    </section>
  );
}
