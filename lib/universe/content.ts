/**
 * Content for the "EZE Universe" pages (/, /eze-fit, /eze-form), carried over from the live ezeirl.com build
 * captured on 2026-10-01. Edit copy here, not in components.
 *
 * Owner rules that still apply (AGENTS.md): no invented prices / stock / release dates, no fake app screens
 * or merch imagery, EZE-FIT claims must stay inside docs/eze-fit-feature-matrix.md.
 */
import { SITE_EMAIL } from "./site";

export type BrandId = "irl" | "eze-fit" | "eze-form";

export const BRANDS: ReadonlyArray<{ id: BrandId; href: string; label: string }> = [
  { id: "irl", href: "/", label: "EZE IRL" },
  { id: "eze-fit", href: "/eze-fit", label: "EZE-FIT" },
  { id: "eze-form", href: "/eze-form", label: "EZE//FORM" },
];

/** Secondary nav, only shown on the EZE IRL home page. */
export const HOME_SECTIONS = [
  { href: "/#about", label: "ABOUT" },
  { href: "/#content", label: "CONTENT" },
] as const;

// ---- Social + music -------------------------------------------------------------------------------------------
// These handles are already published on the live site. They were NOT previously in config/social.ts (which is
// null per AGENTS.md); they are carried over for parity and flagged in docs/rebuild-2026-10.md for owner sign-off.
export const SOCIALS = [
  { label: "Instagram", short: "IG", handle: "itsezeirl", href: "https://www.instagram.com/itsezeirl/", platform: "instagram" },
  { label: "TikTok", short: "TT", handle: "@itsezeirl", href: "https://www.tiktok.com/@itsezeirl", platform: "tiktok" },
  { label: "YouTube", short: "YT", handle: "@ItsEzeIRL", href: "https://www.youtube.com/@ItsEzeIRL", platform: "youtube" },
  { label: "X", short: "X", handle: "@EzeIRL", href: "https://x.com/EzeIRL", platform: "x" },
] as const;

/**
 * Ambient background track for the sound dock. The live site referenced /audio/site-bed.mp3 but the file was never
 * supplied (the URL returned the HTML page). Set this to e.g. "/audio/site-bed.mp3" once a real, licensed file is in
 * public/audio/ and the "SOUND ON" toggle appears automatically; while null only the Spotify "LISTEN" panel shows.
 */
export const AMBIENT_AUDIO_SRC: string | null = null;

export const YOUTUBE_URL = "https://www.youtube.com/@ItsEzeIRL";

const SPOTIFY_ARTIST_ID = "3JY8QcGMe0RuoGJIzcmlO4";
export const SPOTIFY_URL = `https://open.spotify.com/artist/${SPOTIFY_ARTIST_ID}`;
export const spotifyEmbed = (theme: 0 | 1 = 0) => `https://open.spotify.com/embed/artist/${SPOTIFY_ARTIST_ID}?utm_source=generator&theme=${theme}`;
export const MUSIC_PLATFORMS = [
  { label: "Apple", href: "https://music.apple.com/us/artist/ezekiel-cruz/512301220", platform: "apple_music" },
  { label: "YT Music", href: "https://music.youtube.com/channel/UCcREyqCqjI6hPyGyh7EfFCA", platform: "yt_music" },
  { label: "SoundCloud", href: "https://soundcloud.com/ezekiel818", platform: "soundcloud" },
] as const;

// ---- mailto fallbacks (used while the gated waitlist is off) ---------------------------------------------------
export const MAILTO_FIT = `mailto:${SITE_EMAIL}?subject=EZE-FIT%20Private%20Beta&body=I%20want%20in%20on%20the%20private%20beta.`;
export const MAILTO_FORM = `mailto:${SITE_EMAIL}?subject=EZE%2F%2FFORM%20Notify&body=Notify%20me%20when%20EZE%2F%2FFORM%20Drop%20001%20lands.`;

// ---- Imagery (optimized WebP of the live-site assets: see scripts/optimize-universe-images.mjs) ----------------
const img = (p: string) => `/universe/${p}.webp`;
export const IMG = {
  logoWhite: img("brand/white"),
  logoCircle: img("brand/circle"),
  hero1: img("photos/hero-1"),
  hero2: img("photos/hero-2"),
  lifestyle1: img("photos/lifestyle-1"),
  lifestyle2: img("photos/lifestyle-2"),
  train1: img("photos/train-1"),
  train2: img("photos/train-2"),
} as const;

