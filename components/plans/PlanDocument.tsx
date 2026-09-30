import Image from "next/image";
import { ezeIrlBrand } from "@/config/assets";
import type { PublicPlan } from "@/lib/plans/public";
import styles from "@/components/portal/portal.module.css";

function Block({ title, body }: { title: string; body: string }) {
  return (
    <section className="mt-8 border-t border-white/10 pt-6">
      <h2 className="font-mono text-[10px] tracking-[0.22em] text-[#82aa93]">{title}</h2>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[#d7e0d8]">{body}</p>
    </section>
  );
}

export default function PlanDocument({ plan }: { plan: PublicPlan }) {
  return (
    <main id="main-content" className={styles.formPage}>
      <header className={styles.header}>
        <Image {...ezeIrlBrand.lockup} alt={ezeIrlBrand.lockup.alt} width={150} height={34} priority />
        <span className={styles.headerLabel}>YOUR PLAN</span>
      </header>
      <div className={styles.formContainer}>
        <p className={styles.eyebrow}>EZE IRL</p>
        <h1 className={styles.formTitle}>{plan.status === "published" ? plan.clientName : plan.status === "draft" ? "Your plan is being prepared" : "This page is not available"}</h1>
        {plan.status === "missing" ? (
          <p className={styles.formIntro}>This page is not available.</p>
        ) : plan.status === "draft" ? (
          <p className={styles.formIntro}>
            {plan.clientName}, your coach is reviewing your questionnaire and writing your fitness and nutrition plan. This page stays empty until that review is finished.
          </p>
        ) : (
          <>
            <p className={styles.formIntro}>
              {plan.serviceLabel}. This is the plan your coach published for you. It is coaching, not medical care.
            </p>
            <Block title="GOALS" body={plan.goals} />
            <Block title="IDEAL OUTCOME" body={plan.idealOutcome} />
            <Block title="FITNESS PLAN" body={plan.fitnessPlan} />
            <Block title="RECOMMENDED MEALS" body={plan.meals} />
            <Block title="SCHEDULE" body={plan.schedule} />
          </>
        )}
      </div>
    </main>
  );
}
