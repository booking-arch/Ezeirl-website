"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { VideoAsset } from "@/config/assets";
import { useMotionTier } from "@/hooks/useMotionTier";

interface VideoLoopProps {
  video: VideoAsset;
  sizes: string;
  className?: string;
}

/**
 * Ambient looping video that is cheap by default:
 *  - poster is always rendered first; the <video> element is only mounted once it nears the viewport
 *  - plays only while visible, pauses offscreen and when the tab is hidden
 *  - muted + playsInline (required for autoplay); preload="none" so nothing downloads until needed
 *  - reduced motion and data-saver: poster only, the video is never fetched
 */
export default function VideoLoop({ video, sizes, className = "" }: VideoLoopProps) {
  const tier = useMotionTier();
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [saveData, setSaveData] = useState(false);
  const allowVideo = tier !== "static" && !saveData;

  useEffect(() => {
    setSaveData((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !allowVideo || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setNear(true);
      },
      { rootMargin: "200px 0px", threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [allowVideo]);

  // Drive playback from state so it also runs right after the <video> mounts.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const sync = () => (visible && !document.hidden ? void v.play().catch(() => {}) : v.pause());
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, [visible, near]);

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <Image src={video.poster.src} width={video.poster.width} height={video.poster.height} alt={video.poster.alt} sizes={sizes} className="h-full w-full object-cover" />
      {allowVideo && near && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          loop
          playsInline
          preload="none"
          poster={video.poster.src}
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src={video.src} type={video.type ?? "video/mp4"} />
        </video>
      )}
    </div>
  );
}