export const CATEGORIES = [
  { id: "fitness", title: "FITNESS", sub: "GET STRONGER", img: IMG.train1, href: "/#about" },
  { id: "nutrition", title: "NUTRITION", sub: "FUEL BETTER", img: IMG.lifestyle1, href: "/#about" },
  { id: "lifestyle", title: "LIFESTYLE", sub: "LIVE BIGGER", img: IMG.hero2, href: "/#about" },
  { id: "eze-fit", title: "EZE-FIT", sub: "TRAIN SMARTER", img: img("carousel/en-1"), href: "/eze-fit", brand: "eze-fit" },
  { id: "eze-form", title: "EZE//FORM", sub: "WEAR THE MINDSET", img: IMG.train2, href: "/eze-form", brand: "eze-form" },
  { id: "content", title: "CONTENT", sub: "REAL LIFE. NO FILTER.", img: IMG.lifestyle2, href: "/#content" },
] as const;

export const CONTENT_PILLARS = [
  { title: "RELATABLE HOOK", body: "Everyday friction — gym, food, ego, ambition — cut clean so people see themselves first." },
  { title: "GYM COMEDY", body: "Humor that respects the room. Roast the process, never the person." },
  { title: "DISCIPLINE / MINDSET", body: "Standards without guru theater. Quiet pressure. Honest reps." },
  { title: "REAL-LIFE EXPERIMENT", body: "Try it. Measure it. Report what actually changed — and what didn’t." },
  { title: "Q&A", body: "Direct answers. No fluff scripts. Audience questions drive the cut." },
  { title: "BTS / LIFESTYLE", body: "Behind the session — travel, craft, downtime. The human layer." },
] as const;

export const FRAMES = [
  { src: IMG.hero1, alt: "EZE IRL lifestyle frame" },
  { src: IMG.hero2, alt: "EZE IRL content still" },
  { src: IMG.train1, alt: "Training session still" },
  { src: IMG.train2, alt: "Training lifestyle still" },
  { src: IMG.lifestyle1, alt: "Lifestyle still" },
  { src: IMG.lifestyle2, alt: "Lifestyle still two" },
] as const;

// ---- EZE-FIT page ----------------------------------------------------------------------------------------------
export const FIT_PILLARS = [
  { title: "TRACK", desc: "Nutrition, macros, meals & progress — your data, your evolution." },
  { title: "TRAIN", desc: "Browse workouts, exercise library & recommendations built for real sessions." },
  { title: "FUEL", desc: "Meals, food logging & supplement awareness — fuel with intention." },
  { title: "LEARN", desc: "Research-backed insights without the noise. Knowledge fuels progress." },
  { title: "GROW", desc: "FitPoints, leaderboard & community pressure that stays healthy." },
] as const;

export const FIT_FEATURES = [
  "Login & profile", "9-step onboarding", "Metric + imperial", "Nutrition & macros", "Meals & food logging",
  "Workout recommendations", "Browse workouts", "Exercise library", "Progress tracking", "Research",
  "Supplements", "FitPoints", "Leaderboard", "Settings",
] as const;

export const FIT_STILL_BUILDING = [
  { title: "Barcode scanner", note: "Exists in beta — coverage is limited. Tell us which products miss." },
  { title: "Exercise library", note: "Expanding. Request the movements and workouts you need most." },
  { title: "Health integrations", note: "Limited today. Native device sync is being validated carefully." },
  { title: "AI coach", note: "Not fully autonomous yet. Deterministic systems first — smarter later." },
] as const;

export const FIT_CREATIVES = [
  { src: img("carousel/en-1"), label: "Welcome · Private Beta" },
  { src: img("carousel/en-2"), label: "Creative 02" },
  { src: img("carousel/en-3"), label: "Creative 03" },
  { src: img("carousel/en-4"), label: "Creative 04" },
  { src: img("carousel/en-5"), label: "Creative 05" },
] as const;

