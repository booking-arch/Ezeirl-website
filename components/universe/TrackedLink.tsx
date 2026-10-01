"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { track } from "@/lib/universe/track";

type Props = Omit<ComponentProps<"a">, "href" | "onClick"> & {
  href: string;
  event?: string;
  params?: Parameters<typeof track>[1];
  external?: boolean;
};

/** A link that reports a click event. Internal hrefs use next/link; mailto:, hash and external hrefs a plain anchor. */
export default function TrackedLink({ href, event, params, external, children, ...rest }: Props) {
  const onClick = () => { if (event) track(event, params); };
  const plain = external || /^(mailto:|tel:|#|https?:)/.test(href);
  if (plain) {
    return (
      <a href={href} onClick={onClick} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} onClick={onClick} {...rest}>
      {children}
    </Link>
  );
}
