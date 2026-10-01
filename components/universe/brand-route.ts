import type { BrandId } from "@/lib/universe/content";

/** Which brand a pathname belongs to. Anything that is not /eze-fit or /eze-form is the EZE IRL brand. */
export function activeBrand(pathname: string | null): BrandId {
  if (pathname?.startsWith("/eze-fit")) return "eze-fit";
  if (pathname?.startsWith("/eze-form")) return "eze-form";
  return "irl";
}
