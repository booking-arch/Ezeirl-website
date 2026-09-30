"use client";

import Link from "next/link";
import { track } from "@/lib/analytics";

export default function ContentLink({
  href,
  itemId,
  children,
}: {
  href: string;
  itemId: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={() => track("content_click", { surface: "content", location: itemId })}
      className="mt-4 inline-flex min-h-[44px] items-center font-mono text-xs tracking-[0.2em] text-brand-white underline underline-offset-4 hover:text-brand-red-bright"
    >
      {children}
    </Link>
  );
}
