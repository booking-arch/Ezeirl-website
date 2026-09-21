import Image from "next/image";
import type { ImageAsset } from "@/config/assets";

interface MediaSlotProps {
  asset: ImageAsset | null | undefined;
  /** Human label for the missing asset, e.g. "EZE // FORM — product front". Shown in dev only. */
  label: string;
  /** What production shows when the asset is missing. Must never imitate a product or an app UI. */
  fallback?: React.ReactNode;
  sizes: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
}

/**
 * The single gate between manifest assets and the page.
 *  - asset present → optimized next/image (responsive srcset, lazy unless `priority`).
 *  - asset missing, development → dashed "AWAITING APPROVED ASSET" box so the gap is obvious.
 *  - asset missing, production → `fallback` (default: nothing). A placeholder is never shown to
 *    the public as if it were the real product.
 */
export default function MediaSlot({ asset, label, fallback = null, sizes, priority, className = "", imgClassName = "" }: MediaSlotProps) {
  if (asset) {
    return (
      <Image
        src={asset.src}
        width={asset.width}
        height={asset.height}
        alt={asset.alt}
        sizes={sizes}
        priority={priority}
        placeholder={asset.blurDataURL ? "blur" : "empty"}
        blurDataURL={asset.blurDataURL}
        className={imgClassName || className}
      />
    );
  }

  if (process.env.NODE_ENV !== "production") {
    return (
      <div
        data-asset-placeholder={label}
        role="img"
        aria-label={`Placeholder: ${label}`}
        className={`flex items-center justify-center border border-dashed border-white/25 bg-white/[0.03] p-4 text-center font-mono text-[10px] uppercase tracking-widest text-white/50 ${className}`}
      >
        AWAITING APPROVED ASSET
        <br />
        {label}
      </div>
    );
  }

  return <>{fallback}</>;
}
