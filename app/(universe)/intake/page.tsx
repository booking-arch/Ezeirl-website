import type { Metadata } from "next";
import Link from "next/link";
import { INTAKE_DISCLAIMER, INTAKE_INTRO } from "@/config/intake";
import { INTAKE_GOOGLE_FORM_EMBED_URL, intakeGoogleFormEmbedUrl } from "@/config/intake-form";

const title = "New Client Intake & Fitness Questionnaire | EZE IRL";
const description = "New personal training client questionnaire: health history, current fitness level, goals and training preferences.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/intake" },
  // Direct-link working page. Kept out of search results and out of the sitemap.
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function IntakePage() {
  const embedUrl = intakeGoogleFormEmbedUrl();
  const configured = INTAKE_GOOGLE_FORM_EMBED_URL.trim().length > 0;

  return (
    <div className="bg-brand-black">
      <div className="mx-auto max-w-3xl px-4 pb-28 pt-24 sm:pb-24 sm:pt-40">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-red-bright">Personal Training</p>
        <h1 className="mt-2 font-display text-4xl tracking-[0.06em] text-brand-white sm:text-6xl">NEW CLIENT INTAKE</h1>
        <p className="mt-4 text-base leading-relaxed text-white/70">{INTAKE_INTRO}</p>
        <p className="mt-4 text-sm leading-relaxed text-white/80" role="note">
          {INTAKE_DISCLAIMER}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-white/60">
          The{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-white">
            privacy policy
          </Link>{" "}
          has not had attorney review yet.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-white/60">
          Answers go to the Google Form only. This website does not save them.
        </p>

        {embedUrl ? (
          <div className="mt-6 sm:mt-10">
            <iframe
              title="New client intake form"
              src={embedUrl}
              className="h-[70vh] min-h-[640px] w-full border border-brand-border bg-white"
            >
              Loading the intake form…
            </iframe>
            <p className="mt-3 text-sm text-white/70">
              <a href={embedUrl} className="underline underline-offset-2 hover:text-white" target="_blank" rel="noopener noreferrer">
                Open the intake form
              </a>
            </p>
          </div>
        ) : (
          <div
            className="mt-6 border border-dashed border-brand-red/70 bg-brand-card/40 p-6 sm:mt-10 sm:p-8"
            role="region"
            aria-label="Google Form placeholder"
            data-intake-placeholder
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-red-bright">Placeholder</p>
            <p className="mt-2 font-display text-3xl tracking-[0.06em] text-brand-white">GOOGLE FORM</p>
            <p className="mt-3 break-words text-sm leading-relaxed text-white/70">
              The intake form owned by booking@ezeirl.com is not connected yet. Paste its embed URL into{" "}
              <span className="font-mono text-brand-white">INTAKE_GOOGLE_FORM_EMBED_URL</span> in{" "}
              <span className="font-mono text-brand-white">config/intake-form.ts</span>.
              {configured ? " The current value is not a Google Forms embed URL, so nothing is loaded." : ""}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Until then, email{" "}
              <a href="mailto:booking@ezeirl.com" className="underline underline-offset-2 hover:text-white">
                booking@ezeirl.com
              </a>
              .
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
