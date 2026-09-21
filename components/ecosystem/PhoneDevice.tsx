import Image from "next/image";
import type { FitScreenId, ImageAsset } from "@/config/assets";
import FitMark from "./FitMark";

interface PhoneDeviceProps {
  screens: Record<FitScreenId, ImageAsset | null>;
  activeId: FitScreenId;
  /** First visible screen may be the LCP element on the hero. */
  priority?: boolean;
  className?: string;
}

/**
 * CSS-only device presentation (no WebGL). Depth comes from layered gradients and the parent's
 * PointerTilt / scroll behavior. The screen area shows ONLY real captures from config/assets.ts.
 * With no captures it shows a brand splash (wordmark + status) — never an invented app interface.
 */
export default function PhoneDevice({ screens, activeId, priority = false, className = "" }: PhoneDeviceProps) {
  const available = (Object.entries(screens) as [FitScreenId, ImageAsset | null][]).filter(
    (e): e is [FitScreenId, ImageAsset] => e[1] !== null,
  );
  const hasScreens = available.length > 0;

  return (
    <div className={`relative mx-auto w-[min(58vw,280px)] ${className}`}>
      {/* Ambient light: static radial gradients — no blur filter, no animation, negligible cost. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-[45%] -inset-y-[18%] -z-10"
        style={{
          background:
            "radial-gradient(closest-side, rgba(198,244,50,0.16), rgba(29,181,164,0.09) 55%, transparent 100%)",
        }}
      />

      <div
        className="relative aspect-[9/19.5] rounded-[2.7rem] p-[9px]"
        style={{
          background: "linear-gradient(150deg, #2a3630 0%, #0c110f 38%, #1b2621 100%)",
          boxShadow:
            "0 40px 80px -20px rgba(0,0,0,0.85), 0 0 0 1px rgba(198,244,50,0.14), inset 0 0 0 1px rgba(255,255,255,0.06)",
        }}
        {...(hasScreens ? { role: "img", "aria-label": "EZE-FIT app screen" } : { "aria-hidden": true })}
      >
        <div className="relative h-full w-full overflow-hidden rounded-[2.1rem] bg-fit-ink">
          {/* Dynamic island */}
          <div aria-hidden="true" className="absolute left-1/2 top-2.5 z-20 h-[22px] w-[76px] -translate-x-1/2 rounded-full bg-black" />

          {hasScreens ? (
            available.map(([id, asset], i) => (
              <Image
                key={id}
                src={asset.src}
                width={asset.width}
                height={asset.height}
                alt={id === activeId ? asset.alt : ""}
                aria-hidden={id === activeId ? undefined : true}
                sizes="(min-width: 1024px) 280px, 68vw"
                priority={priority && i === 0}
                className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 ${id === activeId ? "opacity-100" : "opacity-0"}`}
              />
            ))
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-[radial-gradient(ellipse_at_50%_30%,#16221c_0%,#060908_70%)]">
              <FitMark size="md" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-fit-mist">FITNESS MADE EZE</span>
              <span className="absolute bottom-9 rounded-full border border-fit-lime/40 px-3 py-1 font-mono text-[10px] tracking-[0.25em] text-fit-lime">
                PRIVATE BETA
              </span>
            </div>
          )}

          {/* Glass sheen */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10"
            style={{ background: "linear-gradient(115deg, rgba(255,255,255,0.07) 0%, transparent 32%)" }}
          />
        </div>
      </div>
    </div>
  );
}
