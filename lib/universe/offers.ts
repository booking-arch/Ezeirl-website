/**
 * Unreleased EZE IRL offers: the free Faith & Fitness Starter Guide and the kitchen PDF.
 * Copy lives here, not in components (same rule as lib/universe/content.ts).
 *
 * These pages are review-only. They are noindex, omitted from the sitemap, disallowed in
 * robots.txt, and not linked from the public nav. Nothing here is for sale or for download.
 *
 * Still open with the owner (do not invent answers):
 * - Final titles
 * - Cookbook price approval ($9 launch / $14 regular are display-only)
 * - Email provider and when signup may collect
 * - Checkout provider
 * - Cover images
 * - Whether /privacy (still a draft) is the consent link
 * - Final recipe count (3 of 30 written — not a finished total)
 * - Scripture translation for the faith reflections
 */
export const GUIDE = {
  path: "/guide",
  eyebrow: "EZE IRL · Free guide",
  title: "Faith & Fitness Starter Guide",
  titleLine: "Faith & Fitness",
  titleScript: "Starter Guide",
  tagline: "God first. Then the work.",
  lede: "A 4-week beginner plan for your body, your plate, and your walk with God.",
  quiet: "No hype. No shortcuts. Just showing up.",
  availability: "The guide is not available to download yet.",
  contentsHeading: "What's inside",
  contents: [
    { title: "4-week gym plan", body: "A beginner plan you can follow for four weeks." },
    { title: "3 full-body workouts a week", body: "Three sessions a week, about 45–60 minutes each." },
    { title: "Exercise guide", body: "How to do the movements in the plan." },
    { title: "10 budget-friendly high-protein meals", body: "Simple meals you can shop for without a specialty store." },
    { title: "Weekly faith reflections", body: "A short reflection for each week of the plan." },
    { title: "Weekly check-in trackers", body: "A simple way to mark that you showed up." },
  ],
  signupHeading: "Get the guide",
  signupCta: "Get the free guide",
  disclaimer:
    "Not medical advice. This is a beginner starting point, not a diagnosis, a prescribed diet, or a promise of results.",
} as const;

export const COOKBOOK = {
  path: "/cookbook",
  eyebrow: "EZE IRL · PDF cookbook",
  workingTitle: true,
  title: "EZE IRL Kitchen: Real Food for Real Life",
  titleLine: "EZE IRL Kitchen",
  titleScript: "Real Food for Real Life",
  hook: "What they see: the gym clips. Reality: it starts in the kitchen.",
  lede: "A PDF cookbook. Real food for real life — written for the kitchen, not for a highlight reel.",
  availability: "Not for sale. Checkout is not connected, and the PDF is not delivered from this page.",
  contentsHeading: "What this is",
  contents: [
    { title: "A PDF", body: "One cookbook file. There is no print edition on this page." },
    { title: "Kitchen first", body: "Everyday cooking. The page does not claim a result from the food." },
    { title: "Still being written", body: "The recipe list is not finished. See the count note before you treat any number as final." },
  ],
  recipeFlag: "Recipe count is not final. 3 of 30 recipes are written. Do not read 30 as a finished total.",
  priceHeading: "Price",
  launchPrice: "$9",
  launchLabel: "Launch",
  regularPrice: "$14",
  regularLabel: "Regular",
  priceStatus: "Pending approval",
  priceNote: "These figures are for review only. They are not a confirmed price and not a live offer.",
  buyLabel: "Buy the cookbook",
  buyNote: "This button is a placeholder. It does not take payment.",
} as const;
