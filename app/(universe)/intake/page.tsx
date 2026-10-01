import type { Metadata } from "next";
import IntakeForm from "@/components/intake/IntakeForm";
import { INTAKE_INTRO } from "@/config/intake";
import { isIntakeEnabled } from "@/lib/intake/config";

const title = "New Client Intake & Fitness Questionnaire | EZE IRL";
const description = "New personal training client questionnaire: health history, current fitness level, goals and training preferences.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/intake" },
  // Client-facing working page, shared by direct link: keep it out of search results.
  robots: { index: false, follow: false },
};

export default function IntakePage() {
  return (
    <>
      <div className="bg-brand-black">
        <div className="mx-auto max-w-3xl px-4 pb-24 pt-32 sm:pt-40">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-red-bright">Personal Training</p>
          <h1 className="mt-2 font-display text-5xl tracking-[0.06em] text-brand-white sm:text-6xl">NEW CLIENT INTAKE</h1>
          <p className="mb-12 mt-4 text-base leading-relaxed text-white/70">{INTAKE_INTRO}</p>
          <IntakeForm enabled={isIntakeEnabled()} />
        </div>
      </div>
    </>
  );
}
