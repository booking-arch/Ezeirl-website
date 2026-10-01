/**
 * Event helper for the EZE Universe pages. A no-op unless Google Analytics was loaded (only when
 * NEXT_PUBLIC_GA_ID is set, see app/(universe)/layout.tsx) and the visitor has not sent Do Not Track / Global
 * Privacy Control. Only primitive, non-identifying values are forwarded.
 */
type Primitive = string | number | boolean | undefined;
type Gtag = (command: "event", name: string, params?: Record<string, Primitive>) => void;

function optedOut(): boolean {
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  return nav.globalPrivacyControl === true || nav.doNotTrack === "1";
}

export function track(event: string, params: Record<string, Primitive> = {}): void {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag !== "function" || optedOut()) return;
  const clean: Record<string, Primitive> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined) continue;
    if (typeof v === "string" && (v.length > 100 || v.includes("@"))) continue; // never forward anything email-like
    clean[k] = v;
  }
  gtag("event", event, { page_path: window.location.pathname, ...clean });
}
