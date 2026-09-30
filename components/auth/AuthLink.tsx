"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AuthLink({ onNavigate, className }: { onNavigate?: () => void; className?: string }) {
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/session", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (!cancelled) setEmail(typeof data.email === "string" ? data.email : null);
      })
      .catch(() => {
        if (!cancelled) setEmail(null);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const signedIn = Boolean(email);
  return (
    <Link
      href={signedIn ? "/account" : "/login"}
      onClick={onNavigate}
      aria-label={signedIn ? "Your account" : "Log in"}
      className={className ?? "inline-flex min-h-[44px] items-center text-xs font-semibold uppercase tracking-widest text-white/70 hover:text-white"}
    >
      <span className={ready ? "" : "invisible"}>{signedIn ? "Account" : "Log in"}</span>
    </Link>
  );
}
