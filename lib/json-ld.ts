/** Serialize structured data for a <script type="application/ld+json"> tag without allowing "</script>" breakouts. */
export function jsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export const SITE_URL = "https://www.ezeirl.com";
