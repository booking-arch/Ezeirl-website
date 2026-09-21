import type { FitScreenId } from "./assets";

/** Primary navigation. Absolute paths so anchors also work from /eze-fit and /merch. */
export const navItems = [
  { label: "EZE IRL", href: "/#home", id: "home" },
  { label: "EZE-FIT", href: "/eze-fit", id: "eze-fit" },
  { label: "MERCH", href: "/merch", id: "merch" },
  { label: "STREAM", href: "/#stream", id: "stream" },
  { label: "PARTNERSHIPS", href: "/#partnerships", id: "partnerships" },
] as const;

/** Secondary destinations kept reachable (mobile menu + footer) without cluttering the header. */
export const secondaryNav = [
  { label: "WATCH", href: "/#watch" },
  { label: "COMMUNITY", href: "/#community" },
] as const;

/** Contextual header CTA per route. */
export const navCta = {
  "/eze-fit": { label: "REQUEST BETA ACCESS", href: "/eze-fit#beta-access", tone: "fit" },
  "/merch": { label: "GET EARLY ACCESS", href: "/merch#early-access", tone: "form" },
  default: { label: "JOIN IRL", href: "#community", tone: "irl" },
} as const;

/**
 * EZE-FIT copy. Every product claim here maps to a row in docs/eze-fit-feature-matrix.md.
 * Do not add a claim without adding its evidence there first.
 */
export const fitCopy = {
  label: "EZE-FIT — NOW IN BETA",
  status: "PRIVATE BETA",
  availability: "AVAILABLE BY INVITATION",
  tagline: "FITNESS MADE EZE",
  homeHeadline: ["YOUR FITNESS.", "YOUR DATA.", "YOUR EVOLUTION."],
  homeSupport:
    "EZE-FIT is currently available to a limited group of beta testers by invitation.",
  pageSupport:
    "Track your meals, plan your training, and follow your progress in one place. EZE-FIT is in private beta with a limited group of testers.",
  disclaimer:
    "EZE-FIT is beta software and may contain errors. Calorie and macro figures are estimates, not medical advice. It does not diagnose, treat, cure or prevent any condition. Talk to a qualified professional before changing your diet or training, and remember that results vary.",
} as const;

export interface FitChapter {
  id: FitScreenId;
  word: string;
  title: string;
  body: string;
  points: readonly string[];
  /** BETA chapters must always be shown with explicit beta context. */
  beta?: boolean;
}

/** Story chapters — verified functionality only. */
export const fitChapters: readonly FitChapter[] = [
  {
    id: "track",
    word: "TRACK.",
    title: "Know what you ate.",
    body: "Log meals and see calories, protein, carbs and fat against your daily targets.",
    points: ["Meal logging with daily totals", "Calorie and macro estimates from your profile"],
  },
  {
    id: "train",
    word: "TRAIN.",
    title: "Plan the work.",
    body: "Build programs, log your workouts, and browse an exercise library.",
    points: ["Programs and workout logging", "Exercise library"],
  },
  {
    id: "progress",
    word: "PROGRESS.",
    title: "See it add up.",
    body: "Follow measurements and trends over time, and earn points for staying consistent.",
    points: ["Measurements and trends", "FitPoints for consistency"],
  },
  {
    id: "understand",
    word: "UNDERSTAND.",
    title: "Learn as you go.",
    body: "Research tools are in beta. Sources are reviewed before summaries appear in the app.",
    points: ["Sourced research summaries (beta)"],
    beta: true,
  },
];

/** Features still being tested — always presented with beta context, never as finished. */
export const fitTesting = [
  { label: "Barcode scanning", note: "Camera-based food lookup. Coverage is still being tested." },
] as const;

export const fitBetaHelps = [
  "Bugs",
  "Confusing experiences",
  "Missing functionality",
  "Useful functionality",
  "Usability improvements",
  "New opportunities",
] as const;

export const fitFaq = [
  {
    q: "What is EZE-FIT?",
    a: "EZE-FIT is a fitness app for tracking meals, planning workouts and following progress. It is currently in private beta.",
  },
  {
    q: "Can I use it today?",
    a: "Access is by invitation while the beta runs. Request an invite and we will reach out when spots open.",
  },
  {
    q: "What is the difference between requesting an invite and getting launch updates?",
    a: "Requesting an invite puts you in line to test the private beta. Launch updates is a separate list that only tells you when EZE-FIT opens to everyone.",
  },
  {
    q: "Is it on the App Store or Google Play?",
    a: "Not yet. No store listings or public launch date have been announced.",
  },
  {
    q: "Does EZE-FIT give medical advice?",
    a: "No. Figures are estimates for general fitness purposes. Talk to a qualified professional about your health.",
  },
  {
    q: "What happens to my email?",
    a: "It is used only to contact you about the list you joined. See the Privacy Policy for details.",
  },
] as const;

/** EZE // FORM copy. No prices, materials, sizes, inventory or release date — none are confirmed. */
export const formCopy = {
  name: "EZE // FORM",
  line: ["BUILT FOR THE WORK.", "DESIGNED FOR EVERYTHING AFTER."],
  drop: "DROP 001",
  status: "COMING SOON",
  homeSupport: "The physical side of EZE. Drop 001 is on the way.",
  pageSupport: "EZE // FORM is the apparel line from EZE. Drop 001 is coming soon.",
} as const;

export const formFaq = [
  { q: "When does Drop 001 release?", a: "There is no release date yet. Join the waitlist and you will hear first." },
  { q: "Can I buy something now?", a: "Not yet. The shop is not open. This page is a preview of what is coming." },
  { q: "What does early access mean?", a: "Joining the list is how you hear about Drop 001. Details will be shared with the list as they are confirmed." },
] as const;
