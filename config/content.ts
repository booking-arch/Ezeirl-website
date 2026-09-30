import { ezeIrlPhotos, type ImageAsset } from "./assets";
import { social } from "./social";

/**
 * Public EZE IRL content index. Photos are the approved set in `ezeIrlPhotos`.
 * A video entry is allowed only when its href is the confirmed URL in `config/social.ts`.
 * Do not add a video, handle, or thumbnail that is not already approved.
 */
export const CONTENT_CATEGORIES = ["fitness", "training", "lifestyle"] as const;
export type ContentCategory = (typeof CONTENT_CATEGORIES)[number];

export type ContentPlatform = keyof typeof social;

export interface ContentEntry {
  id: string;
  title: string;
  excerpt: string;
  category: ContentCategory;
  kind: "photo" | "video";
  platform: ContentPlatform | null;
  /** Date this entry was added to the public site (YYYY-MM-DD). */
  added: string;
  image: ImageAsset;
  /** On-site section, or a confirmed external URL for a video. */
  href: string;
}

const ADDED = "2026-09-22";

export const contentEntries: ContentEntry[] = [
  {
    id: "cable-row",
    title: "Seated cable row",
    excerpt: "EZE from behind, mid-set, in front of the kettlebell rack.",
    category: "training",
    kind: "photo",
    platform: null,
    added: ADDED,
    image: ezeIrlPhotos.hero,
    href: "/#home",
  },
  {
    id: "dumbbell-row",
    title: "Dumbbell row",
    excerpt: "A heavy dumbbell row, braced on the bench.",
    category: "training",
    kind: "photo",
    platform: null,
    added: ADDED,
    image: ezeIrlPhotos.dumbbellRow,
    href: "/#irl",
  },
  {
    id: "cable-row-side",
    title: "Cable row, side view",
    excerpt: "The same cable station, seen from the side.",
    category: "training",
    kind: "photo",
    platform: null,
    added: ADDED,
    image: ezeIrlPhotos.cableSide,
    href: "/#irl",
  },
  {
    id: "pull-up",
    title: "Pull-up",
    excerpt: "Hanging from the pull-up handles, seen from behind.",
    category: "training",
    kind: "photo",
    platform: null,
    added: ADDED,
    image: ezeIrlPhotos.pullUp,
    href: "/#irl",
  },
  {
    id: "incline-curl",
    title: "Incline curl",
    excerpt: "A low-angle incline curl on a dark gym bench.",
    category: "training",
    kind: "photo",
    platform: null,
    added: ADDED,
    image: ezeIrlPhotos.curlLow,
    href: "/#irl",
  },
  {
    id: "plate-hold",
    title: "Plate hold",
    excerpt: "Seated with a weight plate between sets.",
    category: "training",
    kind: "photo",
    platform: null,
    added: ADDED,
    image: ezeIrlPhotos.plate,
    href: "/#story",
  },
  {
    id: "incline-curl-roar",
    title: "Mid-set",
    excerpt: "An incline curl at full effort.",
    category: "fitness",
    kind: "photo",
    platform: null,
    added: ADDED,
    image: ezeIrlPhotos.curlRoar,
    href: "/#irl",
  },
  {
    id: "portrait",
    title: "Arms crossed",
    excerpt: "Headphones on, looking straight into the camera.",
    category: "lifestyle",
    kind: "photo",
    platform: null,
    added: ADDED,
    image: ezeIrlPhotos.portrait,
    href: "/#story",
  },
  {
    id: "between-sets",
    title: "Between sets",
    excerpt: "Leaning back on the bench, eyes closed, still in the headphones.",
    category: "lifestyle",
    kind: "photo",
    platform: null,
    added: ADDED,
    image: ezeIrlPhotos.bench,
    href: "/#story",
  },
  {
    id: "sunset-calisthenics",
    title: "Sunset calisthenics",
    excerpt: "A horizontal calisthenics jump against the sunset.",
    category: "lifestyle",
    kind: "photo",
    platform: null,
    added: ADDED,
    image: ezeIrlPhotos.sunset,
    href: "/#lifestyle",
  },
];

/** Returns human-readable problems. An empty list means the catalog is safe to publish. */
export function contentProblems(entries: ContentEntry[] = contentEntries): string[] {
  const problems: string[] = [];
  const knownSrc = new Set(Object.values(ezeIrlPhotos).map((p) => p.src));
  const seen = new Set<string>();
  for (const entry of entries) {
    if (!entry.title.trim() || !entry.excerpt.trim()) problems.push(`${entry.id} is missing a title or excerpt`);
    if (!entry.image.alt.trim()) problems.push(`${entry.id} is missing alt text`);
    if (!knownSrc.has(entry.image.src)) problems.push(`${entry.id} uses an image outside the approved photo set`);
    if (seen.has(entry.id)) problems.push(`duplicate id ${entry.id}`);
    seen.add(entry.id);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.added)) problems.push(`${entry.id} has a bad date`);
    if (entry.kind === "photo") {
      if (entry.platform !== null) problems.push(`${entry.id} is a photo with a platform`);
      if (!entry.href.startsWith("/")) problems.push(`${entry.id} must stay on this site`);
    } else {
      const url = entry.platform ? social[entry.platform].url : null;
      if (!entry.platform || !url || entry.href !== url) {
        problems.push(`${entry.id} must link to the confirmed ${entry.platform ?? "platform"} URL`);
      }
    }
  }
  return problems;
}
