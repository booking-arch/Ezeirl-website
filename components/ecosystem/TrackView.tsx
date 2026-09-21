"use client";

import { useEffect } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";

/** Fires a single page-view style event on mount. Renders nothing. */
export default function TrackView({ event, surface }: { event: AnalyticsEvent; surface?: string }) {
  useEffect(() => {
    track(event, { surface });
  }, [event, surface]);
  return null;
}
