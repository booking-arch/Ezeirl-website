import type { Metadata } from "next";
import CoachDesk from "@/components/coach/CoachDesk";

export const metadata: Metadata = {
  title: "Coach desk | EZE IRL",
  description: "Review and publish a client's fitness and nutrition plan.",
  robots: { index: false, follow: false },
};

export default function CoachPage() {
  return (
    <main id="main-content" className="min-h-screen bg-brand-black px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[10px] tracking-[0.28em] text-brand-red-bright">EZE IRL</p>
        <h1 className="mt-2 font-display text-5xl tracking-wide text-brand-white sm:text-6xl" style={{ fontFamily: "var(--font-oswald)" }}>
          COACH DESK
        </h1>
        <p className="mb-8 mt-3 max-w-xl text-sm leading-relaxed text-brand-muted">
          Read the questionnaire, edit the draft, and publish when you want the client to see it. Nothing here is the private EZE-FIT app.
        </p>
        <CoachDesk />
      </div>
    </main>
  );
}
