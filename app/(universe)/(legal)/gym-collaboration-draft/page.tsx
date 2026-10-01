import type { Metadata } from "next";
export const metadata: Metadata = { title: "Gym Collaboration Draft — INTERNAL REVIEW ONLY | EZE IRL", robots: { index: false, follow: false } };

export default function GymCollaborationDraftPage() {
  return (
    <article>
      <div className="border border-brand-gold/40 bg-brand-gold/5 p-4 mb-8" role="alert">
        <p className="text-brand-gold text-xs font-mono tracking-widest uppercase font-bold">⚠ INTERNAL DRAFT — REQUIRES EZEKIEL&apos;S APPROVAL BEFORE SENDING</p>
        <p className="text-brand-muted text-xs font-mono mt-1">Do not share this URL publicly. Do not submit this proposal without Ezekiel reviewing and approving every detail.</p>
      </div>

      <h1 className="text-3xl font-display tracking-widest mb-2" style={{ fontFamily: "var(--font-oswald)" }}>Gym Filming Collaboration Proposal</h1>
      <p className="text-brand-muted text-xs font-mono mb-8">Draft for Ezekiel Cruz / EZE Media — Not for distribution</p>

      <div className="space-y-8 text-brand-muted text-sm leading-relaxed">
        <section>
          <h2 className="text-brand-white text-lg font-semibold mb-3">About the Creator: EZE</h2>
          <p>EZE is a Los Angeles-area content creator and athlete building EZE IRL — a fitness, competition, and real-life media brand. EZE IRL documents genuine gym training, physical challenges, IRL adventures, and real conversations through short-form and long-form video content.</p>
          <p className="mt-2">The brand is in early production with the goal of building an authentic, highly engaged fitness and lifestyle audience. Content is published across YouTube, TikTok, Instagram, and Twitch.</p>
        </section>

        <section>
          <h2 className="text-brand-white text-lg font-semibold mb-3">The EZE IRL Controlled Test Stream #1</h2>
          <p>EZE IRL is planning its first public livestream on September 5, 2026. The concept is a small-footprint, two-person production that combines a gym workout challenge with genuine conversation and an IRL adventure afterward.</p>
          <p className="mt-2 font-semibold text-brand-white">Production footprint:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Two-person crew: EZE (creator) + one support crew member</li>
            <li>Handheld camera and phone — no large equipment rigs</li>
            <li>No lighting rigs or tripod setups in high-traffic areas</li>
            <li>Estimated gym session: 60–90 minutes</li>
            <li>Budget: $100 maximum — no paid advertising on this pilot</li>
          </ul>
        </section>

        <section>
          <h2 className="text-brand-white text-lg font-semibold mb-3">How Your Gym Would Be Represented</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Mentioned by name in stream introduction and description</li>
            <li>Visible in video footage — clean, professional gym environment</li>
            <li>Potential short-form clip highlights showing the facility</li>
            <li>Authentic member-acquisition value: viewers see a real, active training environment</li>
            <li>No fabricated testimonials or paid endorsements — just real training</li>
          </ul>
        </section>

        <section>
          <h2 className="text-brand-white text-lg font-semibold mb-3">What We Commit To</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Full compliance with all facility rules and staff instructions</li>
            <li>No filming in locker rooms, bathrooms, or restricted areas</li>
            <li>Respect for all members — no filming anyone without their awareness</li>
            <li>No filming or livestreaming begins without written authorization</li>
            <li>Reasonable effort to avoid capturing copyrighted background music</li>
            <li>Prompt response to any concern raised by staff during the session</li>
            <li>No filming of minors without parental consent</li>
            <li>Full stop and reschedule if any authorization issue arises on the day</li>
          </ul>
        </section>

        <section>
          <h2 className="text-brand-white text-lg font-semibold mb-3">What We Need From You</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Written authorization from facility management to film and livestream on the premises</li>
            <li>A designated staff contact for the session day</li>
            <li>Any specific rules, restricted areas, or timing restrictions</li>
            <li>A signed filming release or permission agreement if required</li>
          </ul>
        </section>

        <section>
          <h2 className="text-brand-white text-lg font-semibold mb-3">Draft Outreach Message</h2>
          <div className="border border-brand-border p-5 bg-brand-card/20">
            <p className="text-brand-gold text-xs font-mono mb-3">DRAFT — Ezekiel must review and approve before sending. Customize [GYM NAME], [MANAGER NAME], and remove [BRACKETS] before use.</p>
            <div className="text-brand-muted text-sm space-y-3">
              <p>Subject: Filming Collaboration Request — EZE IRL Controlled Test Stream</p>
              <p>Hi [MANAGER NAME],</p>
              <p>My name is Ezekiel Cruz. I&apos;m a Los Angeles-based content creator building EZE IRL — a fitness and real-life media brand. I create gym challenge content, livestreams, and short-form videos focused on authentic training and real-life experiences.</p>
              <p>I&apos;m planning a small, two-person livestream at a local gym on September 5, 2026 — a 60 to 90-minute gym session combined with a fitness challenge. I&apos;m reaching out to ask if [GYM NAME] would be open to hosting the session and allowing us to film and livestream on the premises with your written permission.</p>
              <p>Our production footprint is minimal: two people, handheld camera and phone, no lighting rigs or large equipment. We would follow all facility rules, avoid restricted areas, and respect all members&apos; privacy throughout.</p>
              <p>I believe this is a genuine opportunity to showcase [GYM NAME] to a growing fitness audience — people who train seriously and are looking for a gym community.</p>
              <p>Would you be open to a brief conversation or email exchange to discuss the details? I&apos;m happy to answer any questions about the production, provide more information about the channel, or sign any required filming authorization documents.</p>
              <p>Thank you for your time.</p>
              <p>Ezekiel Cruz<br />EZE IRL / EZE Media<br />booking@ezeirl.com</p>
            </div>
          </div>
        </section>

        <div className="border border-brand-gold/40 p-4 mt-6">
          <p className="text-brand-gold text-xs font-mono">REMINDER: This is a draft. No gym has been contacted. No permission has been granted. Send only after Ezekiel reviews and approves.</p>
        </div>
      </div>
    </article>
  );
}
