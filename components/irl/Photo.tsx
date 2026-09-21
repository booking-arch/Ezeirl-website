import Image from "next/image";
import type { ImageAsset } from "@/config/assets";

interface PhotoProps {
  asset: ImageAsset;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Override the manifest focal point for a specific crop, e.g. a wide banner. */
  focal?: string;
  /** Skip the photographic grade (use for the one colour image where full colour is the point). */
  ungraded?: boolean;
}

/**
 * The single way EZE IRL photography enters a page: optimized next/image (AVIF/WebP, responsive srcset,
 * lazy unless `priority`), object-cover with the manifest focal point so crops keep the subject. The image
 * files on disk are never altered; grade and crop are presentation only. The caller sizes the container.
 */
export default function Photo({ asset, sizes, priority, className = "", focal, ungraded }: PhotoProps) {
  return (
    <Image
      src={asset.src}
      width={asset.width}
      height={asset.height}
      alt={asset.alt}
      sizes={sizes}
      priority={priority}
      quality={80}
      style={{ objectPosition: focal ?? asset.focal ?? "50% 50%" }}
      className={`h-full w-full object-cover ${ungraded ? "" : "grade"} ${className}`}
    />
  );
}
