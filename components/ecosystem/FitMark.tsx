import Image from "next/image";
import { ezeFitAssets } from "@/config/assets";

const sizes = {
  sm: { text: "text-2xl", mark: 22 },
  md: { text: "text-4xl", mark: 34 },
  lg: { text: "text-6xl sm:text-7xl", mark: 56 },
} as const;

/**
 * EZE-FIT wordmark. The established runner mark is an owner-supplied asset (config/assets.ts) and is
 * rendered only when present — we do not draw a substitute logo. Until then the wordmark stands alone.
 */
export default function FitMark({ size = "md", className = "" }: { size?: keyof typeof sizes; className?: string }) {
  const s = sizes[size];
  const mark = ezeFitAssets.runnerMark;
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} role="img" aria-label="EZE-FIT">
      {mark && <Image src={mark.src} width={s.mark} height={s.mark} alt="" aria-hidden="true" />}
      <span aria-hidden="true" className={`font-display leading-none tracking-[0.06em] text-fit-lime ${s.text}`}>
        <span className="text-white">EZE</span>-FIT
      </span>
    </span>
  );
}
