import type { Metadata } from "next";
import Link from "next/link";
import BetaEmailForm from "@/components/eze-fit/BetaEmailForm";
import TrackView from "@/components/ecosystem/TrackView";
import { jsonLd, SITE_URL } from "@/lib/json-ld";
import { isWaitlistEnabled } from "@/lib/waitlist/config";

/**
 * This page mirrors the real EZE-FIT application's own production landing page (served at "/" on
 * the app itself) layout-for-layout and word-for-word, at the owner's explicit request — but is
 * deliberately NOT wired to that app in any way. It is a standalone ezeirl.com promo page with its
 * own email-collection waitlist (this site's own gated /api/waitlist, WAITLIST_ENABLED). It never
 * links to the real app, and carries no login: the real app is private, invitation-only, and not
 * meant to be reachable from a public marketing page. Every action on this page is a sign-up.
 * See CHANGELOG.md for the full list of what changed from the real page.
 */

const title = "EZE-FIT | Your Fitness. Your Data. Your Plan.";
const description =
  "EZE-Fit brings personalized nutrition, training guidance, macro tracking, progress, research, and a focused AI fitness coach into one evolving platform. Private beta, invitation only.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/eze-fit" },
  openGraph: { type: "website", url: `${SITE_URL}/eze-fit`, siteName: "EZE IRL", title, description },
  twitter: { card: "summary_large_image", title, description },
};

const features: [string, string][] = [
  ["Personalized onboarding", "Targets adapt to your body metrics, activity, training, preferences, and goals."],
  ["Macro tracking", "Track calories, protein, carbohydrates, fat, servings, quantities, and meals."],
  ["Food search + barcode", "Log everyday foods quickly, with a search fallback when camera access is unavailable."],
  ["Body Progress", "Capture private progress photos and measurements without turning progress into a clinical claim."],
  ["Fitness Coach", "Get focused guidance for training, nutrition, supplements, recovery, and body composition."],
  ["Research Memory", "See relevant approved evidence and citations behind recommendations."],
];