export type DemoScreenId = "home" | "train" | "track" | "grow" | "challenge";
export const DEMO_SCREENS: ReadonlyArray<{ id: DemoScreenId; label: string }> = [
  { id: "home", label: "HOME" },
  { id: "train", label: "TRAIN" },
  { id: "track", label: "TRACK" },
  { id: "grow", label: "GROW" },
  { id: "challenge", label: "CHALLENGE" },
];
export const DEMO_TRAIN_CARDS = [
  { name: "Upper Body", tag: "STRENGTH" },
  { name: "Lower Power", tag: "LEGS" },
  { name: "Core Circuit", tag: "CORE" },
  { name: "Mobility Flow", tag: "RECOVER" },
] as const;
/** Stylized bars for the demo HUD only: labelled "demo only" on screen, never real data. */
export const DEMO_TRACK_BARS = [
  { name: "Protein", pct: 72 },
  { name: "Carbs", pct: 58 },
  { name: "Fat", pct: 41 },
] as const;
export const DEMO_BOARD = [
  { rank: "01", name: "MAYA", highlight: false },
  { rank: "02", name: "MARCUS", highlight: false },
  { rank: "03", name: "JORDAN", highlight: false },
  { rank: "—", name: "YOU", highlight: true },
] as const;

// ---- EZE//FORM page --------------------------------------------------------------------------------------------
export type FormMode = "form" | "chaos";
export const FORM_PRODUCTS: ReadonlyArray<{ id: string; name: string; subtitle: string; spec: string; mode: FormMode; img: string; alt: string }> = [
  { id: "sig-grey", name: "SIGNATURE HOODIE", subtitle: "Washed Grey", spec: "450 GSM · Oversized · Custom embroidery", mode: "form", img: img("form/p1"), alt: "EZE//FORM Signature Hoodie in washed grey — Fall 2026 board" },
  { id: "sig-bone", name: "SIGNATURE HOODIE", subtitle: "Bone", spec: "450 GSM · Oversized · Custom embroidery", mode: "form", img: img("form/p2"), alt: "EZE//FORM Signature Hoodie in bone — Fall 2026 board" },
  { id: "tracksuit", name: "STATEMENT TRACKSUIT", subtitle: "Leopard / Cross sets", spec: "Heavyweight · Embroidered artwork · Oversized", mode: "chaos", img: img("form/p3"), alt: "EZE//FORM statement tracksuit sets — Fall 2026 board" },
  { id: "sig-earth", name: "SIGNATURE HOODIE", subtitle: "Earth", spec: "450 GSM · Oversized · Custom embroidery", mode: "form", img: img("form/p4"), alt: "EZE//FORM Signature Hoodie in earth — Fall 2026 board" },
  { id: "emboss", name: "EMBOSS HOODIE", subtitle: "Olive", spec: "450 GSM · 3D hood emboss · Premium hardware", mode: "form", img: img("form/p5"), alt: "EZE//FORM Emboss Hoodie in olive — Fall 2026 board" },
  { id: "global", name: "GLOBAL HOODIE", subtitle: "Worldwide seal", spec: "450 GSM · Back emboss · Built Different mark", mode: "chaos", img: img("form/p6"), alt: "EZE//FORM Global Hoodie — Fall 2026 board" },
  { id: "distressed", name: "DISTRESSED KNIT", subtitle: "Sweater", spec: "450 GSM knit · Layered distress · Raw edge", mode: "chaos", img: img("form/p7"), alt: "EZE//FORM Distressed Knit Sweater — Fall 2026 board" },
  { id: "panel", name: "PANEL HOODIE", subtitle: "Contrast panel", spec: "450 GSM · Panel embroidery · Oversized", mode: "form", img: img("form/p8"), alt: "EZE//FORM Panel Hoodie — Fall 2026 board" },
];

export const FORM_LOOKS = [
  { img: img("form/look-01"), label: "WORDMARK · EF · DISTORTED", caption: "Identity directions — not a SKU" },
  { img: img("form/look-02"), label: "MARK SYSTEM", caption: "Applications, hardware, color" },
  { img: img("form/look-03"), label: "LOGO COLLECTION", caption: "Primary · Monogram · Distorted" },
] as const;

export const FORM_ACCENTS = [
  "FORM FOLLOWS DISCIPLINE", "BUILT IN SILENCE", "UNDER CONSTRUCTION", "BECOME THE FORM", "BUILT THROUGH PRESSURE", "YOU ARE NEVER FINISHED",
] as const;

export const FORM_PILLARS = [
  { title: "BODY", body: "Cuts that hold the session and the street. Heavyweight fabric. Oversized where it earns it." },
  { title: "MIND", body: "Apparel as a signal — not costume. Marks that mean discipline, not decoration." },
  { title: "FORM", body: "You are never finished. Drop 001 is under construction until the craft is ready." },
] as const;

export const FORM_FILTERS: ReadonlyArray<readonly ["all" | FormMode, string]> = [["all", "ALL"], ["form", "FORM"], ["chaos", "CHAOS"]];
