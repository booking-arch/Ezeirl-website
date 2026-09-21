/**
 * Asset manifest for the EZE ecosystem pages. Real files are inserted by filling in a slot here
 * (and dropping the file under public/) — no component changes needed.
 *
 *   public/eze-fit/   brand/  screens/  video/  promo/     (EZE-FIT — REAL app captures only)
 *   public/eze-form/  collection/  products/<id>/  lifestyle/  video/
 *   public/eze-irl/   shared EZE IRL editorial imagery
 *
 * Rules (see ASSETS.md):
 *  - EZE-FIT screens must be real captures of shipped, marketing-safe functionality
 *    (docs/eze-fit-feature-matrix.md). Never mock-ups.
 *  - EZE // FORM images must be the real garments. No generated or stock stand-ins.
 *  - `null` means "awaiting approved asset". In production a null slot renders a brand-safe
 *    fallback that never resembles a product or a UI; in development it renders a labeled
 *    placeholder so the gap is obvious. See components/ecosystem/MediaSlot.tsx.
 */
export interface ImageAsset {
  src: string; // path under /public, e.g. "/eze-fit/screens/nutrition.webp"
  width: number;
  height: number;
  alt: string; // real, descriptive alt text — required
  blurDataURL?: string;
}

export interface VideoAsset {
  src: string; // mp4/webm under /public
  poster: ImageAsset; // required: shown before play and when motion is reduced
  type?: string;
}

/** Chapters of the /eze-fit phone story. Each may show one REAL screen. */
export type FitScreenId = "track" | "train" | "progress" | "understand";

export const ezeFitAssets = {
  /** Established runner mark (SVG preferred). Not present in the app repo as of 2026-09-21. */
  runnerMark: null as ImageAsset | null,
  wordmark: null as ImageAsset | null,
  screens: {
    track: null,
    train: null,
    progress: null,
    understand: null,
  } as Record<FitScreenId, ImageAsset | null>,
  /** Optional real screen recording used inside the hero phone. */
  heroScreenVideo: null as VideoAsset | null,
  shareImage: null as ImageAsset | null,
};

export interface FormProduct {
  id: string; // slug, stable — used in analytics (merch_product_view)
  /** Only set once the owner confirms it. Never invent product names. */
  name: string | null;
  colorway: string | null;
  description: string | null;
  views: {
    front: ImageAsset | null;
    back?: ImageAsset | null;
    side?: ImageAsset | null;
    detail?: ImageAsset[];
    alt?: ImageAsset[];
  };
}

export const ezeFormAssets = {
  /** Full-bleed collection hero / campaign image. */
  hero: null as ImageAsset | null,
  heroVideo: null as VideoAsset | null,
  /** Real products. Empty until approved imagery is supplied. */
  products: [] as FormProduct[],
  lifestyle: [] as ImageAsset[],
  shareImage: null as ImageAsset | null,
};

export function hasFitScreens(): boolean {
  return Object.values(ezeFitAssets.screens).some(Boolean);
}

export function hasFormProducts(): boolean {
  return ezeFormAssets.products.some((p) => p.views.front);
}
