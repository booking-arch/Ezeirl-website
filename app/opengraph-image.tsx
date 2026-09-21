import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "EZE IRL — Bad Decisions. Better Stories.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#0a0a0a",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Red radial glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(31,224,130,0.15) 0%, transparent 70%)",
          }}
        />

        {/* Top red accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(to right, transparent, #1fe082, transparent)",
          }}
        />

        {/* Bottom red accent bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(to right, transparent, #1fe082, transparent)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 0,
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* Eyebrow */}
          <p
            style={{
              color: "#1fe082",
              fontSize: 18,
              fontFamily: "monospace",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            FITNESS · IRL · STREAM
          </p>

          {/* Brand name */}
          <div
            style={{
              fontSize: 160,
              fontWeight: 900,
              color: "#f5f5f5",
              letterSpacing: "0.05em",
              lineHeight: 1,
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            EZE IRL
          </div>

          {/* Red rule */}
          <div
            style={{
              width: 120,
              height: 3,
              background: "#1fe082",
              marginBottom: 28,
            }}
          />

          {/* Tagline */}
          <p
            style={{
              color: "#888888",
              fontSize: 28,
              fontFamily: "monospace",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
            }}
          >
            BAD DECISIONS. BETTER STORIES.
          </p>
        </div>

        {/* Domain watermark */}
        <p
          style={{
            position: "absolute",
            bottom: 32,
            right: 48,
            color: "#2a2a2a",
            fontSize: 16,
            fontFamily: "monospace",
            letterSpacing: "0.1em",
          }}
        >
          ezeirl.com
        </p>
      </div>
    ),
    { ...size }
  );
}