export default function EzeFitPage() {
  const enabled = isWaitlistEnabled();

  const structured = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "EZE-FIT",
    description,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    url: `${SITE_URL}/eze-fit`,
    publisher: { "@type": "Organization", name: "EZE Media", url: SITE_URL },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main id="main-content" className="overflow-hidden">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
          <Link href="/eze-fit" className="text-sm font-black tracking-[0.28em] text-emerald-300">
            EZE-FIT
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden h-fit items-center rounded-full bg-emerald-950 px-3 py-1 text-xs font-bold text-emerald-300 sm:inline-flex">
              PRIVATE BETA
            </span>
            <a href="#beta-signup" className="inline-flex min-h-[44px] items-center rounded-lg bg-emerald-400 px-4 py-2 font-bold text-slate-950">
              Join the Beta
            </a>
          </div>
        </nav>

        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:pb-28 lg:pt-20">
          <div>
            <span className="inline-flex h-fit items-center rounded-full bg-emerald-950 px-3 py-1 text-xs font-bold text-emerald-300">
              PRIVATE BETA · INVITATION ONLY
            </span>
            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[0.98] tracking-tight text-white sm:text-7xl">
              Your Fitness.
              <br />
              <span className="text-emerald-300">Your Data.</span>
              <br />
              Your Plan.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">{description}</p>
            <div id="beta-signup" className="mt-8 max-w-xl scroll-mt-24 rounded-2xl border border-emerald-400/20 bg-emerald-950/20 p-4 sm:p-5">
              <p className="font-bold text-white">Join the private beta</p>
              <p className="mt-1 text-sm text-slate-400">Help shape a smarter, more personal way to train.</p>
              <BetaEmailForm enabled={enabled} interest="eze_fit_beta" analyticsSurface="eze_fit_hero" />
              <p className="mt-3 text-sm text-slate-400">
                Not ready to test?{" "}
                <a href="#launch" className="font-bold text-emerald-300 hover:text-emerald-200">
                  Get notified at launch
                </a>
                .
              </p>
            </div>
          </div>

          <div className="relative rounded-[2rem] border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-emerald-950/30">
            <div aria-hidden="true" className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">FITNESS INTELLIGENCE</span>
                <span className="text-xs text-emerald-300">2026.09.v1</span>
              </div>
              <div className="rounded-2xl bg-slate-950 p-5">
                <p className="text-sm text-slate-400">Your plan, built around you</p>
                <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-2xl font-black text-white">Profile</p>
                    <p className="mt-1 text-xs text-slate-400">based targets</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-emerald-300">Macro</p>
                    <p className="mt-1 text-xs text-slate-400">tracking</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-cyan-300">Progress</p>
                    <p className="mt-1 text-xs text-slate-400">aware</p>
                  </div>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="block rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                  <p className="text-2xl" aria-hidden="true">◎</p>
                  <p className="mt-3 font-bold">Evidence-backed</p>
                  <p className="mt-1 text-sm text-slate-400">Recommendations with relevant research.</p>
                </div>
                <div className="block rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                  <p className="text-2xl" aria-hidden="true">↗</p>
                  <p className="mt-3 font-bold">Progress-aware</p>
                  <p className="mt-1 text-sm text-slate-400">A plan that evolves with your inputs.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature grid */}
        <section className="border-y border-slate-900 bg-slate-950/60">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">FITNESS INTELLIGENCE BUILT AROUND YOU</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight sm:text-5xl">One place for the signals that shape your next step.</h2>
            <p className="mt-5 max-w-2xl text-slate-400">
              EZE-Fit combines the daily details of fitness with clear, practical guidance—without pretending that a wellness platform is a
              medical diagnostic tool.
            </p>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(([featureTitle, copy]) => (
                <article className="block rounded-2xl border border-slate-800 bg-slate-900/60 p-5" key={featureTitle}>
                  <div aria-hidden="true" className="h-2 w-10 rounded-full bg-emerald-400" />
                  <h3 className="mt-6 text-xl font-black text-white">{featureTitle}</h3>
                  <p className="mt-3 leading-7 text-slate-400">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Research */}
        <section className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-2">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">RESEARCH-BACKED</p>
            <h2 className="mt-3 text-3xl font-black sm:text-5xl">See the science behind the recommendation.</h2>
            <p className="mt-5 leading-8 text-slate-400">
              Research Memory connects fitness and nutrition guidance to relevant approved evidence, peer-reviewed work, and authoritative
              sources where applicable. Citations stay visible so you can understand the reasoning.
            </p>
          </div>
          <div className="block self-center rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-sm font-bold text-emerald-300">THE COACH LANE</p>
            <h3 className="mt-3 text-2xl font-black">No random chatbot answers.</h3>
            <p className="mt-3 leading-7 text-slate-400">
              EZE-Fit Coach stays inside its fitness, nutrition, recovery, supplement, and wellness lane—with safety boundaries when a
              question needs professional medical evaluation.
            </p>
          </div>
        </section>

        {/* Progress */}
        <section className="border-y border-slate-900 bg-slate-950/60">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
            <div className="max-w-2xl">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">YOUR PROGRESS STAYS YOURS</p>
              <h2 className="mt-3 text-3xl font-black sm:text-5xl">Track more than the scale.</h2>
              <p className="mt-5 leading-8 text-slate-400">
                Body Progress gives you private, authenticated progress photos and measurements so you can see change over time. It is
                designed for personal tracking—not diagnosis, DEXA replacement, or exact body-fat scanning.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="block rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <p className="font-bold">Private storage</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">Only your authenticated account can access your progress media.</p>
              </div>
              <div className="block rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <p className="font-bold">Permission-aware</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">Use camera capture where available, or choose the upload fallback.</p>
              </div>
              <div className="block rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <p className="font-bold">Non-clinical by design</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">Progress context without medical claims.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section id="launch" className="mx-auto max-w-4xl scroll-mt-16 px-5 py-20 text-center sm:px-8">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">PRIVATE BETA</p>
          <h2 className="mt-3 text-3xl font-black sm:text-5xl">Help build the future of EZE-Fit.</h2>
          <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-400">
            Early testers will help improve recommendations, identify bugs, and influence what comes next.
          </p>
          <div className="mx-auto mt-8 max-w-xl">
            <BetaEmailForm compact enabled={enabled} interest="eze_fit_launch" analyticsSurface="eze_fit_launch" />
          </div>
        </section>

        <footer className="border-t border-slate-900">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <span>© 2026 EZE-Fit · Beta</span>
            <Link href="/" className="min-h-[44px] items-center hover:text-slate-300 sm:inline-flex">
              ← Back to EZE IRL
            </Link>
          </div>
        </footer>
      </main>

      <TrackView event="eze_fit_view" surface="eze_fit_page" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structured) }} />
    </div>
  );
}
