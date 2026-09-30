import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getCoachingIntake, isCoachingService } from "@/config/coaching";
import { ezeIrlBrand } from "@/config/assets";
import { isIntakeEnabled } from "@/lib/intake/config";
import IntakeForm from "@/components/intake/IntakeForm";
import styles from "@/components/portal/portal.module.css";

type Props = { params: Promise<{ service: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service } = await params;
  if (!isCoachingService(service)) return {};
  return {
    title: `${getCoachingIntake(service).title} Intake | EZE IRL`,
    description: getCoachingIntake(service).intro,
    alternates: { canonical: `/client-portal/${service}` },
    robots: { index: false, follow: false },
  };
}

export default async function CoachingIntakePage({ params }: Props) {
  const { service } = await params;
  if (!isCoachingService(service)) notFound();
  const intake = getCoachingIntake(service);
  return (
    <main id="main-content" className={styles.formPage}>
      <header className={styles.header}>
        <Image {...ezeIrlBrand.lockup} alt={ezeIrlBrand.lockup.alt} width={150} height={34} priority />
        <span className={styles.headerLabel}>CLIENT PORTAL</span>
      </header>
      <div className={styles.formContainer}>
        <Link href="/client-portal" className={styles.backLink}>← All coaching options</Link>
        <p className={styles.eyebrow}>{intake.eyebrow}</p>
        <h1 className={styles.formTitle}>{intake.title}</h1>
        <p className={styles.formIntro}>{intake.intro}</p>
        <IntakeForm enabled={isIntakeEnabled()} service={service} guided />
      </div>
    </main>
  );
}
