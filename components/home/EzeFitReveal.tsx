import { ezeFitAssets } from "@/config/assets";
import { fitCopy } from "@/config/ecosystem";
import CtaButton from "@/components/ecosystem/CtaButton";
import PhoneDevice from "@/components/ecosystem/PhoneDevice";
import PointerTilt from "@/components/ecosystem/PointerTilt";
import Reveal from "@/components/ecosystem/Reveal";

const today = ["Track meals", "Plan workouts", "Follow progress"] as const;

/** Homepage: EZE-FIT product reveal. Same world as EZE IRL, distinct technology identity. */
export default function EzeFitReveal() {
  return (
    <section id="eze-fit" aria-labelledby="home-fit-heading" className="theme-fit relative overflow-hidden bg-fit-ink py-24 sm:py-36">
      <div aria-hidden="true" className="fit-grid absolute inset-0" />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 55% 50% at 78% 45%, rgba(29,181,164,0.15), transparent 70%)" }}
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <Reveal>
            <p className="font-mono text-xs tracking-[0.3em] text-fit-lime">{fitCopy.label}</p>
            <h2 id="home-fit-heading" className="mt-5 font-display text-[clamp(44px,8.4vw,104px)] leading-[0.88] tracking-[0.01em] text-white">
              {fitCopy.homeHeadline.map((line, i) => (
                <span key={line} className={`block ${i === 2 ? "text-fit-lime" : ""}`}>
                  {line}
                </span>
              ))}
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-7 font-mono text-xs tracking-[0.25em] text-fit-mist">PRIVATE BETA — AVAILABLE BY INVITATION</p>
            <p className="mt-3 max-w-lg text-lg leading-relaxed text-fit-mist">{fitCopy.homeSupport}</p>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2" aria-label="What EZE-FIT does">
              {today.map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-sm text-white/85">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-fit-lime" />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <CtaButton href="/eze-fit#beta-access" tone="fit" event="eze_fit_beta_cta" surface="home_fit">
                REQUEST BETA ACCESS
              </CtaButton>
              <CtaButton href="/eze-fit" tone="fit-outline">
                EXPLORE EZE-FIT
              </CtaButton>
            </div>
          </Reveal>
        </div>

        <PointerTilt className="mt-2 lg:mt-0">
          <PhoneDevice screens={ezeFitAssets.screens} activeId="track" />
        </PointerTilt>
      </div>
    </section>
  );
}
