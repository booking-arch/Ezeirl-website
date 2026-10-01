import { ImageResponse } from "next/og";

export const alt = "EZE-FIT — Fitness Made EZE. Private beta.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Typographic only: brand line + status. No app screens are drawn (only real captures may ever be shown).
export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, background: "#060908", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 90px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 70% at 85% 30%, rgba(29,181,164,0.28), transparent 70%)" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "#c6f432" }} />
        <div style={{ display: "flex", fontSize: 26, letterSpacing: "0.3em", color: "#c6f432", fontFamily: "monospace", marginBottom: 28 }}>PRIVATE BETA · AVAILABLE BY INVITATION</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 168, fontWeight: 900, lineHeight: 0.92, color: "#ffffff", letterSpacing: "0.01em" }}>
          <div style={{ display: "flex" }}>FITNESS</div>
          <div style={{ display: "flex" }}>
            MADE <span style={{ color: "#c6f432", marginLeft: 26 }}>EZE</span>
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: "#ffffff", marginTop: 40, letterSpacing: "0.08em" }}>
          EZE<span style={{ color: "#c6f432" }}>-FIT</span>
        </div>
        <div style={{ position: "absolute", bottom: 34, right: 60, display: "flex", fontSize: 20, color: "#9db1a8", fontFamily: "monospace" }}>ezeirl.com/eze-fit</div>
      </div>
    ),
    { ...size },
  );
}
