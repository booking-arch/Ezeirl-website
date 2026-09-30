"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ezeIrlBrand } from "@/config/assets";
import { COACHING_CHOICES } from "@/config/coaching";
import PortalSculpture from "./PortalSculpture";
import styles from "./portal.module.css";

function CoachingCard({ choice }: { choice: (typeof COACHING_CHOICES)[number] }) {
  const card = useRef<HTMLAnchorElement>(null);
  const reset = () => {
    card.current?.style.setProperty("--rx", "0deg");
    card.current?.style.setProperty("--ry", "0deg");
    card.current?.style.setProperty("--mx", "50%");
    card.current?.style.setProperty("--my", "50%");
  };
  return (
    <Link
      ref={card}
      href={`/client-portal/${choice.service}`}
      className={`${styles.card} ${choice.service === "nutrition-coaching" ? styles.nutrition : styles.training}`}
      aria-label={`Start ${choice.title.toLowerCase()} ${choice.emphasis.toLowerCase()} questionnaire`}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse" || !window.matchMedia("(prefers-reduced-motion: no-preference) and (hover: hover)").matches) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        event.currentTarget.style.setProperty("--rx", `${(0.5 - y) * 7}deg`);
        event.currentTarget.style.setProperty("--ry", `${(x - 0.5) * 9}deg`);
        event.currentTarget.style.setProperty("--mx", `${x * 100}%`);
        event.currentTarget.style.setProperty("--my", `${y * 100}%`);
      }}
      onPointerLeave={reset}
      onBlur={reset}
    >
      <div className={styles.cardTop}><span>{choice.tag}</span><span className={styles.number}>{choice.number}</span></div>
      <div className={styles.art} aria-hidden="true"><PortalSculpture kind={choice.service} /><span className={styles.artLabel}>{choice.caption}</span></div>
      <div className={styles.cardContent}>
        <h2>{choice.title}<br /><span>{choice.emphasis}</span></h2>
        <p>{choice.description}</p>
        <div className={styles.cardAction}><span>{choice.action}</span><span className={styles.arrow} aria-hidden="true">↗</span></div>
      </div>
    </Link>
  );
}

export default function ClientPortal() {
  return (
    <main id="main-content" className={`${styles.portal} grain`}>
      <div className={styles.ambient} aria-hidden="true" />
      <header className={styles.header}>
        <Image {...ezeIrlBrand.lockup} alt={ezeIrlBrand.lockup.alt} width={150} height={34} priority />
        <span className={styles.headerLabel}><span className={styles.statusDot} /> CLIENT PORTAL</span>
      </header>
      <div className={styles.content}>
        <div className={styles.intro}>
          <div><p className={styles.eyebrow}>WELCOME TO YOUR NEXT CHAPTER</p><h1>YOUR NEXT <span>level.</span></h1></div>
          <p className={styles.introCopy}>One decision. A new direction.<br />{" "}Choose where we start.</p>
        </div>
        <div className={styles.cards}>{COACHING_CHOICES.map((choice) => <CoachingCard key={choice.service} choice={choice} />)}</div>
        <footer className={styles.footer}><span>DISCIPLINE CREATES FREEDOM.</span><span className={styles.signature}>Better than yesterday.</span><span>EZE IRL / A HIGHER STATE</span></footer>
      </div>
    </main>
  );
}
