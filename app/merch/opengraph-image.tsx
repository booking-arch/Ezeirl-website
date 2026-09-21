import { ImageResponse } from "next/og";

export const alt = "EZE // FORM — Drop 001, coming soon.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Typographic only: no garments are drawn. Real product imagery replaces this once supplied.
export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, background: "#0b0b0a", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 90px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -30, top: 40, display: "flex", fontSize: 620, fontWeight: 900, lineHeight: 0.8, color: "#171614", letterSpacing: "-0.04em" }}>001</div>
        <div style={{ display: "flex", fontSize: 24, letterSpacing: "0.35em", color: "#a39d90", fontFamily: "monospace", marginBottom: 26, position: "relative" }}>DROP 001 — COMING SOON</div>
        <div style={{ display: "flex", fontSize: 190, fontWeight: 900, lineHeight: 0.9, color: "#ece6da", letterSpacing: "0.01em", position: "relative" }}>EZE // FORM</div>
        <div style={{ display: "flex", fontSize: 29, fontWeight: 700, color: "#a39d90", marginTop: 36, letterSpacing: "0.03em", position: "relative" }}>BUILT FOR THE WORK. DESIGNED FOR EVERYTHING AFTER.</div>
        <div style={{ position: "absolute", bottom: 34, right: 60, display: "flex", fontSize: 20, color: "#4a4842", fontFamily: "monospace" }}>ezeirl.com/merch</div>
      </div>
    ),
    { ...size },
  );
}
