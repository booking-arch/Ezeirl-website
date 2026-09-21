"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Button from "./UI/Button";
import { social } from "@/config/social";

const categories = [
  { id: "challenges", label: "CHALLENGES", accent: "#cc0000" },
  { id: "fitness", label: "FITNESS", accent: "#cc0000" },
  { id: "adventures", label: "ADVENTURES", accent: "#c9a84c" },
  { id: "lifestyle", label: "LIFESTYLE", accent: "#c9a84c" },
  { id: "irl", label: "IRL", accent: "#f5f5f5" },
  { id: "live", label: "LIVE", accent: "#cc0000" },
];

const featuredContent = [
  {
    id: "featured-1",
    label: "FEATURED",
    title: "Latest Upload",
    platform: "YOUTUBE",
    platformColor: "#cc0000",
    description: "New content drops weekly. Subscribe to never miss a video.",
    placeholder: true,
  },
  {
    id: "featured-2",
    label: "TRENDING",
    title: "Top TikTok",
    platform: "TIKTOK",
    platformColor: "#f5f5f5",
    description: "Short-form content. Real moments. No filter.",
    placeholder: true,
  },
  {
    id: "featured-3",
    label: "HIGHLIGHTS",
    title: "Recent Stream",
    platform: "TWITCH",
    platformColor: "#9147ff",
    description: "Catch the streams live — challenges, gaming, Q&As.",
    placeholder: true,
  },
];

function ContentCard({
  content,
  index,
}: {
  content: typeof featuredContent[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12 }}
      className="group relative overflow-hidden border border-brand-border/60 bg-brand-card/20 hover:border-brand-border transition-all duration-300"
      style={{ cursor: "default" }}
    >
      {/* Thumbnail placeholder */}
      <div
        className="aspect-video relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #111 0%, #1a1a1a 100%)" }}
        data-placeholder={`video-thumbnail-${content.id}`}
        aria-label={`${content.title} video thumbnail placeholder`}
      >
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-12 h-12 rounded-full flex items-center justify-center border border-brand-white/20 group-hover:border-brand-white/40 transition-all duration-300"
            style={{ background: "rgba(0,0,0,0.5)" }}
            whileHover={{ scale: 1.1 }}
          >
            <div
              className="w-0 h-0 ml-1"
              style={{
                borderTop: "8px solid transparent",
                borderBottom: "8px solid transparent",
                borderLeft: `14px solid ${content.platformColor}`,
              }}
              aria-hidden="true"
            />
          </motion.div>
        </div>

        {/* Platform badge */}
        <div className="absolute top-3 left-3">
          <span
            className="text-xs font-mono font-bold tracking-widest px-2 py-1"
            style={{
              color: content.platformColor,
              background: "rgba(0,0,0,0.7)",
              border: `1px solid ${content.platformColor}30`,
            }}
          >
            {content.platform}
          </span>
        </div>

        {/* Content label */}
        <div className="absolute top-3 right-3">
          <span className="text-xs font-mono tracking-widest text-brand-muted">
            {content.label}
          </span>
        </div>
      </div>

      {/* Card info */}
      <div className="p-4 sm:p-5">
        <h3
          className="text-brand-white text-lg font-display tracking-widest mb-1"
          style={{ fontFamily: "var(--font-bebas)" }}
        >
          {content.title}
        </h3>
        <p className="text-brand-muted text-xs leading-relaxed">{content.description}</p>
      </div>
    </motion.div>
  );
}

export default function WatchSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <section
      id="watch"
      className="py-24 sm:py-32 px-4 bg-brand-black relative overflow-hidden"
      aria-labelledby="watch-heading"
    >
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-20"
        style={{ background: "linear-gradient(to right, transparent, #888, transparent)" }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className="mb-12 sm:mb-16">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={headerInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="block text-brand-red text-xs font-mono tracking-[0.3em] uppercase mb-4"
          >
            WATCH
          </motion.span>
          <motion.h2
            id="watch-heading"
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-brand-white leading-[0.92] font-display mb-6"
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(36px, 7vw, 80px)",
              letterSpacing: "0.02em",
            }}
          >
            WATCH WHAT
            <br />
            <span className="text-brand-muted/40">HAPPENS NEXT.</span>
          </motion.h2>
        </div>

        {/* Category chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap gap-2 sm:gap-3 mb-12"
          role="list"
          aria-label="Content categories"
        >
          {categories.map((cat) => (
            <div key={cat.id} role="listitem">
              <span
                className="inline-block border text-xs font-mono tracking-widest uppercase px-3 py-1.5 transition-all duration-200"
                style={{
                  borderColor: `${cat.accent}30`,
                  color: cat.accent,
                  background: `${cat.accent}06`,
                }}
              >
                {cat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Featured content cards */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-12"
          role="list"
          aria-label="Featured content"
        >
          {featuredContent.map((content, i) => (
            <div key={content.id} role="listitem">
              <ContentCard content={content} index={i} />
            </div>
          ))}
        </div>

        {/* Platform CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
        >
          {social.youtube.url ? (
            <Button variant="primary" size="md" href={social.youtube.url} external>
              WATCH ON YOUTUBE
            </Button>
          ) : (
            <span className="inline-flex items-center gap-2 border border-brand-border/30 px-6 py-3 text-xs font-semibold tracking-widest uppercase text-brand-subtle/40 cursor-default">
              YOUTUBE COMING SOON
            </span>
          )}
          {social.tiktok.url ? (
            <Button variant="secondary" size="md" href={social.tiktok.url} external>
              FOLLOW ON TIKTOK
            </Button>
          ) : (
            <span className="inline-flex items-center gap-2 border border-brand-border/20 px-6 py-3 text-xs font-semibold tracking-widest uppercase text-brand-subtle/30 cursor-default">
              TIKTOK COMING SOON
            </span>
          )}
          {social.instagram.url ? (
            <Button variant="ghost" size="md" href={social.instagram.url} external>
              FOLLOW ON INSTAGRAM
            </Button>
          ) : null}
        </motion.div>

        {/* Platform note */}
        <p className="mt-6 text-brand-subtle text-xs font-mono">
          Videos and live content will populate this section as the channel grows.
        </p>
      </div>
    </section>
  );
}
